/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "neon-green": "#00FF94",
        "neon-green-dim": "#00CC77",
        "cyber-black": "#050A0E",
        "grid-dark": "#0A1628",
        "grid-mid": "#0D2137",
        "text-primary": "#E0FFE8",
        "text-muted": "#4A7A5C",
        "danger-red": "#FF2D55",
      },
      fontFamily: {
        mono: ["Share Tech Mono", "monospace"],
        display: ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 20px #00FF9440",
        "neon-strong": "0 0 40px #00FF9466",
        "neon-border": "inset 0 0 20px #00FF9415",
      },
      animation: {
        scanline: "scanline 8s linear infinite",
        flicker: "flicker 4s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%": {
            opacity: "1",
          },
          "20%, 21.999%, 63%, 63.999%, 65%, 69.999%": {
            opacity: "0.4",
          },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px #00FF9420" },
          "50%": { boxShadow: "0 0 35px #00FF9450" },
        },
      },
    },
  },
  plugins: [],
};
