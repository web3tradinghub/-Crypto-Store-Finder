import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="hud-glass border-white/5 overflow-hidden animate-pulse relative">
          <div className="h-56 bg-white/[0.03]" />
          <div className="p-6 space-y-6">
            <div className="flex justify-between">
              <div className="h-3 bg-cyber-lime/20 rounded-none w-1/4" />
              <div className="h-3 bg-white/5 rounded-none w-1/4" />
            </div>
            <div className="h-8 bg-white/10 rounded-none w-3/4" />
            <div className="space-y-3">
              <div className="h-2 bg-white/5 rounded-none w-full" />
              <div className="h-2 bg-white/5 rounded-none w-5/6" />
            </div>
            <div className="pt-6 border-t border-white/5 flex justify-between">
              <div className="h-3 bg-cyber-purple/20 rounded-none w-1/3" />
              <div className="h-3 bg-white/5 rounded-none w-1/4" />
            </div>
          </div>
          
          {/* HUD Corner Accents */}
          <div className="hud-corner hud-corner-tl !w-2 !h-2 opacity-20" />
          <div className="hud-corner hud-corner-br !w-2 !h-2 opacity-20" />
        </div>
      ))}
    </div>
  );
}
