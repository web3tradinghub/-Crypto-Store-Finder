"use client";

import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export default function Tooltip({ text, children }: TooltipProps) {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center" 
      onMouseEnter={() => setTooltipVisible(true)} 
      onMouseLeave={() => setTooltipVisible(false)}
    >
      {children}
      {isTooltipVisible && (
        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-cyber-lime text-black text-xs font-bold px-3 py-1.5 rounded-md shadow-lg z-20">
          {text}
        </div>
      )}
    </div>
  );
}
