"use client";

export const dynamic = 'force-dynamic';

import { useState, useCallback, useRef, useEffect } from "react";
import Hero from "@/components/Hero";
import PWAInstall from '@/components/PWAInstall';
import { VIP_PARTNERS } from '@/data/vip-partners';

interface Merchant {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  category?: string;
  lat?: number;
  lng?: number;
  isVip?: boolean;
  source?: string;
}

interface District {
  name: string;
  lat: number;
  lng: number;
}

type Review = { rating: number; comment: string; date: string; };
type ReviewsMap = Record<string, Review[]>;

type AppStatus = "idle" | "loading" | "success" | "error" | "districts";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [merchants, setMerchants] = useState<Merchant[]>(VIP_PARTNERS);
  const [districts, setDistricts] = useState<District[]>([]);
  const [status, setStatus] = useState<AppStatus>("idle");
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  // SEARCH INPUT STATE
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // FEATURE 1 - Search History
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // FEATURE 2 - Nearby Notification
  const [nearbyNotif, setNearbyNotif] = useState<string | null>(null);

  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const connectWallet = async () => {
    if (walletConnected) {
      setWalletConnected(false);
      setWalletAddress('');
      return;
    }
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setWalletAddress(accounts[0]);
        setWalletConnected(true);
      } catch (err) {
        alert('Connection rejected.');
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  // FEATURE 4 - Dark/Light Mode
  const [isDark, setIsDark] = useState(true);

  // FEATURE 6 - Merchant Detail Modal
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  // EXISTING FEATURES
  const [favourites, setFavourites] = useState<string[]>([]);
  const [showFavourites, setShowFavourites] = useState(false);

  const [reviews, setReviews] = useState<ReviewsMap>({});
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [reviewInput, setReviewInput] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) setIsDark(savedTheme === 'dark');

      const savedFavs = localStorage.getItem('crypto-favourites');
      if (savedFavs) setFavourites(JSON.parse(savedFavs));
      
      const savedReviews = localStorage.getItem('crypto-reviews');
      if (savedReviews) setReviews(JSON.parse(savedReviews));
      
      const savedHistory = localStorage.getItem('search-history');
      if (savedHistory) setSearchHistory(JSON.parse(savedHistory));
    } catch {}
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('crypto-favourites', JSON.stringify(favourites));
    }
  }, [favourites, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('crypto-reviews', JSON.stringify(reviews));
    }
  }, [reviews, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('search-history', JSON.stringify(searchHistory));
    }
  }, [searchHistory, mounted]);

  const [cryptoFilter, setCryptoFilter] = useState<string>('ALL');

  const processSearchResponse = async (response: Response) => {
    if (!response.ok) throw new Error("Search request failed");
    const json = await response.json();

    if (json.type === "districts" && json.districts?.length) {
      setDistricts(json.districts);
      setStatus("districts");
      return;
    }

    if (json.error === "LOCATION_REQUIRED") {
      setStatus("error");
      setErrorMessage("Please use the SCAN NEARBY button to share your location.");
      setHasSearched(false);
      return;
    }

    const data: Merchant[] = json.merchants || json;
    
    if (Array.isArray(data) && data.length > 0) {
      const count = data.length;
      const cityName = json.center?.name || currentCity || 'your area';
      setNearbyNotif(`◈ ${count} crypto stores found near ${cityName}`);
      setTimeout(() => setNearbyNotif(null), 4000);
    } else if (json.merchants?.length > 0) {
      const count = json.merchants.length;
      const cityName = json.center?.name || currentCity || 'your area';
      setNearbyNotif(`◈ ${count} crypto stores found near ${cityName}`);
      setTimeout(() => setNearbyNotif(null), 4000);
    }

    if (!Array.isArray(data) || data.length === 0) {
      setMerchants([]);
      setStatus("success");
      return;
    }

    const hydrated = data.map((m: any) => ({
      ...m,
      imageUrl: m.imageUrl || m.photoUrl || '',
    }));

    setMerchants(hydrated.length > 0 ? hydrated : []);
    setStatus("success");
  };

  const processWithAI = async (rawQuery: string): Promise<{location: string, category: string, corrected: string}> => {
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: rawQuery })
      });
      const data = await res.json();
      return {
        location: data.location || rawQuery,
        category: data.category || 'any',
        corrected: data.corrected_query || rawQuery
      };
    } catch {
      return { location: rawQuery, category: 'any', corrected: rawQuery };
    }
  };

  const handleSearch = async (queryToUse?: string) => {
    const finalQuery = queryToUse || searchQuery;
    if (!finalQuery.trim()) return;

    setStatus("loading");
    setHasSearched(true);
    setErrorMessage("");
    setDistricts([]);

    const aiResult = await processWithAI(finalQuery);
    const locationToSearch = aiResult.location === 'near me' 
      ? finalQuery 
      : aiResult.location || finalQuery;

    setCurrentCity(locationToSearch);
    
    try {
      const response = await fetch(`/api/search?city=${encodeURIComponent(locationToSearch)}`);
      await processSearchResponse(response);

      setSearchHistory(prev => {
        const updated = [finalQuery, ...prev.filter(h => h !== finalQuery)].slice(0, 8);
        localStorage.setItem('search-history', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("System failed to establish connection with the grid.");
      setMerchants([]);
      setHasSearched(false);
    }
  };

  const handleDistrictClick = async (district: District) => {
    setStatus("loading");
    setDistricts([]);
    setErrorMessage("");
    setHasSearched(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    try {
      const response = await fetch(
        `/api/search?lat=${district.lat}&lng=${district.lng}&city=${encodeURIComponent(district.name)}`
      );
      await processSearchResponse(response);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    } catch {
      setStatus("error");
      setErrorMessage("Failed to load district merchants.");
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation not supported by your browser.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setHasSearched(true);
    setDistricts([]);
    setErrorMessage("");
    
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `/api/search?lat=${latitude}&lng=${longitude}&radius=2000`
          );
          if (!response.ok) throw new Error('API error');
          await processSearchResponse(response);
        } catch {
          setStatus("error");
          setErrorMessage("Failed to fetch nearby merchants. Try searching your city name instead.");
          setMerchants(VIP_PARTNERS);
          setHasSearched(false);
        }
      },
      (error) => {
        setStatus("error");
        setMerchants(VIP_PARTNERS);
        setHasSearched(false);
        if (error.code === 1) {
          setErrorMessage("Location access denied. Please enable location permissions in browser settings.");
        } else if (error.code === 2) {
          setErrorMessage("Location unavailable. Try searching your city name instead.");
        } else if (error.code === 3) {
          setErrorMessage("Location request timed out. Try searching your city name instead.");
        }
      },
      options
    );
  };

  const handleClear = useCallback(() => {
    setMerchants([]);
    setStatus("idle");
    setHasSearched(false);
    setErrorMessage("");
    setDistricts([]);
    setCurrentCity("");
    setSearchQuery("");
  }, []);

  const toggleFavourite = (merchantId: string) => {
    setFavourites(prev => {
      const updated = prev.includes(merchantId)
        ? prev.filter(id => id !== merchantId)
        : [...prev, merchantId];
      localStorage.setItem('crypto-favourites', JSON.stringify(updated));
      return updated;
    });
  };

  const submitReview = (merchantId: string) => {
    if (!reviewInput.comment.trim()) return;
    const newReview: Review = {
      rating: reviewInput.rating,
      comment: reviewInput.comment,
      date: new Date().toLocaleDateString()
    };
    setReviews(prev => {
      const updated = {
        ...prev,
        [merchantId]: [...(prev[merchantId] || []), newReview]
      };
      localStorage.setItem('crypto-reviews', JSON.stringify(updated));
      return updated;
    });
    setReviewInput({ rating: 5, comment: '' });
    setActiveReviewId(null);
  };



  const shareStore = (merchant: Merchant, platform: 'whatsapp' | 'twitter') => {
    const text = `◈ Found a crypto store accepting payments!\n\n${merchant.name}\n${merchant.address}\n\nFind more crypto stores: ${window.location.href}`;
    const encoded = encodeURIComponent(text);
    const url = platform === 'whatsapp'
      ? `https://wa.me/?text=${encoded}`
      : `https://twitter.com/intent/tweet?text=${encoded}`;
    window.open(url, '_blank');
  };

  // FILTERING LOGIC
  const displayedMerchants = showFavourites
    ? merchants.filter(m => favourites.includes(m.id))
    : merchants;

  const cryptoFiltered = cryptoFilter === 'ALL'
    ? displayedMerchants
    : displayedMerchants.filter(m => {
        const name = m.name?.toLowerCase() || '';
        const cat = m.category?.toLowerCase() || '';
        const addr = m.address?.toLowerCase() || '';
        const combined = name + " " + cat + " " + addr;
        
        if (cryptoFilter === 'CRYPTO ATM') return cat.includes('atm') || name.includes('atm');
        if (cryptoFilter === 'BTC') return combined.includes('bitcoin') || combined.includes('btc') || cat.includes('crypto');
        if (cryptoFilter === 'ETH') return combined.includes('ethereum') || combined.includes('eth');
        if (cryptoFilter === 'USDT') return combined.includes('usdt') || combined.includes('tether');
        if (cryptoFilter === 'XRP') return combined.includes('xrp') || combined.includes('ripple');
        if (cryptoFilter === 'USDC') return combined.includes('usdc') || combined.includes('usd coin');
        if (cryptoFilter === 'WCT') return combined.includes('wct') || combined.includes('walletconnect') || combined.includes('wallet connect');
        if (cryptoFilter === 'SOL') return combined.includes('solana') || combined.includes('sol');
        return true;
      });

  return (
    // 1. MAIN BACKGROUND & TEXT
    <main suppressHydrationWarning={true} className={`min-h-screen font-mono transition-colors duration-300 selection:bg-neon-green selection:text-cyber-black ${
      isDark 
        ? 'bg-[#050505] text-white' 
        : 'bg-[#f8f8f8] text-[#111111]'
    }`}>
      {/* 2. NAVBAR */}
      <nav suppressHydrationWarning={true} 
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-2 md:px-6 md:py-2 border-b transition-all ${
          isDark 
            ? 'bg-[#050A06]/90 backdrop-blur-md border-[#00FF94]/20' 
            : 'bg-white/90 backdrop-blur-md border-[#00AA66]/30'
        }`}>
        
        <div className="flex items-center gap-2 cursor-pointer" 
             onClick={() => window.location.href='/'}>
          <img 
            src="/logo.png" 
            alt="WalletConnect" 
            suppressHydrationWarning={true}
            style={{width: '45px', height: '45px', objectFit: 'contain'}}
          />
          <span className="hidden md:inline-block" style={{
            color: '#00FF94', 
            fontFamily: 'monospace', 
            fontSize: '20px', 
            fontWeight: '900', 
            letterSpacing: '2px'
          }}>
            WALLETCONNECT GRID_FINDER
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`text-xs font-mono px-2 py-1 md:px-3 md:py-1 border transition-all ${
              isDark ? 'text-[#00FF94] border-[#00FF94]/40' : 'text-[#00AA66] border-[#00AA66]/40'
            }`}>
            // {isDark ? 'LIGHT' : 'DARK'}
          </button>
          <button
            onClick={() => window.location.href='/merchant'}
            className={`text-xs font-mono px-2 py-1 md:px-3 md:py-1 border transition-all ${
              isDark ? 'text-[#00FF94] border-[#00FF94]/40' : 'text-[#00AA66] border-[#00AA66]/40'
            }`}>
            + LIST STORE
          </button>
          <button
            onClick={() => connectWallet()}
            className="text-xs font-mono px-3 py-1 bg-[#00FF94] text-black font-bold">
            {walletConnected && walletAddress ? `${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}` : '// CONNECT'}
          </button>
        </div>
      </nav>

      <div style={{
        background: '#000',
        color: '#00FF94',
        fontFamily: 'monospace',
        fontSize: '12px',
        fontWeight: 'bold',
        padding: '0',
        height: '28px',
        lineHeight: '28px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        position: 'fixed',
        top: '56px',
        left: 0,
        right: 0,
        zIndex: 49,
        borderTop: '1px solid #00FF94',
        borderBottom: '1px solid #00FF94'
      }}>
        <div style={{
          display: 'inline-block',
          animation: 'ticker 60s linear infinite'
        }}>
          ⚡ WALLETCONNECT PAY × INGENICO — 40M+ POS TERMINALS IN 120+ COUNTRIES &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; 
          ⚡ WALLETCONNECT × SHOPIFY — CRYPTO PAYMENTS FOR MILLIONS OF MERCHANTS &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          ⚡ WALLETCONNECT × DTCPAY — ONCHAIN PAYMENTS USDC · USDT · ETH &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          ⚡ WALLETCONNECT × COINBASE — WEB3 PAYMENTS INTEGRATION &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          ⚡ WALLETCONNECT × BITPAY — BITCOIN & CRYPTO MERCHANT SOLUTIONS &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          ⚡ STABLECOIN PAYMENTS LAUNCHING Q1/Q2 2026 — POLYGON · BASE · ARBITRUM · ETHEREUM &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        </div>
      </div>

      <div className="pt-16 overflow-hidden">
        <Hero />
      </div>

      {/* 5. SEARCH SECTION background */}
      <div className={`sticky top-[72px] md:top-[88px] z-40 backdrop-blur-md border-b py-4 md:py-5 px-3 md:px-4 ${
        isDark ? 'bg-[#050505]/90 border-[#00FF94]/20' : 'bg-[#f0f0f0]/90 border-[#00AA66]/30'
      }`}>

        <div className="flex flex-col items-center gap-3 max-w-[700px] mx-auto w-full">
          <div className="w-full relative">
            <div className="mb-2">
              <label className="font-mono text-[0.6rem] text-text-muted tracking-wider uppercase">
                // ENTER_TARGET_LOCATION
              </label>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative group">
              <div className="relative flex items-center">
                <span className={`absolute left-3 md:left-4 font-mono text-xs md:text-sm ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>◈</span>
                {/* 6. SEARCH INPUT box */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearch(searchQuery);
                    }
                  }}
                  onFocus={() => setShowHistory(true)}
                  onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                  placeholder="Search city, country, or region..."
                  disabled={status === "loading"}
                  className={`w-full border px-8 md:px-10 py-3 md:py-4 font-mono outline-none transition-all duration-200 text-sm md:text-base disabled:opacity-50 ${
                    isDark 
                      ? 'bg-[#0a0a0a] border-[#00FF94]/30 text-white placeholder-gray-600 focus:border-[#00FF94]' 
                      : 'bg-white border-[#00AA66]/40 text-[#111] placeholder-gray-400 focus:border-[#00AA66]'
                  }`}
                />
                <div className="absolute right-1 md:right-2 flex items-center gap-2 md:gap-4">
                  {searchQuery && status !== "loading" && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className={`font-mono text-[0.6rem] md:text-[0.7rem] transition-all px-1 ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}
                    >
                      ✕
                    </button>
                  )}
                  {/* 7. SCAN GRID button */}
                  <button
                    type="button"
                    onClick={() => handleSearch(searchQuery)}
                    disabled={status === "loading" || !searchQuery.trim()}
                    className={`font-mono font-bold px-3 md:px-6 py-1.5 md:py-2 text-[0.65rem] md:text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                      isDark 
                        ? 'bg-[#00FF94] text-black hover:bg-transparent hover:text-[#00FF94] border border-[#00FF94]'
                        : 'bg-[#00AA66] text-white hover:bg-transparent hover:text-[#00AA66] border border-[#00AA66]'
                    }`}
                  >
                    {status === "loading" ? "..." : 'SCAN GRID'}
                  </button>
                </div>
              </div>
            </form>

            {/* 25. SEARCH HISTORY DROPDOWN */}
            {showHistory && searchHistory.length > 0 && (
              <div className={`absolute top-full left-0 right-0 z-50 border shadow-xl ${
                isDark ? 'border-[#00FF94]/30 bg-[#0a0a0a]' : 'border-[#00AA66]/30 bg-white shadow-lg'
              }`}>
                <div className="flex justify-between items-center px-3 py-1 border-b border-[#00FF94]/20">
                  <span className="text-[0.55rem] md:text-[0.6rem] font-mono text-gray-500 uppercase tracking-widest">// RECENT_SEARCHES</span>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setSearchHistory([]);
                    localStorage.removeItem('search-history');
                  }} className="text-[0.55rem] md:text-[0.6rem] text-red-400 font-mono hover:underline uppercase tracking-widest">CLEAR</button>
                </div>
                {searchHistory.map((h, i) => (
                  <button key={i}
                    onClick={() => { setSearchQuery(h); handleSearch(h); setShowHistory(false); }}
                    className={`w-full text-left px-3 py-2 text-[0.65rem] md:text-xs font-mono transition-colors ${
                      isDark 
                        ? 'text-[#00FF94]/70 hover:bg-[#00FF94]/10 hover:text-[#00FF94]'
                        : 'text-[#007744] hover:bg-[#00AA66]/10 hover:text-[#005533]'
                    }`}
                  >
                    ◈ {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 8. SCAN NEARBY LOCATIONS button */}
          <button
            onClick={handleNearMe}
            className={`flex items-center gap-2 border font-mono text-[0.65rem] md:text-[0.7rem] transition-all duration-200 uppercase tracking-widest px-4 py-2 ${
              isDark 
                ? 'border-[#00FF94]/40 text-[#00FF94]/70 hover:border-[#00FF94] hover:text-[#00FF94]'
                : 'border-[#00AA66]/50 text-[#00AA66] hover:border-[#00AA66] hover:text-[#007744]'
            }`}
          >
            <span className="animate-pulse">◈</span> ◈ SCAN NEARBY LOCATIONS
          </button>
        </div>
      </div>

      <section ref={resultsRef} className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-[1400px]">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            {/* 9. SECTION HEADERS */}
            <h2 className={`font-mono text-[0.7rem] md:text-[0.75rem] tracking-[0.2em] uppercase ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>
              {status === "districts"
                ? `// SELECT_DISTRICT — ${currentCity.toUpperCase()}`
                : hasSearched
                ? "// GRID_RESULTS"
                : ''}
            </h2>
            {/* 24. SHOW FAVOURITES button */}
            <button
              onClick={() => setShowFavourites(prev => !prev)}
              className={`text-[0.55rem] md:text-[0.6rem] border px-2 md:px-3 py-1 font-mono uppercase tracking-widest transition-colors ${
                isDark 
                  ? 'border-[#00FF94] text-[#00FF94] hover:bg-[#00FF94]/10' 
                  : 'border-[#00AA66] text-[#00AA66] hover:bg-[#00AA66]/10'
              }`}
            >
              {showFavourites ? '// ALL' : `// FAVS [${favourites.length}]`}
            </button>
          </div>
          {/* 15. RESULTS COUNT text */}
          {hasSearched && (
            <span className={`font-mono text-[0.6rem] md:text-[0.7rem] uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              [ {cryptoFiltered.length} NODES ACTIVE ]
            </span>
          )}
        </div>
        <div className={`h-[1px] w-full mb-6 ${isDark ? 'bg-[#00FF94]/15' : 'bg-[#00AA66]/20'}`} />

        {/* 14. CRYPTO FILTER BUTTONS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {['ALL','BTC','ETH','USDT','USDC','WCT','XRP','SOL','CRYPTO ATM'].map(coin => (
            <button
              key={coin}
              onClick={() => setCryptoFilter(coin)}
              className={`text-[0.6rem] font-mono px-2 py-1 md:px-3 border transition-all tracking-tighter uppercase whitespace-nowrap flex-shrink-0 ${
                cryptoFilter === coin
                  ? (isDark ? 'bg-[#00FF94] text-black' : 'bg-[#00AA66] text-white')
                  : (isDark 
                      ? 'text-[#00FF94] border-[#00FF94]/40 hover:border-[#00FF94]'
                      : 'text-[#00AA66] border-[#00AA66]/40 hover:border-[#00AA66]')
              }`}
            >
              {coin === 'ALL' ? '// ALL_CRYPTO' : `// ${coin}`}
            </button>
          ))}
        </div>

        {status === "loading" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className={`border animate-pulse ${
                isDark ? 'border-[#00FF94]/10 bg-[#0a0a0a]' : 'border-gray-200 bg-gray-100'
              }`}>
                <div className={`h-36 md:h-48 ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`} />
                <div className="p-3 space-y-2">
                  <div className={`h-4 w-3/4 ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`} />
                  <div className={`h-3 w-full ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`} />
                  <div className={`h-3 w-1/2 ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`} />
                </div>
              </div>
            ))}
          </div>
        )}

        {status === "districts" && districts.length > 0 && (
          <div>
            <p className={`font-mono text-[0.65rem] md:text-[0.7rem] mb-6 tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              // {currentCity.toUpperCase()} IS A LARGE CITY — SELECT A DISTRICT
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {districts.map((district, i) => (
                <button
                  key={i}
                  onClick={() => handleDistrictClick(district)}
                  className={`group flex flex-col items-start p-3 md:p-4 border transition-all duration-200 text-left ${
                    isDark ? 'bg-[#0a0a0a] border-[#00FF94]/20 hover:border-[#00FF94]/60' 
                           : 'bg-white border-[#00AA66]/20 hover:border-[#00AA66]/60 shadow-sm'
                  }`}
                >
                  <span className={`font-mono text-[0.55rem] md:text-[0.6rem] mb-2 tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    // DISTRICT_{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={`font-mono text-xs md:text-sm transition-colors ${isDark ? 'group-hover:text-[#00FF94]' : 'group-hover:text-[#00AA66]'}`}>
                    {district.name}
                  </span>
                  <span className={`font-mono text-[0.55rem] md:text-[0.6rem] mt-2 tracking-wider ${isDark ? 'text-[#00FF94]/50' : 'text-[#00AA66]/50'}`}>
                    SCAN → 
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {(status === "success" || status === "idle") && cryptoFiltered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cryptoFiltered.map((merchant) => {
              const googleMapsUrl =
                merchant.lat && merchant.lng
                  ? `https://www.google.com/maps/search/?api=1&query=${merchant.lat},${merchant.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.address)}`;
              
              const merchantReviews = reviews[merchant.id] || [];
              const avgRating = merchantReviews.length 
                ? Math.round(merchantReviews.reduce((a,r) => a + r.rating, 0) / merchantReviews.length) 
                : 0;

              return (
                /* 10. MERCHANT CARDS */
                <div key={merchant.id} 
                     onClick={() => setSelectedMerchant(merchant)}
                     className={`group relative flex flex-col border rounded-none overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                       isDark 
                         ? 'bg-[#0a0a0a] border-[#00FF94]/20 hover:border-[#00FF94]/60' 
                         : 'bg-white border-[#00AA66]/20 hover:border-[#00AA66]/60 shadow-sm'
                     }`}>
                  
                  {/* 22. FAVOURITE STAR button color */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavourite(merchant.id); }}
                    className={`absolute top-2 right-2 z-20 text-xl md:text-lg bg-black/60 w-9 h-9 md:w-8 md:h-8 flex items-center justify-center border border-neon-green/20 hover:border-neon-green/60 transition-colors p-2 ${
                      favourites.includes(merchant.id) 
                        ? 'text-yellow-400' 
                        : (isDark ? 'text-gray-600' : 'text-gray-400')
                    }`}
                    title="Bookmark"
                  >
                    {favourites.includes(merchant.id) ? '★' : '☆'}
                  </button>

                  <div className="relative h-36 md:h-48 w-full overflow-hidden">
                    {merchant.imageUrl ? (
                      <img
                        src={merchant.imageUrl}
                        alt={merchant.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center border-b border-[#00FF94]/10">
                        <span className="text-[#00FF94]/20 text-4xl font-mono">◈</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    {merchant.category && (
                      /* 13. CARD category badge */
                      <div className={`absolute top-3 left-3 px-2 py-1 ${
                        isDark 
                          ? 'bg-[#0a0a0a]/80 text-[#00FF94] border border-[#00FF94]/30'
                          : 'bg-white/90 text-[#00AA66] border border-[#00AA66]/30'
                      }`}>
                        <span className="font-mono text-[0.55rem] md:text-[0.6rem] tracking-wider uppercase">
                          // {merchant.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 md:p-4 flex flex-col flex-grow">
                    {/* 11. CARD TEXT — store name */}
                    <h3 className={`font-mono text-sm md:text-base leading-tight mb-1 md:mb-2 transition-colors group-hover:text-[#00FF94] truncate ${
                      isDark ? 'text-white' : 'text-[#111111]'
                    }`}>
                      {merchant.name}
                    </h3>
                    {/* 12. CARD TEXT — address */}
                    <p className={`font-display text-[0.65rem] md:text-[0.8rem] line-clamp-1 leading-relaxed mb-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {merchant.address}
                    </p>

                    <div className="flex flex-col gap-1.5 md:gap-2 mb-3 md:mb-4">
                      <div className="flex items-center gap-1">
                        {/* 19. REVIEW stars (empty) */}
                        {[1,2,3,4,5].map(star => (
                          <span key={star} className="text-[0.55rem] md:text-[0.6rem] text-yellow-400">★</span>
                        ))}
                        <span className="text-[0.55rem] md:text-[0.6rem] text-gray-500 font-mono ml-1">
                          [{merchantReviews.length}]
                        </span>
                        {/* 20. REVIEW "+ REVIEW" button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setActiveReviewId(activeReviewId === merchant.id ? null : merchant.id); }}
                          className={`text-[0.55rem] md:text-[0.6rem] font-mono ml-2 hover:underline tracking-tighter ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}
                        >
                          + REVIEW
                        </button>
                      </div>

                      {/* 21. REVIEW INPUT */}
                      {activeReviewId === merchant.id && (
                        <div onClick={e => e.stopPropagation()} className="mt-2 p-2 md:p-3 border border-[#00FF94]/30 bg-black/40 animate-in fade-in slide-in-from-top-1">
                          <div className="flex gap-1 mb-2">
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                onClick={() => setReviewInput(p => ({...p, rating: star}))}
                                className="text-sm text-yellow-400"
                              >★</button>
                            ))}
                          </div>
                          <input
                            type="text"
                            placeholder="Review..."
                            value={reviewInput.comment}
                            onChange={e => setReviewInput(p => ({...p, comment: e.target.value}))}
                            className={`w-full border text-sm p-2 font-mono mb-2 focus:border-[#00FF94] outline-none ${
                              isDark 
                                ? 'bg-black border-[#00FF94]/40 text-white' 
                                : 'bg-gray-100 border-[#00AA66]/40 text-black'
                            }`}
                          />
                          <button
                            onClick={() => submitReview(merchant.id)}
                            className={`text-[0.6rem] font-mono px-3 py-1.5 font-bold w-full transition-colors ${
                              isDark 
                                ? 'bg-[#00FF94] text-black hover:bg-[#00FF94]/80' 
                                : 'bg-[#00AA66] text-white hover:bg-[#00AA66]/80'
                            }`}
                          >
                            SUBMIT
                          </button>
                        </div>
                      )}

                      {merchantReviews.slice(0, 1).map((r, i) => (
                        <div key={i} className="text-[0.6rem] md:text-[0.65rem] font-mono text-gray-400 border-l-2 border-[#00FF94]/30 pl-2 italic line-clamp-1">
                          <span className="text-yellow-400">{'★'.repeat(r.rating)}</span> — {r.comment}
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-neon-green/15 flex items-center justify-between gap-1 flex-wrap">
                      {/* 16. VIEW MAP button */}
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className={`text-[0.65rem] md:text-[0.7rem] font-mono flex items-center gap-1 ${isDark ? 'text-[#00FF94] hover:underline' : 'text-[#00AA66] hover:underline'}`}
                      >
                        ◈ GET DIRECTIONS
                      </a>
                      
                      <div className="flex gap-1">
                        {/* 17. WA share button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); shareStore(merchant, 'whatsapp'); }}
                          className={`text-[0.55rem] md:text-[0.6rem] font-mono px-1 md:px-2 py-1 transition-all border ${
                            isDark ? 'text-green-400 border-green-400/30' : 'text-green-600 border-green-600/30'
                          }`}
                          title="WhatsApp"
                        >
                          WA
                        </button>
                        {/* 18. TW share button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); shareStore(merchant, 'twitter'); }}
                          className={`text-[0.55rem] md:text-[0.6rem] font-mono px-1 md:px-2 py-1 transition-all border ${
                            isDark ? 'text-blue-400 border-blue-400/30' : 'text-blue-600 border-blue-600/30'
                          }`}
                          title="Twitter"
                        >
                          TW
                        </button>
                      </div>

                      <span className={`font-mono text-[0.5rem] md:text-[0.55rem] flex items-center gap-1 uppercase ml-auto ${isDark ? 'text-[#00FF94]/40' : 'text-[#00AA66]/40'}`}>
                        WC PAY
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {status === "success" && cryptoFiltered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className={`font-mono text-lg md:text-xl tracking-widest uppercase ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              // NO_NODES_DETECTED
            </span>
            <p className={`font-mono text-[0.6rem] md:text-[0.7rem] mt-4 tracking-widest uppercase ${isDark ? 'text-gray-500/60' : 'text-gray-600/60'}`}>
              No crypto merchants found in this area yet.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <span className="font-mono text-lg md:text-xl text-danger-red tracking-widest uppercase">
              // CONNECTION_FAILED
            </span>
            <p className={`font-mono max-w-md uppercase text-xs md:text-sm tracking-widest mt-2 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              {errorMessage}
            </p>
          </div>
        )}

      </section>

      {/* 26. NOTIFICATION TOAST */}
      {nearbyNotif && (
        <div className={`fixed bottom-20 md:bottom-6 left-4 right-4 md:left-1/2 
                        md:right-auto md:-translate-x-1/2 z-50 
                        border px-4 py-3 font-mono text-center animate-pulse text-xs md:text-sm ${
          isDark 
            ? 'bg-black border-[#00FF94] text-[#00FF94] shadow-[0_0_20px_#00FF94]'
            : 'bg-white border-[#00AA66] text-[#00AA66] shadow-[0_0_20px_#00AA66]/30'
        }`}>
          {nearbyNotif}
        </div>
      )}

      {selectedMerchant && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/85 backdrop-blur-md p-0 md:p-4"
             onClick={() => setSelectedMerchant(null)}>
          <div className={`border p-4 md:p-6 w-full md:max-w-lg font-mono max-h-[92vh] md:max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-none ${
            isDark ? 'bg-[#050505] border-[#00FF94]/50 shadow-[0_0_60px_#00FF9415]' : 'bg-white border-gray-300 shadow-2xl'
          }`}
               onClick={e => e.stopPropagation()}>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className={`text-[0.6rem] mb-1 uppercase tracking-widest ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>// MERCHANT_DETAIL</p>
                <h2 className={`text-lg md:text-xl font-bold uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>{selectedMerchant.name}</h2>
              </div>
              <button onClick={() => setSelectedMerchant(null)} 
                      className="text-gray-500 hover:text-white text-2xl transition-colors">✕</button>
            </div>

            <div className="relative mb-6 border border-[#00FF94]/20 overflow-hidden group">
              {selectedMerchant.imageUrl ? (
                <img src={selectedMerchant.imageUrl} alt={selectedMerchant.name}
                     loading="lazy"
                     className="w-full h-48 md:h-56 object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-48 md:h-56 bg-[#0a0a0a] flex items-center justify-center border-b border-[#00FF94]/10">
                  <span className="text-[#00FF94]/20 text-4xl font-mono">◈</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className={`absolute bottom-3 left-3 px-2 py-1 text-[0.6rem] font-bold uppercase ${isDark ? 'bg-[#00FF94] text-black' : 'bg-[#00AA66] text-white'}`}>
                {selectedMerchant.category || 'RETAIL'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6">
              <div className={`border p-2 md:p-3 bg-white/5 ${isDark ? 'border-[#00FF94]/20' : 'border-gray-200'}`}>
                <p className={`text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest mb-1 ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>// CATEGORY</p>
                <p className={`text-[0.65rem] md:text-xs uppercase truncate ${isDark ? 'text-white' : 'text-black'}`}>{selectedMerchant.category || 'Unknown'}</p>
              </div>
              <div className={`border p-2 md:p-3 bg-white/5 ${isDark ? 'border-[#00FF94]/20' : 'border-gray-200'}`}>
                <p className={`text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest mb-1 ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>// SOURCE</p>
                <p className={`text-[0.65rem] md:text-xs uppercase ${isDark ? 'text-white' : 'text-black'}`}>{selectedMerchant.source || 'GRID'}</p>
              </div>
              <div className={`border p-2 md:p-3 col-span-2 bg-white/5 ${isDark ? 'border-[#00FF94]/20' : 'border-gray-200'}`}>
                <p className={`text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest mb-1 ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>// ADDRESS</p>
                <p className={`text-[0.65rem] md:text-xs leading-relaxed ${isDark ? 'text-white' : 'text-black'}`}>{selectedMerchant.address}</p>
              </div>
              <div className={`border p-2 md:p-3 col-span-2 bg-white/5 ${isDark ? 'border-[#00FF94]/20' : 'border-gray-200'}`}>
                <p className={`text-[0.55rem] md:text-[0.6rem] uppercase tracking-widest mb-1 ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>// COORDINATES</p>
                <p className={`text-[0.65rem] md:text-xs font-mono ${isDark ? 'text-white' : 'text-black'}`}>{selectedMerchant.lat?.toFixed(6)}, {selectedMerchant.lng?.toFixed(6)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {['BTC','ETH','USDT','USDC','WCT'].map(coin => (
                <span key={coin} 
                      className={`text-[0.6rem] md:text-[0.65rem] border px-2 py-1 font-bold ${isDark ? 'border-[#00FF94]/40 text-[#00FF94]' : 'border-[#00AA66]/40 text-[#00AA66]'}`}>
                  ◈ {coin}
                </span>
              ))}
            </div>

            <div className="flex gap-2 flex-wrap mb-8">
              <a href={`https://www.google.com/maps?q=${selectedMerchant.lat},${selectedMerchant.lng}`}
                 target="_blank" rel="noopener noreferrer"
                 className={`flex-1 text-center py-3 border transition-all uppercase tracking-widest text-[0.65rem] md:text-xs font-bold ${
                   isDark ? 'bg-[#00FF94] text-black hover:bg-transparent hover:text-[#00FF94] border-[#00FF94]' : 'bg-[#00AA66] text-white hover:bg-transparent hover:text-[#00AA66] border-[#00AA66]'
                 }`}>
                ◈ GET DIRECTIONS
              </a>
              <button
                onClick={() => shareStore(selectedMerchant, 'whatsapp')}
                className="text-[0.6rem] md:text-[0.65rem] font-bold border border-green-400/50 text-green-400 px-3 md:px-4 py-3 hover:bg-green-400/10 transition-colors uppercase">
                WA
              </button>
              <button
                onClick={() => shareStore(selectedMerchant, 'twitter')}
                className="text-[0.6rem] md:text-[0.65rem] font-bold border border-blue-400/50 text-blue-400 px-3 md:px-4 py-3 hover:bg-blue-400/10 transition-colors uppercase">
                TW
              </button>
              <button
                onClick={() => { toggleFavourite(selectedMerchant.id); }}
                className={`text-[0.6rem] md:text-[0.65rem] font-bold border px-3 md:px-4 py-3 transition-colors uppercase ${
                  favourites.includes(selectedMerchant.id) 
                    ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' 
                    : 'border-gray-500 text-gray-500 hover:border-yellow-400 hover:text-yellow-400'
                }`}>
                {favourites.includes(selectedMerchant.id) ? '★ SAVED' : '☆ SAVE'}
              </button>
            </div>

            <div className={`mt-4 border-t pt-6 ${isDark ? 'border-[#00FF94]/20' : 'border-gray-200'}`}>
              <p className={`text-[0.6rem] md:text-[0.65rem] mb-4 uppercase tracking-widest font-bold ${isDark ? 'text-[#00FF94]' : 'text-[#00AA66]'}`}>// REVIEWS [{reviews[selectedMerchant.id]?.length || 0}]</p>
              <div className="space-y-4 pb-4">
                {reviews[selectedMerchant.id]?.map((r, i) => (
                  <div key={i} className={`mb-2 border-l-2 pl-4 py-1 ${isDark ? 'border-[#00FF94]/30' : 'border-[#00AA66]/30'}`}>
                    <div className="flex gap-1 mb-1">
                      {[1,2,3,4,5].map(s => (
                        <span key={s} className="text-[0.55rem] text-yellow-400">★</span>
                      ))}
                    </div>
                    <p className={`text-[0.65rem] md:text-xs italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>"{r.comment}"</p>
                    <p className="text-gray-600 text-[0.55rem] md:text-[0.6rem] mt-1 uppercase tracking-tighter">— NODE_{i} // {r.date}</p>
                  </div>
                ))}
                {!reviews[selectedMerchant.id]?.length && (
                  <p className="text-gray-600 text-[0.6rem] font-mono italic">// NO_REVIEWS_YET</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <PWAInstall />
    </main>
  );
}
