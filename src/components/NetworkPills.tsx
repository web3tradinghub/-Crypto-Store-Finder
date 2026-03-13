import React from 'react';
import { Radio } from 'lucide-react';

const NETWORKS = [
  { name: 'ETHEREUM', color: '#CCFF00' },
  { name: 'BASE', color: '#BF00FF' },
  { name: 'SOLANA', color: '#CCFF00' },
  { name: 'ARBITRUM', color: '#FF003F' },
  { name: 'POLYGON', color: '#BF00FF' },
  { name: 'OPTIMISM', color: '#FF003F' },
];

export default function NetworkPills() {
  return (
    <div className="flex items-center justify-center gap-4 flex-wrap mt-12">
      <div className="w-full mb-2 flex items-center justify-center gap-3">
         <Radio className="w-3 h-3 text-cyber-lime animate-pulse" />
         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 font-mono">SUPPORTED_NETWORKS</span>
      </div>
      {NETWORKS.map((network) => (
        <div 
          key={network.name}
          className="hud-glass border-white/5 px-5 py-2 flex items-center gap-3 hover:border-white/20 transition-all cursor-default group"
        >
          <div 
            className="w-1.5 h-1.5 shadow-[0_0_8px_rgba(255,255,255,0.5)] group-hover:animate-ping" 
            style={{ backgroundColor: network.color }}
          />
          <span className="text-[10px] font-black text-white/60 group-hover:text-white transition-colors font-mono tracking-widest">{network.name}</span>
        </div>
      ))}
    </div>
  );
}
