export interface Merchant {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  isVIP?: boolean;
  isVip?: boolean;
  networkType: 'walletconnect' | 'crypto';
  imageUrl: string | null;
  photo_reference?: string;
  googleMapsUrl: string;
  distance?: number; // in meters
  sources: string[]; // ['walletconnect', 'osm', 'coinmap']
}

export interface SearchMetadata {
  query: string;
  center: { lat: number, lng: number };
  radiusUsed: number;
  totalFound: number;
  sources: string[];
}

export interface SearchResponse {
  success: boolean;
  merchants: Merchant[];
  searchMetadata?: SearchMetadata;
  error?: string;
}
