"use client";
import React, { useState, useEffect, useCallback } from "react";

const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|;:,.<>?";

export default function TextDecode({ text, className, duration = 3000, delay = 500 }) {
  const [displayText, setDisplayText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const scramble = useCallback(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index];
            }
            return glyphs[Math.floor(Math.random() * glyphs.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(true);
      scramble();
    }, delay);

    return () => clearTimeout(timeout);
  }, [scramble, delay]);

  return (
    <span className={`${className} ${isAnimating ? "glow-cyan" : ""}`}>
      {displayText || text.split("").map(() => glyphs[Math.floor(Math.random() * glyphs.length)]).join("")}
    </span>
  );
}
