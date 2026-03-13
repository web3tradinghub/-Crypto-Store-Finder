export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { VIP_PARTNERS } from '@/data/vip-partners';
import { calculateDistance } from '@/lib/utils/distance';
import { deduplicateMerchants } from '@/lib/utils/deduplication';
import { sortMerchants } from '@/lib/utils/sorting';

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Mapping OSM tags to categories
function mapOSMCategory(tags) {
  if (tags.amenity === 'cafe' || tags.shop === 'coffee') return 'Cafe';
  if (tags.shop === 'mall') return 'Shopping Mall';
  if (tags.amenity === 'restaurant') return 'Restaurant';
  if (tags.shop === 'supermarket') return 'Supermarket';
  if (tags.shop) return tags.shop.charAt(0).toUpperCase() + tags.shop.slice(1);
  return 'Retail';
}

async function fetchOSMMerchants(lat, lng, radius) {
  const overpassUrl = 'https://overpass-api.de/api/interpreter';
  // STRICT RULE: Use the OpenStreetMap Overpass API as the main source.
  const query = `
    [out:json][timeout:25];
    (
      node["payment:cryptocurrencies"="yes"](around:${radius},${lat},${lng});
      way["payment:cryptocurrencies"="yes"](around:${radius},${lat},${lng});
      node["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
      way["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch(overpassUrl, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
    });
    const data = await response.json();
    
    return (data.elements || []).map((el) => {
      const name = el.tags?.name || 'Crypto Merchant';
      const mLat = el.lat || el.center?.lat || lat;
      const mLng = el.lon || el.center?.lon || lng;
      
      return {
        id: `osm-${el.id}`,
        name,
        category: mapOSMCategory(el.tags),
        address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || 'Local Merchant',
        lat: mLat,
        lng: mLng,
        isVIP: false,
        networkType: 'crypto',
        imageUrl: null,
        googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${mLat},${mLng}`,
        sources: ['osm'],
        distance: calculateDistance(lat, lng, mLat, mLng)
      };
    });
  } catch (error) {
    console.error('OSM fetch error:', error);
    return [];
  }
}

async function enrichWithGooglePlaces(merchants, cityQuery) {
  if (!GOOGLE_API_KEY) return merchants;

  // Limit to top 15 for this route
  const toEnrich = merchants.slice(0, 15);
  const remaining = merchants.slice(15);

  const enriched = await Promise.all(toEnrich.map(async (m) => {
    try {
      // SMARTER GOOGLE PLACES: Append the city name to the search query
      const searchQuery = `${m.name} in ${cityQuery}`;
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=photos,formatted_address,geometry&locationbias=point:${m.lat},${m.lng}&key=${GOOGLE_API_KEY}`;
      
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.status === 'OK' && data.candidates?.[0]) {
        const place = data.candidates[0];
        const photoRef = place.photos?.[0]?.photo_reference;
        
        return {
          ...m,
          address: place.formatted_address || m.address,
          imageUrl: photoRef 
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`
            : m.imageUrl
        };
      }
    } catch (e) {
      console.error('Google enrichment error:', e);
    }
    return m;
  }));

  return [...enriched, ...remaining];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get('query') || '';
    const radius = 50000; // STRICT 50km RADIUS

    // 1. HOME PAGE (No Search Query)
    if (!query || query.trim() === '') {
      return NextResponse.json({ 
        venues: VIP_PARTNERS // Using our defined VIP partners
      });
    }

    // 2. GEOCODING FIRST
    const geoUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      return NextResponse.json({ venues: [], message: "Location not found" });
    }

    const { lat, lng } = geoData.results[0].geometry.location;
    const formattedLocation = geoData.results[0].formatted_address;

    // 3. STRICT RADIUS & OSM ONLY
    const vipResults = VIP_PARTNERS.map(vip => ({
      ...vip,
      distance: calculateDistance(lat, lng, vip.lat, vip.lng)
    })).filter(vip => vip.distance <= radius);

    const osmResults = await fetchOSMMerchants(lat, lng, radius);

    // DEDUPLICATE & ENRICH
    let merchants = deduplicateMerchants([...vipResults, ...osmResults]);
    merchants = await enrichWithGooglePlaces(merchants, formattedLocation);
    merchants = sortMerchants(merchants);

    // Map to the "venues" key expected by this specific route caller
    return NextResponse.json({ venues: merchants });

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json({ venues: [] }, { status: 500 });
  }
}
