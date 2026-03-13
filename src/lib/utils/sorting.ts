import { Merchant } from '@/lib/types/merchant';

export function sortMerchants(merchants: Merchant[]): Merchant[] {
  return [...merchants].sort((a, b) => {
    // 1. VIP status first
    if (a.isVIP && !b.isVIP) return -1;
    if (!a.isVIP && b.isVIP) return 1;

    // 2. Distance from center (ascending)
    if (a.distance !== undefined && b.distance !== undefined) {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }
    }

    // 3. Has image (true first)
    if (a.imageUrl && !b.imageUrl) return -1;
    if (!a.imageUrl && b.imageUrl) return 1;

    return 0;
  });
}
