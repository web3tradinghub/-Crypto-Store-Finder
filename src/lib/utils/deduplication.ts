import { Merchant } from '@/lib/types/merchant';

export function deduplicateMerchants(merchants: Merchant[]): Merchant[] {
  const map = new Map<string, Merchant>();

  merchants.forEach((m) => {
    // 3 decimal places ~100m precision as per spec
    const key = `${m.lat.toFixed(3)}:${m.lng.toFixed(3)}`;
    
    if (map.has(key)) {
      const existing = map.get(key)!;
      
      // Merge sources
      existing.sources = Array.from(new Set([...existing.sources, ...m.sources]));
      
      // Keep VIP status if either is VIP
      if (m.isVIP) existing.isVIP = true;
      
      // Update to more detailed address if current one is shorter
      if (m.address.length > existing.address.length) {
        existing.address = m.address;
      }
      
      // Preserve imageUrl if existing is null
      if (!existing.imageUrl && m.imageUrl) {
        existing.imageUrl = m.imageUrl;
      }
    } else {
      map.set(key, { ...m });
    }
  });

  return Array.from(map.values());
}
