"use client";
import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, Environment, PerspectiveCamera, Float } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ALBUMS = [
  { title: "NEON DREAMS", subtitle: "VOL 01 // VIRTUAL REALITY", color: "#00D4FF" },
  { title: "VOID RUNNER", subtitle: "VOL 02 // DEEP SPACE", color: "#4D9FFF" },
  { title: "CHROME CITY", subtitle: "VOL 03 // METROPOLIS", color: "#9DC4FF" },
  { title: "SILICON HEART", subtitle: "VOL 04 // AI REVOLUTION", color: "#00D4FF" },
  { title: "CYBER SOUL", subtitle: "VOL 05 // DIGITAL SPIRIT", color: "#4D9FFF" },
  { title: "TECHNO FUTURE", subtitle: "VOL 06 // TOMORROW", color: "#9DC4FF" },
];

function Cube({ scrollProgress }) {
  const meshRef = useRef();
  
  // Placeholder textures - in a real app, use artist's album covers
  const textures = useTexture([
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1550684847-75bdda21cc95?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000",
  ]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = scrollProgress.current * Math.PI * 2;
      meshRef.current.rotation.y = scrollProgress.current * Math.PI * 4;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 3, 3]} />
        {textures.map((texture, i) => (
          <meshStandardMaterial key={i} attach={`material-${i}`} map={texture} roughness={0.2} metalness={0.8} />
        ))}
      </mesh>
    </Float>
  );
}

export default function AlbumSection() {
  const containerRef = useRef(null);
  const scrollProgress = useRef(0);
  const [currentAlbum, setCurrentAlbum] = useState(0);
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          const index = Math.min(Math.floor(self.progress * ALBUMS.length), ALBUMS.length - 1);
          setCurrentAlbum(index);
          
          // Calculate velocity for blur effect
          const vel = Math.abs(self.getVelocity());
          setVelocity(vel);
          
          // Reset velocity after some time
          gsap.to({ v: vel }, {
            v: 0,
            duration: 0.5,
            onUpdate: function() { setVelocity(this.targets()[0].v); }
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  const blurAmount = Math.min(velocity / 200, 8);
  const letterSpacing = Math.min(velocity / 100, 30);

  return (
    <section ref={containerRef} className="relative h-[400vh] bg-void">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background Watermark */}
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300"
          style={{ 
            filter: `blur(${blurAmount}px)`,
            letterSpacing: `${letterSpacing}px`
          }}
        >
          <h2 className="text-[20vw] font-black text-white/[0.03] whitespace-nowrap uppercase select-none">
            {ALBUMS[currentAlbum].title}
          </h2>
        </div>

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-10">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#00D4FF" />
            <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color="#4D9FFF" />
            <pointLight position={[0, 0, 5]} intensity={1} color="#00D4FF" />
            <Cube scrollProgress={scrollProgress} />
            <Environment preset="city" />
          </Canvas>
        </div>

        {/* UI Overlays */}
        <div className="absolute inset-0 z-20 p-8 md:p-16 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start">
            <div className="w-12 h-1 bg-gradient-to-r from-neon-cyan to-transparent" />
            <div className="text-right">
              <p className="font-mono text-xs text-white/40 uppercase tracking-widest">SCROLL_TO_ROTATE</p>
              <div className="flex justify-end gap-1 mt-2">
                {ALBUMS.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-4 w-[2px] transition-all duration-300 ${i === currentAlbum ? "bg-neon-cyan h-8" : "bg-white/10"}`} 
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start max-w-2xl">
            <p className="font-mono text-xs text-neon-cyan mb-2 uppercase tracking-[0.3em]">
              ALBUM {String(currentAlbum + 1).padStart(2, '0')} / {ALBUMS.length}
            </p>
            <h3 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-none mb-4">
              {ALBUMS[currentAlbum].title}
            </h3>
            <p className="text-xl md:text-2xl text-white/50 font-medium uppercase tracking-widest">
              {ALBUMS[currentAlbum].subtitle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
