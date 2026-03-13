'use client';

import React, { useState } from 'react';
import Map from '@/components/Map';
import SearchBar from '@/components/SearchBar';
import AIChatBubble from '@/components/AIChatBubble';
import { useSearch } from '@/hooks/useSearch';
import { useGeolocation } from '@/hooks/useGeolocation';
import { VIP_PARTNERS } from '@/data/vip-partners';
import { Shield, Radio, Crosshair, Cpu, Activity, Battery } from 'lucide-react';

export default function MapPage() {
  const { merchants, isLoading, performSearch } = useSearch();
  const { getUserLocation } = useGeolocation();
  const [mapCenter, setMapCenter] = useState({ lat: 25.2048, lng: 55.2708 });

  React.useEffect(() => {
    getUserLocation()
      .then(coords => setMapCenter(coords))
      .catch(err => console.error("Location access denied", err));
  }, []);

  const handleSearch = (query: string) => {
    performSearch(query);
  };

  const handleUseLocation = async () => {
    // Geolocation logic would go here
  };

  return (
    <main className="h-screen w-full bg-black overflow-hidden relative font-mono select-none">
      {/* MAP LAYER: Full screen background */}
      <div className="absolute inset-0 z-0">
        <Map 
          markers={merchants.length > 0 ? merchants : VIP_PARTNERS} 
          center={mapCenter} 
        />
        {/* Dark Map Overlay for Mapbox Effect */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      {/* HUD OVERLAY LAYER */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Top HUD Bar */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <div className="hud-glass border-cyber-lime/50 px-4 py-2 flex items-center gap-4 pointer-events-auto">
              <Shield className="w-5 h-5 text-cyber-lime animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[10px] text-cyber-lime uppercase font-black tracking-[0.2em]">CRYPTO_GRID_V1.0.4</span>
                <span className="text-[8px] text-white/40 font-mono">ENCRYPTION: 256-BIT_AES</span>
              </div>
              <div className="hud-corner hud-corner-tl !w-2 !h-2" />
              <div className="hud-corner hud-corner-br !w-2 !h-2" />
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="hud-glass border-cyber-purple/50 px-6 py-2 flex items-center gap-6 pointer-events-auto">
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-cyber-purple/60 uppercase">SIGNAL</span>
                <div className="flex gap-0.5 mt-1">
                  <div className="w-1 h-3 bg-cyber-purple" />
                  <div className="w-1 h-3 bg-cyber-purple" />
                  <div className="w-1 h-3 bg-cyber-purple" />
                  <div className="w-1 h-2 bg-cyber-purple/20" />
                </div>
              </div>
              <div className="h-8 w-[1px] bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-[8px] text-cyber-lime/60 uppercase">LATENCY</span>
                <span className="text-[10px] text-cyber-lime font-black">24MS</span>
              </div>
            </div>
            
            <div className="w-12 h-12 bg-cyber-lime flex items-center justify-center shadow-glow-lime pointer-events-auto cursor-crosshair">
              <Crosshair className="w-6 h-6 text-black" />
            </div>
          </div>
        </div>

        {/* Side HUD Elements */}
        <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-8 opacity-60">
           <div className="flex flex-col items-center gap-2">
              <Radio className="w-4 h-4 text-cyber-lime animate-pulse" />
              <div className="w-[1px] h-20 bg-gradient-to-b from-cyber-lime to-transparent" />
           </div>
           <div className="space-y-4 font-mono text-[8px] text-cyber-lime uppercase vertical-text tracking-[0.5em]">
              <span>STATUS: NOMINAL</span>
              <span>GRID_SYNC_ACTIVE</span>
           </div>
        </div>

        <div className="absolute top-1/2 right-6 -translate-y-1/2 flex flex-col items-end gap-6">
           <div className="hud-glass border-white/10 p-4 space-y-4 pointer-events-auto">
              <div className="flex items-center gap-3">
                 <Cpu className="w-4 h-4 text-cyber-purple" />
                 <div className="w-32 h-1 bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-cyber-purple w-[65%] animate-pulse" />
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Activity className="w-4 h-4 text-cyber-lime" />
                 <div className="w-32 h-1 bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-cyber-lime w-[42%] animate-pulse" />
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Battery className="w-4 h-4 text-cyber-red" />
                 <div className="w-32 h-1 bg-white/5 relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-cyber-red w-[18%] animate-pulse" />
                 </div>
              </div>
           </div>
        </div>

        {/* HUD Frame Borders */}
        <div className="absolute inset-4 border border-white/[0.03] pointer-events-none">
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyber-lime shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyber-lime shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyber-lime shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyber-lime shadow-[0_0_15px_rgba(204,255,0,0.5)]" />
        </div>
      </div>

      {/* BOTTOM CENTER: Search Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-6 pointer-events-auto">
        <div className="relative group">
           {/* Decorative HUD background for search */}
           <div className="absolute -inset-4 bg-cyber-lime/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
           <SearchBar 
             onSearch={handleSearch} 
             onClear={() => {}} 
             isLoading={isLoading} 
           />        </div>
      </div>

      {/* BOTTOM RIGHT: AI Agent Chat */}
      <div className="pointer-events-auto relative z-40">
        <AIChatBubble />
      </div>

      {/* Global HUD Effects */}
      <div className="scanline-overlay z-50" />
      <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] animate-scanline" />

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </main>
  );
}
