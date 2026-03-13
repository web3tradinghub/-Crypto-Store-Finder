import React from 'react';
import { SearchX, ChevronRight, AlertTriangle, Map } from 'lucide-react';

const MAJOR_CITIES = [
  { name: 'DUBAI_AE', lat: 25.2048, lng: 55.2708 },
  { name: 'SINGAPORE_SG', lat: 1.3521, lng: 103.8198 },
  { name: 'LONDON_UK', lat: 51.5074, lng: -0.1278 },
  { name: 'NEW_YORK_US', lat: 40.7128, lng: -74.0060 },
];

interface EmptyStateProps {
  onCitySelect: (query: string, lat: number, lng: number) => void;
}

export default function EmptyState({ onCitySelect }: EmptyStateProps) {
  return (
    <div className="hud-glass border-white/10 py-32 text-center px-6 relative group overflow-hidden">
      <div className="absolute inset-0 bg-cyber-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="hud-glass border-cyber-purple/50 w-24 h-24 flex items-center justify-center mb-8 relative animate-pulse shadow-glow-purple">
          <SearchX className="w-10 h-10 text-cyber-purple" />
          <div className="hud-corner hud-corner-tl !w-2 !h-2" />
          <div className="hud-corner hud-corner-br !w-2 !h-2" />
        </div>
        
        <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-[0.2em]">ZERO_NODES_DETECTED</h3>
        <p className="text-white/40 max-w-sm mx-auto mb-12 font-mono text-xs uppercase tracking-widest leading-relaxed">
          The mercantile grid is empty at these coordinates. Signal strength is nominal, but no decentralized merchants are active in this sector.
        </p>

        <div className="w-full max-w-lg">
          <div className="flex items-center gap-3 mb-6 justify-center">
             <Map className="w-4 h-4 text-cyber-lime" />
             <p className="text-[10px] font-black text-cyber-lime uppercase tracking-[0.3em]">RECALIBRATE_TO_MAJOR_HUBS</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MAJOR_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => onCitySelect(city.name, city.lat, city.lng)}
                className="hud-glass border-white/10 flex items-center justify-between px-6 py-5 hover:border-cyber-lime/50 hover:bg-cyber-lime/5 transition-all group font-black text-[10px] text-white/70 uppercase tracking-[0.2em] relative"
              >
                <span className="group-hover:text-cyber-lime transition-colors">{city.name}</span>
                <ChevronRight className="w-4 h-4 text-cyber-lime opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HUD Corners */}
      <div className="hud-corner hud-corner-tl !w-12 !h-12 !border-cyber-purple/30" />
      <div className="hud-corner hud-corner-br !w-12 !h-12 !border-cyber-purple/30" />
    </div>
  );
}
