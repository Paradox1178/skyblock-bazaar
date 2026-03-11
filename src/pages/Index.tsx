import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { DEFAULT_ITEMS, getItemShops } from '@/data/items';

const Index = () => {
  const navigate = useNavigate();

  const popularItems = [...DEFAULT_ITEMS]
    .sort((a, b) => getItemShops(b.id).length - getItemShops(a.id).length)
    .slice(0, 8);

  const newItems = [...DEFAULT_ITEMS].slice(-8).reverse();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">
            Cytooxien Skyblock <span className="text-primary">Marktplatz</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-6">
            Finde die besten Preise, vergleiche Shops und trage dein eigenes Angebot ein — alles für Skyblock auf Cytooxien.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/items')} className="btn-accent text-base px-6 py-3">
              Items durchsuchen
            </button>
            <button onClick={() => navigate('/submit')} className="px-6 py-3 rounded-lg font-bold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
              Shop eintragen
            </button>
          </div>
        </div>
        {/* Decorative blocks */}
        <div className="absolute top-4 left-8 text-5xl opacity-10 rotate-12">⛏️</div>
        <div className="absolute bottom-4 right-12 text-6xl opacity-10 -rotate-12">💎</div>
        <div className="absolute top-12 right-1/4 text-4xl opacity-10">🏗️</div>
      </section>

      {/* Most Traded / Popular */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Beliebteste Items 🔥</h2>
          <Link to="/items" className="see-all flex items-center gap-1">
            ALLE ANZEIGEN <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {popularItems.map(item => (
            <ItemCard key={item.id} item={item} showHot />
          ))}
        </div>
      </section>

      {/* New Items */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="section-title">Neue Items ✨</h2>
          <Link to="/items" className="see-all flex items-center gap-1">
            ALLE ANZEIGEN <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {newItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
