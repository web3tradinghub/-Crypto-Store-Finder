"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Ticket, ArrowRight } from "lucide-react";

const IMAGES_TOP = [
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1514525253361-bee8d48700ef?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=600",
];

const IMAGES_BOTTOM = [
  "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=600",
  "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&q=80&w=600",
];

const EVENTS = [
  { date: "24.05", title: "CYBERPUNK SUMMIT", venue: "Shibuya Sky", city: "Tokyo" },
  { date: "02.06", title: "NEON NIGHTS", venue: "Printworks", city: "London" },
  { date: "15.06", title: "VOID FESTIVAL", venue: "Berghain", city: "Berlin" },
  { date: "28.06", title: "DIGITAL DREAMS", venue: "Brooklyn Mirage", city: "New York" },
  { date: "10.07", title: "CHROME SESSIONS", venue: "Zouk", city: "Singapore" },
];

export default function ParallaxSection() {
  const containerRef = useRef(null);
  const rowTopRef = useRef(null);
  const rowBottomRef = useRef(null);
  const horizontalRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax Rows
      gsap.to(rowTopRef.current, {
        x: -300,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      gsap.to(rowBottomRef.current, {
        x: 300,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });

      // Horizontal Scroll
      const totalWidth = horizontalRef.current.scrollWidth - window.innerWidth;
      gsap.to(horizontalRef.current, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: `+=${totalWidth}`,
          scrub: 1,
          pin: true,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-void overflow-hidden">
      {/* Parallax Header */}
      <div className="py-24 px-8 md:px-16">
        <p className="font-mono text-xs text-neon-cyan uppercase tracking-[0.3em] mb-4">ARCHIVE_01 // VISUALS</p>
        <h2 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">IMMERSED IN VOID</h2>
      </div>

      {/* Parallax Strips */}
      <div className="flex flex-col gap-8 pb-32">
        <div ref={rowTopRef} className="flex gap-8 whitespace-nowrap">
          {[...IMAGES_TOP, ...IMAGES_TOP].map((src, i) => (
            <div key={i} className="relative w-[400px] h-[250px] flex-shrink-0 rounded-lg overflow-hidden group">
              <img src={src} alt="Parallax" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
            </div>
          ))}
        </div>
        <div ref={rowBottomRef} className="flex gap-8 whitespace-nowrap -ml-[500px]">
          {[...IMAGES_BOTTOM, ...IMAGES_BOTTOM].map((src, i) => (
            <div key={i} className="relative w-[400px] h-[250px] flex-shrink-0 rounded-lg overflow-hidden group">
              <img src={src} alt="Parallax" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="border-y border-white/5 py-8 overflow-hidden bg-white/[0.02]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-8">
              <span className="text-2xl font-black text-white/20 uppercase tracking-tighter">TICKETS ON SALE NOW</span>
              <Ticket className="w-6 h-6 text-neon-cyan" />
              <span className="text-2xl font-black text-white/20 uppercase tracking-tighter">WORLD TOUR 2026</span>
              <ArrowRight className="w-6 h-6 text-neon-cyan" />
            </div>
          ))}
        </div>
      </div>

      {/* Horizontal Gallery */}
      <div ref={triggerRef} className="h-screen bg-void">
        <div ref={horizontalRef} className="flex items-center h-full px-[10vw] gap-12">
          <div className="flex-shrink-0 w-[400px]">
            <p className="font-mono text-xs text-neon-cyan uppercase tracking-[0.3em] mb-4">LIVE_EXP // EVENTS</p>
            <h2 className="text-6xl font-black text-white uppercase tracking-tighter leading-none">UPCOMING<br/>MISSIONS</h2>
          </div>

          {EVENTS.map((event, i) => (
            <div 
              key={i} 
              className={`relative flex-shrink-0 w-[450px] h-[300px] rounded-xl overflow-hidden group ${i % 2 !== 0 ? "mt-24" : ""}`}
            >
              {/* Index Number BG */}
              <span className="absolute -top-8 -left-4 text-9xl font-black text-white/[0.03] select-none z-0">
                {String(i + 1).padStart(2, '0')}
              </span>
              
              <div className="relative h-full w-full z-10">
                <img 
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&q=80&w=800`} 
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6">
                  <p className="font-mono text-xs text-neon-cyan glow-cyan mb-1">{event.date}</p>
                  <h4 className="text-2xl font-black text-white uppercase tracking-tighter">{event.title}</h4>
                  <p className="text-sm text-white/50 uppercase">{event.venue} // {event.city}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="flex-shrink-0 flex flex-col items-center justify-center w-[400px]">
             <button className="w-32 h-32 rounded-full border border-white/20 flex flex-col items-center justify-center gap-2 group hover:border-neon-cyan hover:bg-neon-cyan transition-all duration-300">
                <ArrowRight className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" />
                <span className="text-[10px] font-bold uppercase tracking-widest">View All</span>
             </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
