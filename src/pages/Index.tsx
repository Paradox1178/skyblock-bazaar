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
      {/* Hero Banner - Minecraft Grass/Dirt style */}
      <section className="relative overflow-hidden mc-stone-panel">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/30 to-transparent" />
        <div className="container mx-auto px-4 py-14 text-center relative z-10">
          <h1 className="font-pixel text-xl sm:text-2xl text-primary-foreground mb-4 drop-shadow-[2px_2px_0_rgba(0,0,0,0.6)]">
            ⛏️ CytoMarkt
          </h1>
          <p className="text-lg font-bold text-primary-foreground/90 max-w-xl mx-auto mb-6 drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">
            Finde die besten Preise & Shops für Cytooxien Skyblock
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/items')} className="mc-btn-primary text-base px-6 py-3 font-pixel text-[10px]">
              Items durchsuchen
            </button>
            <button onClick={() => navigate('/submit')} className="mc-btn text-base px-6 py-3 font-pixel text-[10px]">
              Shop eintragen
            </button>
          </div>
        </div>
      </section>

      {/* Most Traded */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="mc-section-title">Beliebteste Items 🔥</h2>
          <Link to="/items" className="mc-see-all flex items-center gap-1">
            ALLE ANZEIGEN <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {popularItems.map(item => (
            <ItemCard key={item.id} item={item} showHot />
          ))}
        </div>
      </section>

      {/* New Items */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="mc-section-title">Neue Items ✨</h2>
          <Link to="/items" className="mc-see-all flex items-center gap-1">
            ALLE ANZEIGEN <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {newItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
