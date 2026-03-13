"use client";

import { useState } from "react";

interface Merchant {
  id: string;
  name: string;
  address: string;
  imageUrl?: string;
  category?: string;
  lat?: number;
  lng?: number;
  isVip?: boolean;
}

interface MerchantCardProps {
  merchant: Merchant;
  fallbackImage: string;
}

export default function MerchantCard({ merchant, fallbackImage }: MerchantCardProps) {
  const [imgSrc, setImgSrc] = useState<string>(
    merchant.imageUrl && merchant.imageUrl.length > 10 
      ? merchant.imageUrl 
      : ''
  );

  const googleMapsUrl =
    merchant.lat && merchant.lng
      ? `https://www.google.com/maps/search/?api=1&query=${merchant.lat},${merchant.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(merchant.address)}`;

  return (
    <div className="group relative flex flex-col bg-grid-dark border border-neon-green/25 rounded-none overflow-hidden transition-all duration-300 hover:border-neon-green/70 hover:shadow-[0_0_30px_#00FF9420] hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative h-[200px] w-full overflow-hidden">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={merchant.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgSrc('')}
          />
        ) : (
          <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center border-b border-[#00FF94]/10">
            <span className="text-[#00FF94]/20 text-4xl font-mono">◈</span>
          </div>
        )}
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-grid-dark via-transparent to-transparent opacity-80" />

        {/* Category Badge */}
        {merchant.category && (
          <div className="absolute top-3 left-3 bg-cyber-black/80 border border-neon-green/40 px-2 py-1">
            <span className="font-mono text-[0.6rem] text-neon-green tracking-wider uppercase">
              // {merchant.category}
            </span>
          </div>
        )}

        {/* VIP Badge */}
        {merchant.isVip && (
          <div className="absolute top-3 right-3 bg-neon-green px-2 py-1">
            <span className="font-mono text-[0.6rem] text-cyber-black font-bold tracking-wider uppercase">
              ★ VIP PARTNER
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-mono text-text-primary text-base leading-tight mb-2 transition-colors group-hover:text-neon-green">
          {merchant.name}
        </h3>
        <p className="font-display text-text-muted text-[0.85rem] line-clamp-2 leading-relaxed mb-4">
          {merchant.address}
        </p>

        <div className="mt-auto pt-3 border-t border-neon-green/15 flex items-center justify-between">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[0.7rem] text-neon-green hover:underline flex items-center gap-1"
          >
            ◈ VIEW MAP
          </a>
          <span style={{ 
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.6rem', 
            color: '#00FF9460',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <svg width="10" height="10" viewBox="0 0 96 96" fill="none">
              <path d="M48 0C21.49 0 0 21.49 0 48s21.49 48 48 48 48-21.49 48-48S74.51 0 48 0z" fill="#00FF94"/>
              <path d="M24.9 35.1c12.7-12.7 33.4-12.7 46.2 0l1.5 1.5c.6.6.6 1.6 0 2.3l-5.2 5.2c-.3.3-.8.3-1.1 0l-2.1-2.1c-8.9-8.9-23.3-8.9-32.2 0l-2.2 2.2c-.3.3-.8.3-1.1 0l-5.2-5.2c-.6-.6-.6-1.6 0-2.3l1.4-1.6zm57 10.6l4.6 4.6c.6.6.6 1.6 0 2.3L63.7 75.4c-.6.6-1.6.6-2.3 0l-13-13c-.2-.2-.4-.2-.6 0l-13 13c-.6.6-1.6.6-2.3 0L9.7 52.6c-.6-.6-.6-1.6 0-2.3l4.6-4.6c.6-.6 1.6-.6 2.3 0l13 13c.2.2.4.2.6 0l13-13c.6-.6 1.6-.6 2.3 0l13 13c.2.2.4.2.6 0l13-13c.6-.7 1.7-.7 2.3-.1z" fill="#050A0E"/>
            </svg>
            WC PAY ENABLED
          </span>
        </div>
      </div>
    </div>
  );
}
