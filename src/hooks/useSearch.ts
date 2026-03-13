
import { useState, useEffect, useCallback } from 'react';
import { VIP_PARTNERS } from '@/data/vip-partners';
import { Merchant } from '@/lib/types/merchant';

export const useSearch = () => {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Function to reset to default VIP partners
  const resetToDefault = useCallback(() => {
    setMerchants(VIP_PARTNERS);
  }, []);

  // On initial load, set the VIP partners
  useEffect(() => {
    resetToDefault();
    setIsLoading(false);
  }, [resetToDefault]);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      resetToDefault();
      return;
    }

    setIsLoading(true);
    setMerchants([]); // Clear previous results immediately

    try {
      const response = await fetch(`/api/search?city=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setMerchants(data.merchants || []);
    } catch (error) {
      console.error(error);
      // Optionally, set an error state here
    } finally {
      setIsLoading(false);
    }
  }, [resetToDefault]);

  // Effect to reset to default when search query is cleared by the user
  useEffect(() => {
    if (searchQuery.trim() === '') {
      resetToDefault();
    }
  }, [searchQuery, resetToDefault]);

  return {
    merchants,
    isLoading,
    searchQuery,
    setSearchQuery,
    performSearch,
  };
};
