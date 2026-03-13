'use client';
import { useState, useEffect } from 'react';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    });

    window.addEventListener('appinstalled', () => {
      setShowInstall(false);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstall(false);
    setDeferredPrompt(null);
  };

  if (!showInstall) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50
                    bg-[#050505] border border-[#00FF94]/50 p-4 font-mono
                    shadow-[0_0_30px_#00FF94]/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[#00FF94] text-xs mb-1">// INSTALL_APP</p>
          <p className="text-white text-sm">Add CryptoFinder to your home screen</p>
          <p className="text-gray-500 text-xs mt-1">Works offline • Faster • Native feel</p>
        </div>
        <button onClick={() => setShowInstall(false)} 
                className="text-gray-600 hover:text-white text-lg">✕</button>
      </div>
      <button
        onClick={handleInstall}
        className="mt-3 w-full bg-[#00FF94] text-black font-bold text-xs py-2
                   hover:bg-transparent hover:text-[#00FF94] border border-[#00FF94] transition-all"
      >
        // INSTALL NOW →
      </button>
    </div>
  );
}
