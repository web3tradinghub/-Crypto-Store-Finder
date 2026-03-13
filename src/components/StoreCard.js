'use client';

import { CheckCircle, Star } from 'lucide-react';

const StoreCard = ({ store }) => {
  const acceptsCrypto = store.isVip || store.acceptsCrypto;

  return (
    <div className="bg-card border-2 border-primary/20 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary hover:shadow-glow relative group">
      {store.isVip && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-background p-1.5 rounded-full shadow-lg z-10 group-hover:scale-110 transition-transform">
          <Star size={14} className="fill-background" />
        </div>
      )}
      <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${store.imageUrl})` }}></div>
      <div className="p-5">
        <h3 className="text-lg font-bold tracking-wider uppercase">{store.name}</h3>
        <p className="text-primary/80 font-semibold text-xs uppercase">{store.category}</p>
        <p className="text-foreground/70 mt-2 text-sm">{store.address}</p>
        {acceptsCrypto && (
             <div className="mt-4 flex items-center gap-2 text-green-400 font-bold text-sm">
                <CheckCircle size={16} />
                <span>Accepts Crypto</span>
             </div>
        )}
      </div>
       {store.isVip && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-primary to-primary/50"></div>}
    </div>
  );
};

export default StoreCard;
