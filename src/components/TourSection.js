"use client";
import React, { useState } from "react";
import { MapPin, Clock, Ticket, ExternalLink, Disc } from "lucide-react";

const TOUR_DATES = [
  { 
    id: 1,
    day: "24", month: "MAY", year: "2026", 
    city: "Tokyo", venue: "Shibuya Sky", time: "21:00",
    status: "on-sale", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: 2,
    day: "02", month: "JUN", year: "2026", 
    city: "London", venue: "Printworks", time: "22:00",
    status: "sold-out", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: 3,
    day: "15", month: "JUN", year: "2026", 
    city: "Berlin", venue: "Berghain", time: "23:59",
    status: "on-sale", image: "https://images.unsplash.com/photo-1583259585644-58041ba40a07?auto=format&fit=crop&q=80&w=800"
  },
  { 
    id: 4,
    day: "28", month: "JUN", year: "2026", 
    city: "New York", venue: "Brooklyn Mirage", time: "20:00",
    status: "coming-soon", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80&w=800"
  },
];

export default function TourSection() {
  const [hoveredEvent, setHoveredEvent] = useState(TOUR_DATES[0]);

  return (
    <section className="bg-soft-blue py-32 px-8 md:px-16 relative overflow-hidden">
      {/* Vinyl Decoration */}
      <div className="absolute -top-20 -right-20 opacity-10 animate-spin-slow pointer-events-none">
        <Disc size={400} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <p className="font-mono text-xs text-[#1F1F1F]/60 uppercase tracking-[0.3em] mb-4">LIVE_MAPPING // SCHEDULE</p>
          <h2 className="text-6xl md:text-9xl font-black text-[#1F1F1F] uppercase tracking-tighter leading-none">WORLD TOUR<br/>NEON_26</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Sticky Preview */}
          <div className="hidden lg:block lg:col-span-5 sticky top-32">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={hoveredEvent.image} 
                alt={hoveredEvent.venue} 
                className="w-full h-full object-cover transition-all duration-500 scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <h4 className="text-3xl font-black uppercase tracking-tighter">{hoveredEvent.venue}</h4>
                <p className="text-lg opacity-80 uppercase tracking-widest">{hoveredEvent.city}</p>
              </div>
            </div>
          </div>

          {/* Right: List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {TOUR_DATES.map((event) => (
              <div 
                key={event.id}
                onMouseEnter={() => setHoveredEvent(event)}
                className="group relative glass-light p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 cursor-pointer transition-all duration-300 hover:translate-x-2"
              >
                {/* Hover indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#1F1F1F] transition-all duration-300 group-hover:h-3/4" />

                <div className="flex items-center gap-8">
                  <div className="text-center min-w-[80px]">
                    <p className="text-4xl font-black text-[#1F1F1F] leading-none">{event.day}.{event.month}</p>
                    <p className="font-mono text-xs text-[#1F1F1F]/40 mt-1">{event.year}</p>
                  </div>
                  
                  <div className="border-l border-[#1F1F1F]/10 pl-8">
                    <div className="flex items-center gap-2 text-[#1F1F1F]/60 mb-1">
                      <MapPin size={14} />
                      <span className="text-xs font-bold uppercase tracking-widest">{event.city}</span>
                    </div>
                    <h4 className="text-2xl font-black text-[#1F1F1F] uppercase tracking-tighter">{event.venue}</h4>
                    <div className="flex items-center gap-2 text-[#1F1F1F]/40 mt-1">
                      <Clock size={12} />
                      <span className="text-[10px] font-mono">{event.time}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                    ${event.status === 'on-sale' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 
                      event.status === 'sold-out' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 
                      'bg-amber-500/10 text-amber-600 border border-amber-500/20'}
                  `}>
                    {event.status.replace('-', ' ')}
                  </span>
                  
                  <button className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
                    ${event.status === 'on-sale' ? 'bg-[#1F1F1F] text-white hover:bg-neon-cyan hover:text-void' : 'bg-[#1F1F1F]/5 text-[#1F1F1F]/40'}
                  `}>
                    {event.status === 'on-sale' ? <Ticket size={20} /> : <ExternalLink size={20} />}
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-12 text-center md:text-left">
              <p className="text-lg text-[#1F1F1F]/60 uppercase tracking-widest mb-6">MORE DATES BEING DECODED...</p>
              <button className="px-12 py-5 bg-[#1F1F1F] text-white font-bold rounded-full hover:bg-neon-cyan hover:text-void hover:shadow-xl transition-all duration-300 uppercase tracking-widest text-sm">
                View Full Mission Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-light {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
