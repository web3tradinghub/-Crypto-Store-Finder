"use client";
import React from "react";
import { Disc, Play, Calendar, Music, Shield, LayoutGrid, Radio, Zap, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "GRID_MAP", icon: LayoutGrid, href: "#" },
  { label: "NODES", icon: Radio, href: "#" },
  { label: "UPLINK", icon: Zap, href: "#" },
  { label: "INTEL", icon: Activity, href: "#" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="hud-glass border-white/20 rounded-none px-8 py-4 flex items-center gap-10 pointer-events-auto relative">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 border-r border-white/10 pr-10">
          <div className="w-8 h-8 bg-cyber-lime shadow-glow-lime flex items-center justify-center">
            <Shield className="w-4 h-4 text-black" />
          </div>
          <span className="font-mono text-sm tracking-[0.2em] uppercase font-black text-white">CRYPTO_GRID</span>
        </div>

        {/* Nav Items */}
        <ul className="flex items-center gap-8">
          {navItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="group flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] font-black font-mono text-white/50 hover:text-cyber-lime transition-all"
              >
                <item.icon className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* HUD Corners */}
        <div className="hud-corner hud-corner-tl !w-2 !h-2" />
        <div className="hud-corner hud-corner-tr !w-2 !h-2" />
        <div className="hud-corner hud-corner-bl !w-2 !h-2" />
        <div className="hud-corner hud-corner-br !w-2 !h-2" />
      </div>
    </nav>
  );
}
