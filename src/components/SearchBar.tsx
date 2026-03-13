"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, onClear, isLoading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  return (
    <div className="w-full max-w-[700px] mx-auto">
      <div className="mb-2">
        <label className="font-mono text-[0.7rem] text-text-muted tracking-wider uppercase">
          // ENTER_TARGET_LOCATION
        </label>
      </div>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="relative flex items-center">
          {/* Left Icon */}
          <span className="absolute left-4 text-neon-green font-mono">◈</span>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search city, country, or region..."
            disabled={isLoading}
            className="w-full bg-grid-dark border border-neon-green/40 px-10 py-4 text-text-primary font-mono placeholder:text-[#2A4A3C] outline-none transition-all duration-200 focus:border-neon-green focus:shadow-[0_0_25px_#00FF9430] disabled:opacity-50"
          />

          {/* Right Side Actions */}
          <div className="absolute right-2 flex items-center gap-4">
            {inputValue && !isLoading && (
              <button
                type="button"
                onClick={handleClear}
                className="font-mono text-[0.7rem] text-neon-green hover:glow-text transition-all"
              >
                ✕ CLEAR
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-neon-green text-cyber-black px-6 py-2 font-mono font-bold text-sm transition-all duration-200 hover:bg-neon-green-dim hover:shadow-[0_0_20px_#00FF9460] disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-1">
                  SCANNING<span className="animate-pulse">...</span>
                </span>
              ) : (
                "SCAN GRID"
              )}
            </button>
          </div>
        </div>

        {/* Progress Bar (Loading Only) */}
        {isLoading && (
          <div className="absolute -bottom-[2px] left-0 w-full h-[2px] bg-neon-green/10 overflow-hidden">
            <div className="h-full bg-neon-green w-1/3 animate-[scanline_2s_linear_infinite]" />
          </div>
        )}
      </form>
    </div>
  );
}
