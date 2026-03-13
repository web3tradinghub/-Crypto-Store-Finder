'use client';
import React from 'react';

import { useEffect, useState } from "react";

export default function Hero() {
  const [lineWidth, setLineWidth] = useState("0%");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLineWidth("100%");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[700px] flex flex-col items-center justify-center overflow-hidden bg-cyber-black">
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(#00FF9415_1px,transparent_1px)] [background-size:30px_30px]" />
      <div className="absolute inset-0 z-0 bg-[linear-gradient(45deg,#00FF9408_1px,transparent_1px),linear-gradient(-45deg,#00FF9408_1px,transparent_1px)] [background-size:60px_60px]" />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 flex flex-col items-start justify-center">
        <div className="space-y-2 mb-6">
          <p className="font-mono text-[0.7rem] text-text-muted tracking-[0.3em] uppercase">
            // DECENTRALIZED_PAYMENT_NETWORK
          </p>
          <h1 className="font-mono text-[clamp(3rem,8vw,7rem)] leading-[0.9] text-text-primary flex flex-col">
            <span>FIND CRYPTO</span>
            <span className="relative inline-block">
              MERCHANTS
              <span
                className="absolute bottom-0 left-0 h-[4px] bg-neon-green transition-all duration-[800ms] ease-out"
                style={{ width: lineWidth }}
              />
            </span>
          </h1>
        </div>

        <p className="font-display font-normal text-text-muted text-lg max-w-[500px] mb-10">
          Locate real-world shops, cafes, and malls accepting Bitcoin, Ethereum, and 200+ cryptocurrencies — globally.
        </p>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-6 mt-6">
          <div>
            <div style={{color:'#00FF94', fontFamily:'monospace', fontSize:'28px', fontWeight:'900'}}>40M+</div>
            <div style={{color:'#666', fontFamily:'monospace', fontSize:'10px'}}>POS TERMINALS</div>
          </div>
          <div style={{color:'#333'}}>|</div>
          <div>
            <div style={{color:'#00FF94', fontFamily:'monospace', fontSize:'28px', fontWeight:'900'}}>120+</div>
            <div style={{color:'#666', fontFamily:'monospace', fontSize:'10px'}}>COUNTRIES</div>
          </div>
          <div style={{color:'#333'}}>|</div>
          <div>
            <div style={{color:'#00FF94', fontFamily:'monospace', fontSize:'28px', fontWeight:'900'}}>200+</div>
            <div style={{color:'#666', fontFamily:'monospace', fontSize:'10px'}}>CRYPTOCURRENCIES</div>
          </div>
        </div>

        <div style={{
          display:'flex', 
          gap:'16px', 
          flexWrap:'wrap',
          marginTop:'20px'
        }}>
          <div style={{
            border:'1px solid #00FF94',
            padding:'8px 14px',
            background:'rgba(0,255,148,0.05)',
            fontFamily:'monospace',
            fontSize:'11px'
          }}>
            <span style={{color:'#00FF94'}}>⚡ INGENICO</span>
            <span style={{color:'#aaa'}}> · 40M+ POS TERMINALS · 120+ COUNTRIES</span>
          </div>
          <div style={{
            border:'1px solid #00FF94',
            padding:'8px 14px',
            background:'rgba(0,255,148,0.05)',
            fontFamily:'monospace',
            fontSize:'11px'
          }}>
            <span style={{color:'#00FF94'}}>⚡ DTCPAY</span>
            <span style={{color:'#aaa'}}> · ONCHAIN PAYMENTS · USDC · USDT</span>
          </div>
          <div style={{
            border:'1px solid #00FF94',
            padding:'8px 14px',
            background:'rgba(0,255,148,0.05)',
            fontFamily:'monospace',
            fontSize:'11px'
          }}>
            <span style={{color:'#00FF94'}}>⚡ WALLETCONNECT PAY</span>
            <span style={{color:'#aaa'}}> · METAMASK · TRUST WALLET</span>
          </div>
          <div style={{
            border:'1px solid #00FF94',
            padding:'8px 14px',
            background:'rgba(0,255,148,0.05)',
            fontFamily:'monospace',
            fontSize:'11px',
            cursor:'pointer'
          }}>
            <span style={{color:'#00FF94'}}>⚡ +200 MORE</span>
            <span style={{color:'#aaa'}}> · PAYMENT NETWORKS · GLOBALLY</span>
          </div>
        </div>

        <div style={{
          border: '1px solid #00FF94',
          padding: '10px 16px',
          marginTop: '16px',
          background: 'rgba(0,255,148,0.05)',
          maxWidth: '580px',
          fontFamily: 'monospace'
        }}>
          <span style={{color:'#00FF94', fontSize:'10px'}}>// POWERED_BY </span>
          <span style={{color:'#ffffff', fontSize:'12px'}}>
            WalletConnect Pay × Ingenico — Stablecoin payments 
            on 40M+ POS terminals · USDC · Polygon · Base · Ethereum
          </span>
        </div>
      </div>

      {/* Decoration */}
      <div className="w-full lg:w-auto flex justify-center mt-6 lg:mt-0">
        <div className="relative lg:absolute lg:right-16 lg:top-1/2 lg:-translate-y-1/2 scale-[0.65] sm:scale-[0.85] lg:scale-100 origin-center">
          <div style={{ position: 'relative', width: '400px', height: '400px' }}>
          
          {/* Animated rotating border ring */}
          <svg
            style={{
              position: 'absolute',
              top: '-8px',
              left: '-8px',
              width: '416px',
              height: '416px',
              animation: 'spin 6s linear infinite',
            }}
            viewBox="0 0 416 416"
            fill="none"
          >
            <polygon
              points="156,4 260,4 412,156 412,260 260,412 156,412 4,260 4,156"
              stroke="url(#rotatingGradient)"
              strokeWidth="2"
              fill="none"
              strokeDasharray="20 8"
            />
            <defs>
              <linearGradient id="rotatingGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#00FF94" stopOpacity="1" />
                <stop offset="50%" stopColor="#00FF94" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#00FF94" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Second counter-rotating ring */}
          <svg
            style={{
              position: 'absolute',
              top: '-16px',
              left: '-16px',
              width: '432px',
              height: '432px',
              animation: 'spin 10s linear infinite reverse',
              opacity: 0.4,
            }}
            viewBox="0 0 432 432"
            fill="none"
          >
            <polygon
              points="162,4 270,4 428,162 428,270 270,428 162,428 4,270 4,162"
              stroke="#00FF94"
              strokeWidth="1"
              fill="none"
              strokeDasharray="4 16"
            />
          </svg>

          {/* Octagon video container */}
          <div style={{
            position: 'relative',
            width: '400px',
            height: '400px',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
            overflow: 'hidden',
            boxShadow: '0 0 60px #00FF9430',
          }}>
            <video
              src="/$wc-wcpay-animation.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Dark overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #00FF9410 0%, transparent 50%, #00FF9415 100%)',
            }} />
          </div>

          {/* Corner data nodes */}
          {[
            { top: '8px', left: '38%', label: 'PAY' },
            { bottom: '8px', left: '38%', label: 'NET' },
            { top: '38%', right: '-40px', label: 'WC' },
            { top: '38%', left: '-40px', label: 'V2' },
          ].map((node, i) => (
            <div key={i} style={{
              position: 'absolute',
              ...node,
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '0.55rem',
              color: '#00FF9480',
              letterSpacing: '0.15em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                background: '#00FF94',
                boxShadow: '0 0 8px #00FF94',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              {node.label}
            </div>
          ))}

          {/* Bottom label */}
          <div style={{
            position: 'absolute',
            bottom: '-28px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.6rem',
            color: '#00FF9060',
            letterSpacing: '0.25em',
            whiteSpace: 'nowrap',
          }}>
            // WALLETCONNECT_PAY_NETWORK
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[0.6rem] text-text-muted tracking-[0.2em] uppercase">[ SCROLL TO SEARCH ]</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-neon-green to-transparent animate-bounce" />
      </div>
    </section>
  );
}
