export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
const MAX_RESULTS = 200;

const COUNTRY_COORDS: Record<string, {lat: number, lng: number, name: string}> = {
  'saudi arabia': { lat: 24.6877, lng: 46.6857, name: 'Riyadh, Saudi Arabia' },
  'ksa': { lat: 24.6877, lng: 46.6857, name: 'Riyadh, Saudi Arabia' },
  'usa': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
  'united states': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
  'united states of america': { lat: 40.7128, lng: -74.0060, name: 'New York, USA' },
  'uk': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  'united kingdom': { lat: 51.5074, lng: -0.1278, name: 'London, UK' },
  'uae': { lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE' },
  'pakistan': { lat: 31.5204, lng: 74.3587, name: 'Lahore, Pakistan' },
  'india': { lat: 28.6139, lng: 77.2090, name: 'New Delhi, India' },
  'germany': { lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany' },
  'france': { lat: 48.8566, lng: 2.3522, name: 'Paris, France' },
  'japan': { lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan' },
  'australia': { lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia' },
  'canada': { lat: 43.6532, lng: -79.3832, name: 'Toronto, Canada' },
  'brazil': { lat: -23.5505, lng: -46.6333, name: 'Sao Paulo, Brazil' },
  'nigeria': { lat: 6.5244, lng: 3.3792, name: 'Lagos, Nigeria' },
  'turkey': { lat: 41.0082, lng: 28.9784, name: 'Istanbul, Turkey' },
  'egypt': { lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt' },
  'indonesia': { lat: -6.2088, lng: 106.8456, name: 'Jakarta, Indonesia' },
  'thailand': { lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand' },
  'singapore': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  'malaysia': { lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur, Malaysia' },
  'south korea': { lat: 37.5665, lng: 126.9780, name: 'Seoul, South Korea' },
  'china': { lat: 31.2304, lng: 121.4737, name: 'Shanghai, China' },
  'russia': { lat: 55.7558, lng: 37.6173, name: 'Moscow, Russia' },
  'mexico': { lat: 19.4326, lng: -99.1332, name: 'Mexico City, Mexico' },
  'argentina': { lat: -34.6037, lng: -58.3816, name: 'Buenos Aires, Argentina' },
  'netherlands': { lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands' },
  'spain': { lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain' },
  'italy': { lat: 41.9028, lng: 12.4964, name: 'Rome, Italy' },
  'portugal': { lat: 38.7223, lng: -9.1393, name: 'Lisbon, Portugal' },
  'switzerland': { lat: 47.3769, lng: 8.5417, name: 'Zurich, Switzerland' },
};

const COUNTRY_CAPITALS: Record<string, {lat: number, lng: number, name: string}> = {
  // Americas
  'usa': {lat: 40.7128, lng: -74.0060, name: 'New York, USA'},
  'new york': {lat: 40.7128, lng: -74.0060, name: 'New York, USA'},
  'los angeles': {lat: 34.0522, lng: -118.2437, name: 'Los Angeles, USA'},
  'chicago': {lat: 41.8781, lng: -87.6298, name: 'Chicago, USA'},
  'miami': {lat: 25.7617, lng: -80.1918, name: 'Miami, USA'},
  'san francisco': {lat: 37.7749, lng: -122.4194, name: 'San Francisco, USA'},
  'las vegas': {lat: 36.1699, lng: -115.1398, name: 'Las Vegas, USA'},
  'canada': {lat: 43.6532, lng: -79.3832, name: 'Toronto, Canada'},
  'toronto': {lat: 43.6532, lng: -79.3832, name: 'Toronto, Canada'},
  'vancouver': {lat: 49.2827, lng: -123.1207, name: 'Vancouver, Canada'},
  'mexico': {lat: 19.4326, lng: -99.1332, name: 'Mexico City, Mexico'},
  'mexico city': {lat: 19.4326, lng: -99.1332, name: 'Mexico City, Mexico'},
  'brazil': {lat: -23.5505, lng: -46.6333, name: 'Sao Paulo, Brazil'},
  'sao paulo': {lat: -23.5505, lng: -46.6333, name: 'Sao Paulo, Brazil'},
  'rio': {lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro, Brazil'},
  'argentina': {lat: -34.6037, lng: -58.3816, name: 'Buenos Aires, Argentina'},
  'buenos aires': {lat: -34.6037, lng: -58.3816, name: 'Buenos Aires, Argentina'},
  'colombia': {lat: 4.7110, lng: -74.0721, name: 'Bogota, Colombia'},
  'chile': {lat: -33.4489, lng: -70.6693, name: 'Santiago, Chile'},
  'peru': {lat: -12.0464, lng: -77.0428, name: 'Lima, Peru'},
  'venezuela': {lat: 10.4806, lng: -66.9036, name: 'Caracas, Venezuela'},
  'el salvador': {lat: 13.6929, lng: -89.2182, name: 'San Salvador, El Salvador'},
  
  // Europe
  'uk': {lat: 51.5074, lng: -0.1278, name: 'London, UK'},
  'london': {lat: 51.5074, lng: -0.1278, name: 'London, UK'},
  'england': {lat: 51.5074, lng: -0.1278, name: 'London, UK'},
  'manchester': {lat: 53.4808, lng: -2.2426, name: 'Manchester, UK'},
  'germany': {lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany'},
  'berlin': {lat: 52.5200, lng: 13.4050, name: 'Berlin, Germany'},
  'munich': {lat: 48.1351, lng: 11.5820, name: 'Munich, Germany'},
  'frankfurt': {lat: 50.1109, lng: 8.6821, name: 'Frankfurt, Germany'},
  'france': {lat: 48.8566, lng: 2.3522, name: 'Paris, France'},
  'paris': {lat: 48.8566, lng: 2.3522, name: 'Paris, France'},
  'spain': {lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain'},
  'madrid': {lat: 40.4168, lng: -3.7038, name: 'Madrid, Spain'},
  'barcelona': {lat: 41.3851, lng: 2.1734, name: 'Barcelona, Spain'},
  'italy': {lat: 41.9028, lng: 12.4964, name: 'Rome, Italy'},
  'rome': {lat: 41.9028, lng: 12.4964, name: 'Rome, Italy'},
  'milan': {lat: 45.4642, lng: 9.1900, name: 'Milan, Italy'},
  'netherlands': {lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands'},
  'amsterdam': {lat: 52.3676, lng: 4.9041, name: 'Amsterdam, Netherlands'},
  'portugal': {lat: 38.7169, lng: -9.1399, name: 'Lisbon, Portugal'},
  'lisbon': {lat: 38.7169, lng: -9.1399, name: 'Lisbon, Portugal'},
  'switzerland': {lat: 47.3769, lng: 8.5417, name: 'Zurich, Switzerland'},
  'zurich': {lat: 47.3769, lng: 8.5417, name: 'Zurich, Switzerland'},
  'austria': {lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria'},
  'vienna': {lat: 48.2082, lng: 16.3738, name: 'Vienna, Austria'},
  'sweden': {lat: 59.3293, lng: 18.0686, name: 'Stockholm, Sweden'},
  'stockholm': {lat: 59.3293, lng: 18.0686, name: 'Stockholm, Sweden'},
  'norway': {lat: 59.9139, lng: 10.7522, name: 'Oslo, Norway'},
  'denmark': {lat: 55.6761, lng: 12.5683, name: 'Copenhagen, Denmark'},
  'finland': {lat: 60.1699, lng: 24.9384, name: 'Helsinki, Finland'},
  'poland': {lat: 52.2297, lng: 21.0122, name: 'Warsaw, Poland'},
  'czech': {lat: 50.0755, lng: 14.4378, name: 'Prague, Czech Republic'},
  'prague': {lat: 50.0755, lng: 14.4378, name: 'Prague, Czech Republic'},
  'hungary': {lat: 47.4979, lng: 19.0402, name: 'Budapest, Hungary'},
  'budapest': {lat: 47.4979, lng: 19.0402, name: 'Budapest, Hungary'},
  'romania': {lat: 44.4268, lng: 26.1025, name: 'Bucharest, Romania'},
  'greece': {lat: 37.9838, lng: 23.7275, name: 'Athens, Greece'},
  'turkey': {lat: 41.0082, lng: 28.9784, name: 'Istanbul, Turkey'},
  'istanbul': {lat: 41.0082, lng: 28.9784, name: 'Istanbul, Turkey'},
  'ukraine': {lat: 50.4501, lng: 30.5234, name: 'Kyiv, Ukraine'},
  'russia': {lat: 55.7558, lng: 37.6173, name: 'Moscow, Russia'},
  'moscow': {lat: 55.7558, lng: 37.6173, name: 'Moscow, Russia'},
  'estonia': {lat: 59.4370, lng: 24.7536, name: 'Tallinn, Estonia'},
  'malta': {lat: 35.8997, lng: 14.5147, name: 'Valletta, Malta'},
  'croatia': {lat: 45.8150, lng: 15.9819, name: 'Zagreb, Croatia'},
  'serbia': {lat: 44.8176, lng: 20.4633, name: 'Belgrade, Serbia'},
  'slovakia': {lat: 48.1486, lng: 17.1077, name: 'Bratislava, Slovakia'},
  'bulgaria': {lat: 42.6977, lng: 23.3219, name: 'Sofia, Bulgaria'},
  'ireland': {lat: 53.3498, lng: -6.2603, name: 'Dublin, Ireland'},
  'dublin': {lat: 53.3498, lng: -6.2603, name: 'Dublin, Ireland'},
  'belgium': {lat: 50.8503, lng: 4.3517, name: 'Brussels, Belgium'},
  'brussels': {lat: 50.8503, lng: 4.3517, name: 'Brussels, Belgium'},

  // Middle East
  'uae': {lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE'},
  'dubai': {lat: 25.2048, lng: 55.2708, name: 'Dubai, UAE'},
  'abu dhabi': {lat: 24.4539, lng: 54.3773, name: 'Abu Dhabi, UAE'},
  'saudi arabia': {lat: 24.7136, lng: 46.6753, name: 'Riyadh, Saudi Arabia'},
  'qatar': {lat: 25.2854, lng: 51.5310, name: 'Doha, Qatar'},
  'kuwait': {lat: 29.3759, lng: 47.9774, name: 'Kuwait City, Kuwait'},
  'bahrain': {lat: 26.2235, lng: 50.5876, name: 'Manama, Bahrain'},
  'israel': {lat: 32.0853, lng: 34.7818, name: 'Tel Aviv, Israel'},
  'jordan': {lat: 31.9454, lng: 35.9284, name: 'Amman, Jordan'},
  'lebanon': {lat: 33.8938, lng: 35.5018, name: 'Beirut, Lebanon'},

  // Asia
  'japan': {lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan'},
  'tokyo': {lat: 35.6762, lng: 139.6503, name: 'Tokyo, Japan'},
  'osaka': {lat: 34.6937, lng: 135.5023, name: 'Osaka, Japan'},
  'south korea': {lat: 37.5665, lng: 126.9780, name: 'Seoul, South Korea'},
  'seoul': {lat: 37.5665, lng: 126.9780, name: 'Seoul, South Korea'},
  'china': {lat: 31.2304, lng: 121.4737, name: 'Shanghai, China'},
  'shanghai': {lat: 31.2304, lng: 121.4737, name: 'Shanghai, China'},
  'hong kong': {lat: 22.3193, lng: 114.1694, name: 'Hong Kong'},
  'singapore': {lat: 1.3521, lng: 103.8198, name: 'Singapore'},
  'thailand': {lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand'},
  'bangkok': {lat: 13.7563, lng: 100.5018, name: 'Bangkok, Thailand'},
  'vietnam': {lat: 10.8231, lng: 106.6297, name: 'Ho Chi Minh City, Vietnam'},
  'malaysia': {lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur, Malaysia'},
  'kuala lumpur': {lat: 3.1390, lng: 101.6869, name: 'Kuala Lumpur, Malaysia'},
  'indonesia': {lat: -6.2088, lng: 106.8456, name: 'Jakarta, Indonesia'},
  'jakarta': {lat: -6.2088, lng: 106.8456, name: 'Jakarta, Indonesia'},
  'bali': {lat: -8.3405, lng: 115.0920, name: 'Bali, Indonesia'},
  'philippines': {lat: 14.5995, lng: 120.9842, name: 'Manila, Philippines'},
  'india': {lat: 19.0760, lng: 72.8777, name: 'Mumbai, India'},
  'mumbai': {lat: 19.0760, lng: 72.8777, name: 'Mumbai, India'},
  'delhi': {lat: 28.6139, lng: 77.2090, name: 'New Delhi, India'},
  'bangalore': {lat: 12.9716, lng: 77.5946, name: 'Bangalore, India'},
  'pakistan': {lat: 24.8607, lng: 67.0011, name: 'Karachi, Pakistan'},
  'karachi': {lat: 24.8607, lng: 67.0011, name: 'Karachi, Pakistan'},
  'nepal': {lat: 27.7172, lng: 85.3240, name: 'Kathmandu, Nepal'},
  'sri lanka': {lat: 6.9271, lng: 79.8612, name: 'Colombo, Sri Lanka'},
  'georgia': {lat: 41.6938, lng: 44.8015, name: 'Tbilisi, Georgia'},
  'tbilisi': {lat: 41.6938, lng: 44.8015, name: 'Tbilisi, Georgia'},
  'kazakhstan': {lat: 51.1801, lng: 71.4460, name: 'Astana, Kazakhstan'},
  'armenia': {lat: 40.1872, lng: 44.5152, name: 'Yerevan, Armenia'},

  // Africa
  'nigeria': {lat: 6.5244, lng: 3.3792, name: 'Lagos, Nigeria'},
  'lagos': {lat: 6.5244, lng: 3.3792, name: 'Lagos, Nigeria'},
  'south africa': {lat: -26.2041, lng: 28.0473, name: 'Johannesburg, South Africa'},
  'johannesburg': {lat: -26.2041, lng: 28.0473, name: 'Johannesburg, South Africa'},
  'cape town': {lat: -33.9249, lng: 18.4241, name: 'Cape Town, South Africa'},
  'kenya': {lat: -1.2921, lng: 36.8219, name: 'Nairobi, Kenya'},
  'nairobi': {lat: -1.2921, lng: 36.8219, name: 'Nairobi, Kenya'},
  'ghana': {lat: 5.5560, lng: -0.1969, name: 'Accra, Ghana'},
  'accra': {lat: 5.5560, lng: -0.1969, name: 'Accra, Ghana'},
  'egypt': {lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt'},
  'cairo': {lat: 30.0444, lng: 31.2357, name: 'Cairo, Egypt'},
  'ethiopia': {lat: 9.0320, lng: 38.7469, name: 'Addis Ababa, Ethiopia'},
  'tanzania': {lat: -6.7924, lng: 39.2083, name: 'Dar es Salaam, Tanzania'},
  'morocco': {lat: 33.9716, lng: -6.8498, name: 'Rabat, Morocco'},
  'senegal': {lat: 14.7167, lng: -17.4677, name: 'Dakar, Senegal'},
  'cameroon': {lat: 3.8480, lng: 11.5021, name: 'Yaounde, Cameroon'},
  'angola': {lat: -8.8390, lng: 13.2894, name: 'Luanda, Angola'},
  'zimbabwe': {lat: -17.8252, lng: 31.0335, name: 'Harare, Zimbabwe'},

  // Oceania
  'australia': {lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia'},
  'sydney': {lat: -33.8688, lng: 151.2093, name: 'Sydney, Australia'},
  'melbourne': {lat: -37.8136, lng: 144.9631, name: 'Melbourne, Australia'},
  'brisbane': {lat: -27.4698, lng: 153.0251, name: 'Brisbane, Australia'},
  'new zealand': {lat: -36.8485, lng: 174.7633, name: 'Auckland, New Zealand'},
  'auckland': {lat: -36.8485, lng: 174.7633, name: 'Auckland, New Zealand'},
};

const BLOCKED_CATEGORIES = new Set([
  'real_estate', 'estate_agent', 'car', 'car_dealer', 'car_repair',
  'car_wash', 'motorcycle', 'fuel', 'parking', 'bank', 'bureau_de_change',
  'insurance', 'lawyer', 'accountant', 'financial', 'construction',
  'industrial', 'warehouse', 'factory', 'storage', 'wholesale',
  'building_materials', 'plumber', 'electrician', 'hvac'
]);

interface Merchant {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  imageUrl?: string;
  photoUrl?: string;
  googlePlaceId?: string;
  wcPayPotential: boolean;
  source?: string;
}

interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

interface CoinMapVenue {
  id: number;
  lat: number;
  lon: number;
  name: string;
  category?: string;
}

function isAllowedCategory(category: string): boolean {
  const cat = category.toLowerCase().trim();
  if (BLOCKED_CATEGORIES.has(cat)) return false;
  return true;
}

function normalizeQuery(query: string): string {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLocation(query: string): string {
  const lower = query.toLowerCase().trim();
  const inPattern = /(?:in|near|at|around|close to|within)\s+([a-zA-Z\s,]+)$/i;
  const match = lower.match(inPattern);
  if (match) {
    return match[1].trim();
  }
  const words = query.trim().split(/\s+/);
  if (words.length >= 3) {
    return words.slice(-2).join(' ');
  }
  return query;
}

async function getCityDistricts(cityName: string, lat: number, lng: number): Promise<{name: string, lat: number, lng: number}[]> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=district+${encodeURIComponent(cityName)}&` +
      `format=json&limit=20&addressdetails=1&` +
      `featuretype=settlement&countrycodes=ae,sa,us,gb,de,fr,jp,cn,in,tr,eg,pk,bd,ng,br,mx,id,th`;
    
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WalletConnectGridFinder/1.0' }
    });
    const data = await res.json();
    
    const overpassQuery = `
      [out:json][timeout:20];
      (
        node["place"~"suburb|neighbourhood|quarter|district|borough"]["name"](around:50000,${lat},${lng});
        relation["admin_level"~"8|9|10"]["name"](around:50000,${lat},${lng});
      );
      out body qt 30;
    `;
    
    const overpassRes = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(20000),
    });
    const overpassData = await overpassRes.json();
    
    const overpassDistricts = (overpassData.elements || [])
      .filter((el: any) => el.tags?.name && el.tags.name !== cityName)
      .map((el: any) => ({
        name: el.tags['name:en'] || el.tags.name,
        lat: el.lat || el.center?.lat || lat,
        lng: el.lon || el.center?.lon || lng,
      }));
    
    const seen = new Set<string>();
    const unique: {name: string, lat: number, lng: number}[] = [];
    
    for (const d of overpassDistricts) {
      const key = d.name.toLowerCase().trim();
      if (!seen.has(key) && d.name !== cityName && d.name.length > 1) {
        seen.add(key);
        unique.push(d);
      }
    }
    
    if (unique.length >= 4) {
      return unique.slice(0, 12);
    }
    
    const CITY_DISTRICTS: Record<string, {name: string, lat: number, lng: number}[]> = {
      'dubai': [
        { name: 'Downtown Dubai', lat: 25.1972, lng: 55.2744 },
        { name: 'Dubai Marina', lat: 25.0805, lng: 55.1403 },
        { name: 'Deira', lat: 25.2697, lng: 55.3094 },
        { name: 'Jumeirah', lat: 25.2048, lng: 55.2708 },
        { name: 'Business Bay', lat: 25.1867, lng: 55.2647 },
        { name: 'Al Barsha', lat: 25.1128, lng: 55.1991 },
        { name: 'Bur Dubai', lat: 25.2528, lng: 55.2972 },
        { name: 'JBR', lat: 25.0759, lng: 55.1326 },
      ],
      'london': [
        { name: 'Central London', lat: 51.5074, lng: -0.1278 },
        { name: 'East London', lat: 51.5150, lng: -0.0550 },
        { name: 'West London', lat: 51.4927, lng: -0.2339 },
        { name: 'North London', lat: 51.5600, lng: -0.1200 },
        { name: 'South London', lat: 51.4613, lng: -0.1156 },
        { name: 'Canary Wharf', lat: 51.5054, lng: -0.0235 },
        { name: 'Shoreditch', lat: 51.5227, lng: -0.0793 },
        { name: 'Brixton', lat: 51.4618, lng: -0.1143 },
      ],
      'new york': [
        { name: 'Manhattan', lat: 40.7831, lng: -73.9712 },
        { name: 'Brooklyn', lat: 40.6782, lng: -73.9442 },
        { name: 'Queens', lat: 40.7282, lng: -73.7949 },
        { name: 'Bronx', lat: 40.8448, lng: -73.8648 },
        { name: 'Staten Island', lat: 40.5795, lng: -74.1502 },
        { name: 'Midtown', lat: 40.7549, lng: -73.9840 },
        { name: 'Lower Manhattan', lat: 40.7075, lng: -74.0113 },
        { name: 'Harlem', lat: 40.8116, lng: -73.9465 },
      ],
      'bangkok': [
        { name: 'Sukhumvit', lat: 13.7310, lng: 100.5690 },
        { name: 'Silom', lat: 13.7267, lng: 100.5340 },
        { name: 'Chatuchak', lat: 13.7996, lng: 100.5500 },
        { name: 'Rattanakosin', lat: 13.7517, lng: 100.4930 },
        { name: 'Thonburi', lat: 13.7217, lng: 100.4870 },
        { name: 'Lat Phrao', lat: 13.8100, lng: 100.5700 },
        { name: 'Bang Rak', lat: 13.7300, lng: 100.5200 },
        { name: 'Huai Khwang', lat: 13.7750, lng: 100.5750 },
      ],
      'los angeles': [
        { name: 'Downtown LA', lat: 34.0407, lng: -118.2468 },
        { name: 'Hollywood', lat: 34.0928, lng: -118.3287 },
        { name: 'Santa Monica', lat: 34.0195, lng: -118.4912 },
        { name: 'Venice Beach', lat: 33.9850, lng: -118.4695 },
        { name: 'Beverly Hills', lat: 34.0736, lng: -118.4004 },
        { name: 'Koreatown', lat: 34.0587, lng: -118.2988 },
        { name: 'Silver Lake', lat: 34.0870, lng: -118.2673 },
        { name: 'Westwood', lat: 34.0633, lng: -118.4452 },
      ],
      'paris': [
        { name: 'Le Marais', lat: 48.8566, lng: 2.3522 },
        { name: 'Montmartre', lat: 48.8867, lng: 2.3431 },
        { name: 'Saint-Germain', lat: 48.8533, lng: 2.3339 },
        { name: 'Bastille', lat: 48.8533, lng: 2.3692 },
        { name: 'Champs-Élysées', lat: 48.8698, lng: 2.3078 },
        { name: 'Belleville', lat: 48.8717, lng: 2.3797 },
        { name: 'Oberkampf', lat: 48.8644, lng: 2.3747 },
        { name: 'République', lat: 48.8675, lng: 2.3626 },
      ],
      'tokyo': [
        { name: 'Shinjuku', lat: 35.6938, lng: 139.7034 },
        { name: 'Shibuya', lat: 35.6580, lng: 139.7016 },
        { name: 'Akihabara', lat: 35.7022, lng: 139.7744 },
        { name: 'Ginza', lat: 35.6717, lng: 139.7650 },
        { name: 'Roppongi', lat: 35.6628, lng: 139.7316 },
        { name: 'Harajuku', lat: 35.6700, lng: 139.7028 },
        { name: 'Asakusa', lat: 35.7147, lng: 139.7966 },
        { name: 'Ikebukuro', lat: 35.7295, lng: 139.7109 },
      ],
      'riyadh': [
        { name: 'Al Olaya', lat: 24.6877, lng: 46.6857 },
        { name: 'Al Malaz', lat: 24.6941, lng: 46.7361 },
        { name: 'Al Murabba', lat: 24.6869, lng: 46.7131 },
        { name: 'Diplomatic Quarter', lat: 24.6908, lng: 46.6228 },
        { name: 'Al Sulaymaniyah', lat: 24.7136, lng: 46.6725 },
        { name: 'Al Rawdah', lat: 24.7397, lng: 46.6564 },
        { name: 'Al Nakheel', lat: 24.7611, lng: 46.6617 },
        { name: 'Granada', lat: 24.7519, lng: 46.7728 },
      ],
      'karachi': [
        { name: 'Clifton', lat: 24.8138, lng: 67.0300 },
        { name: 'Defence', lat: 24.7861, lng: 67.0601 },
        { name: 'Saddar', lat: 24.8600, lng: 67.0100 },
        { name: 'Korangi', lat: 24.8300, lng: 67.1300 },
        { name: 'Gulshan', lat: 24.9333, lng: 67.0833 },
        { name: 'PECHS', lat: 24.8721, lng: 67.0658 },
        { name: 'North Nazimabad', lat: 24.9500, lng: 67.0333 },
        { name: 'Malir', lat: 24.8944, lng: 67.2028 },
      ],
      'lahore': [
        { name: 'Gulberg', lat: 31.5204, lng: 74.3587 },
        { name: 'DHA', lat: 31.4697, lng: 74.4097 },
        { name: 'Model Town', lat: 31.4828, lng: 74.3214 },
        { name: 'Johar Town', lat: 31.4697, lng: 74.2728 },
        { name: 'Bahria Town', lat: 31.3700, lng: 74.1800 },
        { name: 'Cantt', lat: 31.5200, lng: 74.4197 },
        { name: 'Old City', lat: 31.5800, lng: 74.3100 },
        { name: 'Iqbal Town', lat: 31.4950, lng: 74.2900 },
      ],
      'istanbul': [
        { name: 'Beyoglu', lat: 41.0369, lng: 28.9850 },
        { name: 'Besiktas', lat: 41.0422, lng: 29.0067 },
        { name: 'Kadikoy', lat: 40.9906, lng: 29.0231 },
        { name: 'Fatih', lat: 41.0186, lng: 28.9397 },
        { name: 'Sisli', lat: 41.0603, lng: 28.9878 },
        { name: 'Uskudar', lat: 41.0228, lng: 29.0153 },
        { name: 'Taksim', lat: 41.0369, lng: 28.9850 },
        { name: 'Sultanahmet', lat: 41.0054, lng: 28.9768 },
      ],
      'cairo': [
        { name: 'Zamalek', lat: 30.0619, lng: 31.2194 },
        { name: 'Maadi', lat: 29.9617, lng: 31.2544 },
        { name: 'Heliopolis', lat: 30.0911, lng: 31.3419 },
        { name: 'Nasr City', lat: 30.0697, lng: 31.3417 },
        { name: 'Downtown Cairo', lat: 30.0561, lng: 31.2394 },
        { name: 'New Cairo', lat: 30.0261, lng: 31.4903 },
        { name: 'Mohandessin', lat: 30.0556, lng: 31.2028 },
        { name: 'Dokki', lat: 30.0375, lng: 31.2119 },
      ],
      'mumbai': [
        { name: 'Bandra', lat: 19.0544, lng: 72.8405 },
        { name: 'Andheri', lat: 19.1136, lng: 72.8697 },
        { name: 'Lower Parel', lat: 18.9967, lng: 72.8333 },
        { name: 'Colaba', lat: 18.9067, lng: 72.8147 },
        { name: 'Juhu', lat: 19.1075, lng: 72.8263 },
        { name: 'Powai', lat: 19.1197, lng: 72.9050 },
        { name: 'Worli', lat: 19.0139, lng: 72.8159 },
        { name: 'Navi Mumbai', lat: 19.0330, lng: 73.0297 },
      ],
    };
    
    const cityKey = cityName.toLowerCase().trim();
    for (const [key, districts] of Object.entries(CITY_DISTRICTS)) {
      if (cityKey.includes(key) || key.includes(cityKey)) {
        return districts;
      }
    }
    
    const nominatimDistricts = (Array.isArray(data) ? data : [])
      .filter((d: any) => {
        const name = d.display_name?.split(',')[0]?.trim();
        return name && name.toLowerCase() !== cityName.toLowerCase();
      })
      .map((d: any) => ({
        name: d.display_name.split(',')[0].trim(),
        lat: parseFloat(d.lat),
        lng: parseFloat(d.lon),
      }));
    
    const seenNom = new Set<string>();
    return nominatimDistricts.filter((d: {name: string, lat: number, lng: number}) => {
      const key = d.name.toLowerCase();
      if (seenNom.has(key)) return false;
      seenNom.add(key);
      return true;
    }).slice(0, 12);
    
  } catch (e) {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQuery = searchParams.get('city') || '';
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    if (!rawQuery && !latParam) {
      return NextResponse.json({ error: 'Query or location required' }, { status: 400 });
    }

    const cityLower = rawQuery.toLowerCase().trim();

    if (COUNTRY_CAPITALS[cityLower]) {
      const capital = COUNTRY_CAPITALS[cityLower];
      const isLargeCity = ['tokyo','karachi','cairo','mumbai',
        'india','nigeria','lagos','jakarta','beijing',
        'shanghai','delhi','accra','ghana'].includes(cityLower);
        
      const searchRadius = isLargeCity ? 50000 : 35000;

      const merchants = await fetchMerchantsNearLocation(
        capital.lat, capital.lng, searchRadius
      );
      return NextResponse.json({
        merchants,
        center: capital
      });
    }

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      const merchants = await fetchMerchantsNearLocation(lat, lng, 15000);
      const enriched = await enrichWithGoogle(merchants);
      
      if (enriched.length === 0) {
        // Fallback for near me
        const coinmapLarge = await fetchCoinMapNearby(lat, lng, 100000).catch(() => []);
        if (coinmapLarge.length > 0) {
          return NextResponse.json({
            merchants: coinmapLarge.slice(0, 50),
            center: { lat, lng, name: 'Your Location' }
          });
        }
      }

      return NextResponse.json({
        merchants: enriched,
        center: { lat, lng, name: 'Your Location' },
      });
    }

    if (COUNTRY_COORDS[cityLower]) {
      const coord = COUNTRY_COORDS[cityLower];
      const merchants = await fetchMerchantsNearLocation(coord.lat, coord.lng, 50000);
      const enriched = await enrichWithGoogle(merchants);
      return NextResponse.json({
        merchants: enriched,
        center: { lat: coord.lat, lng: coord.lng, name: coord.name },
      });
    }

    const extractedLocation = extractLocation(rawQuery);
    const normalized = normalizeQuery(extractedLocation);
    const isNearMe = /near\s*me|my\s*location|current\s*location|nearby/i.test(rawQuery);

    if (isNearMe) {
      return NextResponse.json({
        error: 'LOCATION_REQUIRED',
        message: 'Please share your location to find nearby merchants.',
      }, { status: 200 });
    }

    const actualGeocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(normalized)}&key=${GOOGLE_MAPS_API_KEY}`;
    const geocodeRes = await fetch(actualGeocodeUrl);
    const geocodeData = await geocodeRes.json();

    let centerLat: number, centerLng: number, cityName: string;

    if (geocodeData.status !== 'OK' || !geocodeData.results?.length) {
      const geocodeUrl = `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(extractedLocation)}&` +
        `format=json&limit=5&addressdetails=1&` +
        `accept-language=en`;
      const nomRes = await fetch(geocodeUrl, { headers: { 'User-Agent': 'WalletConnectGridFinder/1.0' } });
      const nomData = await nomRes.json();

      if (!nomData?.length) {
        return NextResponse.json({ error: 'Location not found. Try a different search.' }, { status: 404 });
      }

      const best = nomData.find((r: any) => 
        r.type === 'administrative' || 
        r.class === 'boundary' ||
        r.addresstype === 'country' ||
        r.addresstype === 'city' ||
        r.addresstype === 'state'
      ) || nomData[0];

      centerLat = parseFloat(best.lat);
      centerLng = parseFloat(best.lon);
      cityName = best.display_name;
      const isCountry = best.addresstype === 'country' || best.type === 'country';

      let merchants: Merchant[] = [];
      if (isCountry && best.boundingbox) {
        merchants = await fetchCountryMerchants(best.boundingbox, extractedLocation);
      } else {
        merchants = await fetchMerchantsNearLocation(centerLat, centerLng, 15000);
      }

      const enriched = await enrichWithGoogle(merchants);
      
      if (enriched.length === 0) {
        const coinmapLarge = await fetchCoinMapNearby(centerLat, centerLng, 100000).catch(() => []);
        if (coinmapLarge.length > 0) {
          return NextResponse.json({
            merchants: coinmapLarge.slice(0, 50),
            center: { lat: centerLat, lng: centerLng, name: cityName }
          });
        }
        
        const btcmapResults = await fetchBTCMap(centerLat, centerLng, cityName).catch(() => []);
        if (btcmapResults.length > 0) {
          return NextResponse.json({
            merchants: btcmapResults.slice(0, 50),
            center: { lat: centerLat, lng: centerLng, name: cityName }
          });
        }

        return NextResponse.json({
          merchants: [],
          center: { lat: centerLat, lng: centerLng, name: cityName },
          message: `No crypto merchants found near ${cityName} yet. Try searching a nearby major city or use "Scan Nearby" if you are in the area.`,
          suggestion: true
        });
      }

      return NextResponse.json({
        merchants: enriched,
        center: { lat: centerLat, lng: centerLng, name: cityName },
      });
    }

    const result = geocodeData.results[0];
    centerLat = result.geometry.location.lat;
    centerLng = result.geometry.location.lng;
    cityName = result.formatted_address;
    const isCountry = result.types?.includes('country');

    let merchants: Merchant[] = [];

    if (isCountry) {
      const countryName = result.address_components?.find((c: any) =>
        c.types.includes('country')
      )?.long_name || rawQuery;
      merchants = await fetchCountryMerchantsByName(countryName);
    } else {
      const LARGE_CITIES = [
        'dubai', 'london', 'new york', 'paris', 'tokyo',
        'istanbul', 'cairo', 'mumbai', 'delhi', 'shanghai',
        'beijing', 'moscow', 'lagos', 'karachi', 'lahore',
        'bangkok', 'jakarta', 'mexico city', 'sao paulo',
        'buenos aires', 'los angeles', 'chicago', 'toronto',
        'sydney', 'singapore', 'kuala lumpur', 'riyadh',
        'saudi arabia', 'casablanca', 'nairobi', 'accra',
        'dhaka', 'kolkata', 'chennai', 'bangalore', 'hyderabad',
        'tehran', 'baghdad', 'lima', 'bogota', 'santiago',
        'miami', 'houston', 'phoenix', 'philadelphia',
        'cairo', 'alexandria', 'abuja', 'kano', 'ibadan',
        'new york city', 'nyc', 'paris france', 'london uk'
      ];
      
      const searchedCity = normalized.toLowerCase();
      const isLargeCity = false;

      if (isLargeCity) {
        const districts = await getCityDistricts(result.address_components?.[0]?.long_name || rawQuery, centerLat, centerLng);
        if (districts.length > 3) {
          return NextResponse.json({
            type: 'districts',
            districts: districts,
            center: { lat: centerLat, lng: centerLng, name: result.formatted_address },
          });
        }
      }

      merchants = await fetchMerchantsNearLocation(centerLat, centerLng, 15000);
    }

    const enriched = await enrichWithGoogle(merchants);

    if (enriched.length === 0) {
      const coinmapLarge = await fetchCoinMapNearby(centerLat, centerLng, 100000).catch(() => []);
      if (coinmapLarge.length > 0) {
        return NextResponse.json({
          merchants: coinmapLarge.slice(0, 50),
          center: { lat: centerLat, lng: centerLng, name: cityName }
        });
      }
      
      const btcmapResults = await fetchBTCMap(centerLat, centerLng, cityName).catch(() => []);
      if (btcmapResults.length > 0) {
        return NextResponse.json({
          merchants: btcmapResults.slice(0, 50),
          center: { lat: centerLat, lng: centerLng, name: cityName }
        });
      }

      return NextResponse.json({
        merchants: [],
        center: { lat: centerLat, lng: centerLng, name: cityName },
        message: `No crypto merchants found near ${cityName} yet. Try searching a nearby major city or use "Scan Nearby" if you are in the area.`,
        suggestion: true
      });
    }

    return NextResponse.json({
      merchants: enriched,
      center: { lat: centerLat, lng: centerLng, name: result.formatted_address },
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Unexpected error occurred.', merchants: [], center: null },
      { status: 500 }
    );
  }
}

async function fetchGooglePlaces(
  lat: number, lng: number, radius: number
): Promise<Merchant[]> {
  const key = process.env.GOOGLE_MAPS_API_KEY || '';
  if (!key) return [];
  
  const keywords = [
    'bitcoin payment accepted',
    'crypto payment accepted', 
    'cryptocurrency accepted here',
    'bitcoin cafe',
    'crypto cafe',
    'bitcoin restaurant',
    'crypto restaurant',
    'bitcoin coffee shop',
    'usdt payment',
    'ethereum payment',
    'bitcoin ATM',
    'crypto exchange',
    'blockchain cafe',
    'accepts bitcoin',
    'pay with crypto',
    'digital currency accepted',
    'bitcoin friendly restaurant',
    'crypto friendly cafe',
    'Ingenico payment terminal',
    'WalletConnect Pay',
    'dtcpay merchant',
    'USDC payment store',
    'stablecoin payment',
    'crypto POS terminal',
    'bitcoin point of sale',
    'MetaMask payment',
    'Trust Wallet accepted'
  ];
  
  const results: Merchant[] = [];
  
  for (const keyword of keywords) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${lat},${lng}&radius=${Math.min(radius * 2, 50000)}&key=${key}`;
      
      const res = await fetch(url, { 
        signal: AbortSignal.timeout(8000) 
      });
      const data = await res.json();
      
      for (const place of (data.results || []).slice(0, 20)) {
        if (!place.geometry?.location) continue;
        results.push({
          id: `google-${place.place_id}`,
          name: place.name,
          category: place.types?.[0]?.replace(/_/g,' ') || 'crypto',
          address: place.formatted_address || '',
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          wcPayPotential: true,
          source: 'google',
          imageUrl: place.photos?.[0]?.photo_reference ? 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${key}` 
            : '',
        });
      }
    } catch { continue; }
  }
  return results;
}

async function fetchMerchantsNearLocation(
  lat: number,
  lng: number,
  radius: number = 15000
): Promise<Merchant[]> {
  
  console.log(`Fetching merchants near ${lat},${lng} radius:${radius}`);
  
  // Run ALL sources in parallel simultaneously
  const [
    googleResult,
    osmResult,
    coinmapResult, 
    btcmapResult,
    btcmap2Result,
    btcmapAreaResult,
    wcPayResult,
    coinatmResult,
  ] = await Promise.allSettled([
    // Source 0: Google Places Text Search (Primary)
    fetchGooglePlaces(lat, lng, radius).catch(() => []),

    // Source 1: OpenStreetMap Overpass
    (async () => {
      const query = `[out:json][timeout:25];
(
  node["payment:cryptocurrency"="yes"](around:${radius},${lat},${lng});
  way["payment:cryptocurrency"="yes"](around:${radius},${lat},${lng});
  node["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
  way["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
  node["currency:XBT"="yes"](around:${radius},${lat},${lng});
  node["payment:lightning"="yes"](around:${radius},${lat},${lng});
  node["payment:lightning_contactless"="yes"](around:${radius},${lat},${lng});
  node["payment:usdt"="yes"](around:${radius},${lat},${lng});
  node["payment:ethereum"="yes"](around:${radius},${lat},${lng});
  node["payment:usdc"="yes"](around:${radius},${lat},${lng});
  node["payment:crypto"="yes"](around:${radius},${lat},${lng});
  node["bitcoin"="yes"](around:${radius},${lat},${lng});
  node["payment:onchain"="yes"](around:${radius},${lat},${lng});
);
out body qt 50;`;
      const res = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
        signal: AbortSignal.timeout(13000),
      });
      const text = await res.text();
      if (text.trim().startsWith('<')) return [];
      const data = JSON.parse(text);
      return (data.elements || [])
        .map((el: OverpassElement) => osmToMerchant(el, true))
        .filter((m: Merchant | null): m is Merchant => m !== null);
    })(),
    
    // Source 2: CoinMap
    fetchCoinMapNearby(lat, lng, radius).catch(() => []),
    
    // Source 3: BTCMap
    fetchBTCMap(lat, lng, '').catch(() => []),
    
    // Source 4: BTCMap v2 aggregated
    fetchCoinGeckoMarkets(lat, lng).catch(() => []),

    // Source 5: BTCMap area
    fetchBTCMapArea(lat, lng).catch(() => []),

    // Source 6: WalletConnect Pay
    fetchWCPayMerchants(lat, lng, radius).catch(() => []),

    // Source 7: CoinATMRadar
    fetchCoinATMRadar(lat, lng, radius).catch(() => []),
  ]);
  
  const allMerchants = [
    ...(googleResult.status === 'fulfilled' ? googleResult.value : []),
    ...(osmResult.status === 'fulfilled' ? osmResult.value : []),
    ...(coinmapResult.status === 'fulfilled' ? coinmapResult.value : []),
    ...(btcmapResult.status === 'fulfilled' ? btcmapResult.value : []),
    ...(btcmap2Result.status === 'fulfilled' ? btcmap2Result.value : []),
    ...(btcmapAreaResult.status === 'fulfilled' ? btcmapAreaResult.value : []),
    ...(wcPayResult.status === 'fulfilled' ? wcPayResult.value : []),
    ...(coinatmResult.status === 'fulfilled' ? coinatmResult.value : []),
  ];
  
  console.log(`Total before dedup: ${allMerchants.length}`);
  
  const dedupedMerchants = deduplicateMerchants(allMerchants);
  
  // Fetch photos for top 20 only
  const merchantsWithPhotos = await Promise.all(
    dedupedMerchants.slice(0, 20).map(async (m) => {
      if (m.imageUrl) return m;
      const photo = await getGooglePlacePhoto(m.name, m.lat, m.lng)
        .catch(() => '');
      return { ...m, imageUrl: photo };
    })
  );

  const remainingMerchants = dedupedMerchants.slice(20);

  console.log(`Total after dedup: ${dedupedMerchants.length}`);
  
  return [...merchantsWithPhotos, ...remainingMerchants]
    .slice(0, MAX_RESULTS);
}

async function fetchCoinGeckoMarkets(
  lat: number,
  lng: number
): Promise<Merchant[]> {
  try {
    // Use public BTCMap API which aggregates from multiple sources
    const url = `https://api.btcmap.org/v2/elements?limit=200`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WalletConnectFinder/1.0' },
      signal: AbortSignal.timeout(10000)
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    const elements = Array.isArray(data) ? data : [];
    
    return elements
      .filter((el: any) => {
        if (!el.osm_json?.lat || !el.osm_json?.lon) return false;
        const dlat = Math.abs(el.osm_json.lat - lat);
        const dlon = Math.abs(el.osm_json.lon - lng);
        return dlat < 2 && dlon < 2;
      })
      .slice(0, 50)
      .map((el: any): Merchant | null => {
        const name = el.osm_json?.tags?.name;
        if (!name) return null;
        const tags = el.osm_json?.tags || {};
        return {
          id: `btcmap2-${el.id}`,
          name,
          category: tags.amenity || tags.shop || 'crypto',
          address: [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
            tags['addr:country']
          ].filter(Boolean).join(', ') || name + ', ' + (tags['addr:city'] || tags['addr:country'] || 'See map for location'),
          lat: el.osm_json.lat,
          lng: el.osm_json.lon,
          wcPayPotential: true,
          source: 'btcmap',
        };
      })
      .filter((m): m is Merchant => m !== null);
  } catch { return []; }
}

async function fetchBTCMapArea(
  lat: number,
  lng: number
): Promise<Merchant[]> {
  try {
    // BTCMap has area-based endpoints
    const url = `https://api.btcmap.org/v2/elements?` +
      `limit=200`;
    
    const res = await fetch(url, {
      headers: { 
        'User-Agent': 'WalletConnectPayFinder/1.0',
        'Accept': 'application/json'
      },
      signal: AbortSignal.timeout(12000),
    });
    
    if (!res.ok) return [];
    const data = await res.json();
    const elements = Array.isArray(data) ? data : [];
    
    // Filter by 3 degree radius (approx 300km)
    return elements
      .filter((el: any) => {
        if (!el.osm_json?.lat || !el.osm_json?.lon) return false;
        const dlat = Math.abs(el.osm_json.lat - lat);
        const dlon = Math.abs(el.osm_json.lon - lng);
        return dlat < 3 && dlon < 3;
      })
      .map((el: any): Merchant | null => {
        const tags = el.osm_json?.tags || {};
        const name = tags.name || tags['name:en'];
        if (!name) return null;
        return {
          id: `btcmap-area-${el.id}`,
          name,
          category: tags.amenity || tags.shop || 
                   tags.tourism || tags.office || 'crypto',
          address: [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
            tags['addr:country']
          ].filter(Boolean).join(', ') || name + ', ' + (tags['addr:city'] || tags['addr:country'] || 'See map for location'),
          lat: el.osm_json.lat,
          lng: el.osm_json.lon,
          wcPayPotential: true,
          source: 'btcmap',
        };
      })
      .filter((m): m is Merchant => m !== null);
  } catch { return []; }
}

async function fetchWCPayMerchants(
  lat: number,
  lng: number,
  radius: number
): Promise<Merchant[]> {
  try {
    // Search OSM for WalletConnect specific tags
    const query = `[out:json][timeout:15];
(
  node["payment:walletconnect"="yes"](around:${radius},${lat},${lng});
  node["payment:wc_pay"="yes"](around:${radius},${lat},${lng});
  node["payment:qr_code"="yes"]["payment:cryptocurrency"="yes"](around:${radius},${lat},${lng});
  node["contact:website"~"walletconnect",i](around:${radius},${lat},${lng});
);
out body qt 20;`;

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'data=' + encodeURIComponent(query),
      signal: AbortSignal.timeout(10000),
    });
    
    const text = await res.text();
    if (text.trim().startsWith('<')) return [];
    
    const data = JSON.parse(text);
    return (data.elements || [])
      .map((el: OverpassElement) => osmToMerchant(el, true))
      .filter((m: Merchant | null): m is Merchant => m !== null);
  } catch { return []; }
}

async function getGooglePlacePhoto(
  name: string,
  lat: number,
  lng: number
): Promise<string> {
  const key = process.env.GOOGLE_MAPS_API_KEY || '';
  if (!key) return '';
  
  try {
    // Search for place
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${lat},${lng}&` +
      `radius=100&` +
      `keyword=${encodeURIComponent(name)}&` +
      `key=${key}`;
    
    const res = await fetch(searchUrl, { 
      signal: AbortSignal.timeout(5000) 
    });
    const data = await res.json();
    
    const place = data.results?.[0];
    if (!place?.photos?.[0]?.photo_reference) return '';
    
    const photoRef = place.photos[0].photo_reference;
    return `https://maps.googleapis.com/maps/api/place/photo?` +
      `maxwidth=400&` +
      `photo_reference=${photoRef}&` +
      `key=${key}`;
  } catch { return ''; }
}

async function fetchOverpassNearby(lat: number, lng: number, radius: number): Promise<Merchant[]> {
  const query = `
    [out:json][timeout:30];
    (
      node["payment:cryptocurrency"="yes"](around:${radius},${lat},${lng});
      way["payment:cryptocurrency"="yes"](around:${radius},${lat},${lng});
      node["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
      way["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
      node["payment:usdt"="yes"](around:${radius},${lat},${lng});
      way["payment:usdt"="yes"](around:${radius},${lat},${lng});
      node["payment:ethereum"="yes"](around:${radius},${lat},${lng});
      way["payment:ethereum"="yes"](around:${radius},${lat},${lng});
      node["currency:XBT"="yes"](around:${radius},${lat},${lng});
      way["currency:XBT"="yes"](around:${radius},${lat},${lng});
    );
    out body; >; out skel qt;
  `;

  const res = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const data = await res.json();

  if (!data.elements?.length) {
    return fetchOverpassFallback(lat, lng, radius);
  }

  return data.elements
    .map((el: OverpassElement) => osmToMerchant(el, true))
    .filter((m: Merchant | null): m is Merchant => m !== null);
}

async function fetchOverpassFallback(
  lat: number, 
  lng: number, 
  radius: number
): Promise<Merchant[]> {
  try {
    const query = `[out:json][timeout:10];
(
  node["payment:cryptocurrency"="yes"](around:${radius},${lat},${lng});
  node["payment:bitcoin"="yes"](around:${radius},${lat},${lng});
  node["currency:XBT"="yes"](around:${radius},${lat},${lng});
);
out body qt 20;`;

    const res = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: 'data=' + encodeURIComponent(query),
      signal: AbortSignal.timeout(12000),
    });
    
    const text = await res.text();
    
    if (text.trim().startsWith('<')) {
      console.log('Overpass returned XML, using CoinMap fallback');
      return await fetchCoinMapNearby(lat, lng, radius * 2);
    }
    
    const data = JSON.parse(text);
    return (data.elements || [])
      .map((el: OverpassElement) => osmToMerchant(el, true))
      .filter((m: Merchant | null): m is Merchant => m !== null);
      
  } catch (err) {
    console.log('fetchOverpassFallback error, using CoinMap:', err);
    try {
      return await fetchCoinMapNearby(lat, lng, radius * 2);
    } catch {
      return [];
    }
  }
}

async function fetchCoinMapNearby(lat: number, lng: number, radius: number): Promise<Merchant[]> {
  try {
    const url = `https://coinmap.org/api/v1/venues/?` +
      `lat=${lat}&lon=${lng}&` +
      `radius=${Math.min(radius * 2, 200000)}&` +
      `limit=100&` +
      `mode=list`;
    const res = await fetch(url, { headers: { 'User-Agent': 'WalletConnectGridFinder/1.0' } });
    const data = await res.json();

    return (data.venues || []).map((v: CoinMapVenue) => ({
      id: `coinmap-${v.id}`,
      name: v.name || 'Unknown Venue',
      category: v.category || 'crypto',
      address: name + ', ' + (v.category || 'See map for location'),
      lat: v.lat,
      lng: v.lon,
      wcPayPotential: true,
      source: 'coinmap',
    }));
  } catch {
    return [];
  }
}

async function fetchBTCMap(lat: number, lng: number, countryName: string): Promise<Merchant[]> {
  try {
    const url = `https://api.btcmap.org/v2/elements?limit=500`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'WalletConnectGridFinder/1.0' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const elements = Array.isArray(data) ? data : [];
    return elements
      .filter((el: any) => {
        if (!el.osm_json?.lat || !el.osm_json?.lon) return false;
        const dlat = Math.abs(el.osm_json.lat - lat);
        const dlon = Math.abs(el.osm_json.lon - lng);
        return dlat < 8 && dlon < 8;
      })
      .slice(0, 50)
      .map((el: any): Merchant | null => {
        const name = el.osm_json?.tags?.name;
        if (!name) return null;
        const tags = el.osm_json?.tags || {};
        return {
          id: `btcmap-${el.id}`,
          name,
          category: tags.amenity || tags.shop || 'crypto',
          address: [
            tags['addr:housenumber'],
            tags['addr:street'],
            tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
            tags['addr:country']
          ].filter(Boolean).join(', ') || name + ', ' + (tags['addr:city'] || tags['addr:country'] || 'See map for location'),
          lat: el.osm_json.lat,
          lng: el.osm_json.lon,
          wcPayPotential: true,
          source: 'btcmap',
        };
      })
      .filter((m): m is Merchant => m !== null);
  } catch {
    return [];
  }
}

async function fetchCoinATMRadar(
  lat: number,
  lng: number,
  radius: number
): Promise<Merchant[]> {
  try {
    const url = `https://coinatmradar.com/api/v1/map/atms/?` +
      `geometry=point&` +
      `lat=${lat}&` +
      `lng=${lng}&` +
      `radius=${Math.round(radius/1000)}&` +
      `status=active`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'WalletConnectFinder/1.0',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return [];
    const data = await res.json();
    const atms = data.result || data.atms || data || [];
    if (!Array.isArray(atms)) return [];

    return atms.slice(0, 50).map((atm: any) => ({
      id: `atm-${atm.id || Math.random()}`,
      name: atm.name || atm.operator || 'Bitcoin ATM',
      category: 'crypto_atm',
      address: [
        atm.location?.address || atm.address,
        atm.location?.city || atm.city,
        atm.location?.country || atm.country,
      ].filter(Boolean).join(', '),
      lat: parseFloat(atm.lat || atm.location?.lat || 0),
      lng: parseFloat(atm.lng || atm.location?.lng || 0),
      wcPayPotential: true,
      source: 'coinatmradar',
    })).filter((m: any) => m.lat && m.lng);
  } catch { return []; }
}

async function fetchCountryMerchants(bbox: string[], countryName: string): Promise<Merchant[]> {
  const [minLat, maxLat, minLon, maxLon] = bbox.map(parseFloat);
  
  const bboxArea = (maxLon - minLon) * (maxLat - minLat);
  if (bboxArea > 500) {
    const capitalSearch = await fetchMerchantsNearLocation(
      (minLat + maxLat) / 2, 
      (minLon + maxLon) / 2, 
      50000
    );
    return capitalSearch;
  }

  return fetchMerchantsInBbox(minLon, minLat, maxLon, maxLat, countryName);
}

async function fetchCountryMerchantsByName(countryName: string): Promise<Merchant[]> {
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(countryName)}&format=json&limit=1&addressdetails=1`;
    const res = await fetch(nomUrl, { headers: { 'User-Agent': 'WalletConnectGridFinder/1.0' } });
    const data = await res.json();
    if (!data?.length) return [];
    const bbox = data[0].boundingbox;
    return fetchCountryMerchants(bbox, countryName);
  } catch {
    return [];
  }
}

async function fetchMerchantsInBbox(
  minLon: number, minLat: number, 
  maxLon: number, maxLat: number, 
  label: string
): Promise<Merchant[]> {
  try {
    const area = (maxLon - minLon) * (maxLat - minLat);
    const divisions = area > 100 ? 5 : area > 20 ? 4 : 3;
    
    const lonStep = (maxLon - minLon) / divisions;
    const latStep = (maxLat - minLat) / divisions;
    const promises: Promise<Merchant[]>[] = [];

    for (let i = 0; i < divisions; i++) {
      for (let j = 0; j < divisions; j++) {
        const subMinLat = minLat + j * latStep;
        const subMaxLat = minLat + (j + 1) * latStep;
        const subMinLon = minLon + i * lonStep;
        const subMaxLon = minLon + (i + 1) * lonStep;
        const bboxStr = `${subMinLat},${subMinLon},${subMaxLat},${subMaxLon}`;
        
        const query = `
          [out:json][timeout:25][bbox:${bboxStr}];
          (
            node["payment:cryptocurrency"="yes"];
            way["payment:cryptocurrency"="yes"];
            node["payment:bitcoin"="yes"];
            way["payment:bitcoin"="yes"];
            node["currency:XBT"="yes"];
            way["currency:XBT"="yes"];
            node["payment:usdt"="yes"];
            way["payment:usdt"="yes"];
            node["payment:ethereum"="yes"];
            way["payment:ethereum"="yes"];
          );
          out body; >; out skel qt;
        `;
        
        promises.push(
          fetch(OVERPASS_API_URL, {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            signal: AbortSignal.timeout(30000),
          })
            .then(r => r.json())
            .then(d => (d.elements || [])
              .map((el: OverpassElement) => osmToMerchant(el, true))
              .filter((m: Merchant | null): m is Merchant => m !== null))
            .catch(() => [] as Merchant[])
        );
      }
    }

    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLon + maxLon) / 2;
    const radiusMeters = Math.min(
      Math.max((maxLon - minLon) * 55000, 50000), 
      300000
    );
    promises.push(fetchCoinMapNearby(centerLat, centerLng, radiusMeters));

    const results = await Promise.allSettled(promises);
    const all = results.flatMap(r => r.status === 'fulfilled' ? r.value : []);
    
    const deduped = deduplicateMerchants(all);
    
    if (deduped.length === 0) {
      return await fetchBTCMap(centerLat, centerLng, label);
    }
    
    return deduped.slice(0, MAX_RESULTS);
  } catch (error) {
    console.error('fetchMerchantsInBbox error:', error);
    return [];
  }
}

async function enrichWithGoogle(merchants: Merchant[]): Promise<Merchant[]> {
  const enriched = await Promise.all(
    merchants.map(async (merchant) => {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(merchant.name)}&inputtype=textquery&locationbias=point:${merchant.lat},${merchant.lng}&fields=place_id,photos,formatted_address,name&key=${GOOGLE_MAPS_API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.status !== 'OK' || !data.candidates?.length) return merchant;

        const place = data.candidates[0];
        const photoRef = place.photos?.[0]?.photo_reference;

        return {
          ...merchant,
          address: place.formatted_address || merchant.address,
          googlePlaceId: place.place_id,
          imageUrl: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`
            : '',
          photoUrl: photoRef
            ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${GOOGLE_MAPS_API_KEY}`
            : '',
        };
      } catch {
        return merchant;
      }
    })
  );
  return enriched;
}

function osmToMerchant(element: OverpassElement, isCrypto: boolean): Merchant | null {
  const name = element.tags?.name;
  if (!name) return null;
  const lat = element.lat ?? element.center?.lat;
  const lon = element.lon ?? element.center?.lon;
  if (!lat || !lon) return null;

  const category = element.tags?.amenity || element.tags?.shop || 'uncategorized';
  if (!isAllowedCategory(category)) return null;

  const tags = element.tags || {};

  return {
    id: `osm-${element.id}`,
    name,
    category: category,
    address: [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
      tags['addr:country']
    ].filter(Boolean).join(', ') || name + ', ' + (tags['addr:city'] || tags['addr:country'] || 'See map for location'),
    lat,
    lng: lon,
    wcPayPotential: isCrypto,
    source: 'openstreetmap',
  };
}

function deduplicateMerchants(merchants: Merchant[]): Merchant[] {
  const seen = new Map<string, Merchant>();
  
  for (const merchant of merchants) {
    // Normalize name for comparison
    const normalizedName = merchant.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 20);
    
    // Round coordinates to 3 decimal places
    const latKey = Math.round(merchant.lat * 1000);
    const lngKey = Math.round(merchant.lng * 1000);
    const coordKey = `${latKey}_${lngKey}`;
    const nameKey = normalizedName;
    
    // Check both by coordinates and by name
    const key = coordKey;
    const nameOnlyKey = nameKey;
    
    if (!seen.has(key) && !seen.has(nameOnlyKey)) {
      seen.set(key, merchant);
      seen.set(nameOnlyKey, merchant);
    } else {
      // Keep the one with imageUrl
      const existing = seen.get(key) || seen.get(nameOnlyKey);
      if (existing && !existing.imageUrl && merchant.imageUrl) {
        seen.set(key, merchant);
        seen.set(nameOnlyKey, merchant);
      }
    }
  }
  
  // Return unique values only
  const unique = new Map<string, Merchant>();
  for (const m of seen.values()) {
    unique.set(m.id, m);
  }
  
  return Array.from(unique.values());
}
