"use client";

import { useState } from "react";
import { MessageSquare, X, Bot, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AIChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-mono">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-80 sm:w-96 hud-glass border-cyber-purple/50 shadow-glow-purple flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-3 border-b border-cyber-purple/30 bg-cyber-purple/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyber-purple animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-cyber-purple glow-text-purple">
                System Intelligence
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-cyber-purple/70 hover:text-cyber-purple transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-black/60">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-cyber-purple/50 uppercase">[System]</span>
              <div className="p-2 bg-cyber-purple/5 border border-cyber-purple/20 text-xs text-cyber-purple/90 leading-relaxed">
                Welcome, Operator. I am your neural link to the crypto-mercantile grid. How can I assist your search?
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-cyber-purple/30 bg-black/40">
            <div className="relative flex items-center">
              <input 
                type="text"
                placeholder="INPUT COMMAND..."
                className="w-full bg-black/50 border border-cyber-purple/30 p-2 pl-3 pr-10 text-[10px] text-cyber-purple focus:outline-none focus:border-cyber-purple shadow-inner uppercase tracking-wider placeholder:text-cyber-purple/30"
              />
              <button className="absolute right-2 text-cyber-purple hover:text-cyber-lime transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* HUD Corners */}
          <div className="hud-corner hud-corner-tl !border-cyber-purple" />
          <div className="hud-corner hud-corner-tr !border-cyber-purple" />
          <div className="hud-corner hud-corner-bl !border-cyber-purple" />
          <div className="hud-corner hud-corner-br !border-cyber-purple" />
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 flex items-center justify-center transition-all duration-300 shadow-glow-lime group",
          isOpen ? "bg-cyber-purple rotate-90" : "bg-cyber-lime"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-black" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyber-red animate-ping" />
          </div>
        )}
        
        {/* Button Corners */}
        <div className={cn("hud-corner hud-corner-tl !w-2 !h-2", isOpen ? "!border-white" : "!border-black")} />
        <div className={cn("hud-corner hud-corner-br !w-2 !h-2", isOpen ? "!border-white" : "!border-black")} />
      </button>
    </div>
  );
}
