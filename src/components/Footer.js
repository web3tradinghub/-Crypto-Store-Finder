"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Twitter, Youtube, Music, ArrowUpRight, Mail, Phone, MapPin, Shield } from "lucide-react";

export default function Footer() {
  const portraitRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        y: -150,
        scrollTrigger: {
          trigger: portraitRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-void border-t border-white/5">
      {/* Artist Portrait Section */}
      <section ref={portraitRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=2000" 
            alt="Artist" 
            className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void" />
        </div>

        <h2 
          ref={titleRef}
          className="relative z-10 text-[18vw] font-black text-white uppercase tracking-tighter leading-none select-none mix-blend-difference"
        >
          NEON_VOID
        </h2>

        <div className="absolute bottom-16 left-12 md:left-24 z-20">
          <p className="font-mono text-xs text-neon-cyan uppercase tracking-[0.3em] mb-2">ARTIST_PROFILE // ACTIVE</p>
          <h3 className="text-4xl font-black text-white uppercase">SAYA_K0</h3>
          <p className="text-lg text-white/40 uppercase tracking-widest">Digital Architect & Sound Sculptor</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="aspect-square overflow-hidden group border border-white/5">
            <img 
              src={`https://images.unsplash.com/photo-${1510000000000 + i * 1234567}?auto=format&fit=crop&q=80&w=400`} 
              className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
              alt="Gallery"
            />
          </div>
        ))}
      </div>

      {/* Footer Content */}
      <div className="py-24 px-8 md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-full bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan">
                <Shield size={20} />
              </div>
              <span className="text-xl font-black uppercase tracking-tighter">NEON_VOID</span>
            </div>
            <p className="text-white/40 mb-8 max-w-xs leading-relaxed">
              Decentralized sonic experiences for the post-digital era. Built in the void, broadcasted to the world.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Youtube, Music].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-neon-cyan hover:border-neon-cyan transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-white">Quick Links</h4>
            <ul className="flex flex-col gap-4">
              {['Discography', 'Tour Dates', 'Official Merch', 'Press Kit', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href="#" className="flex items-center gap-2 text-white/40 hover:text-neon-cyan transition-colors text-sm uppercase tracking-wider group">
                    {link}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-white">Transmission</h4>
            <ul className="flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <Mail size={18} className="text-neon-cyan mt-1" />
                <div>
                  <p className="text-[10px] uppercase text-white/40 mb-1">Bookings</p>
                  <p className="text-sm text-white">mgmt@neonvoid.com</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <Phone size={18} className="text-neon-cyan mt-1" />
                <div>
                  <p className="text-[10px] uppercase text-white/40 mb-1">Hotline</p>
                  <p className="text-sm text-white">+81 3-5467-XXXX</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-neon-cyan mt-1" />
                <div>
                  <p className="text-[10px] uppercase text-white/40 mb-1">Base</p>
                  <p className="text-sm text-white">Minato City, Tokyo, JP</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-white">Join the Collective</h4>
            <p className="text-sm text-white/40 mb-6">Receive encrypted updates on new drops and secret shows.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="EMAIL_ADDRESS"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-xs font-mono focus:outline-none focus:border-neon-cyan transition-colors"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-neon-cyan text-void font-bold rounded text-[10px] uppercase tracking-widest hover:bg-white transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">
            © 2026 NEON VOID COLLECTIVE // ALL RIGHTS RESERVED
          </p>
          <div className="flex gap-8">
            <a href="#" className="font-mono text-[10px] text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em]">Privacy Policy</a>
            <a href="#" className="font-mono text-[10px] text-white/20 hover:text-white transition-colors uppercase tracking-[0.2em]">Digital Rights</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
