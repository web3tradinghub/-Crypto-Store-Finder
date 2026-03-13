import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      // Mock for development if no API key
      return NextResponse.json({
        lat: 35.662,
        lng: 139.702,
        name: 'Shibuya, Tokyo, Japan'
      });
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === 'OK') {
      const result = data.results[0];
      return NextResponse.json({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        name: result.formatted_address
      });
    }

    return NextResponse.json({ error: data.status }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
  }
}
