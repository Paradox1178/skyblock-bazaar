import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Store, TrendingUp, ArrowRight } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';
import { DEFAULT_ITEMS, getAveragePrice, getItemShops } from '@/data/items';

const Index = () => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (val: string) => {
    setSearch(val);
    if (val.length > 0) {
      navigate(`/items?q=${encodeURIComponent(val)}`);
    }
  };

  // Top items by shop count
  const popularItems = [...DEFAULT_ITEMS]
    .sort((a, b) => getItemShops(b.id).length - getItemShops(a.id).length)
    .slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-grass/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="font-minecraft text-lg sm:text-2xl mc-text-gold mb-2 leading-relaxed">
            ⛏️ CytoMarkt
          </h1>
          <p className="font-minecraft text-[10px] sm:text-xs text-muted-foreground mb-1">
            Cytooxien Skyblock Marktplatz
          </p>
          <p className="font-minecraft-body text-lg text-muted-foreground mb-8">
            Finde die besten Preise & Shops für alle Skyblock Items
          </p>
          <SearchBar value={search} onChange={handleSearch} placeholder="🔍 Nach Items suchen..." />
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 mb-12">
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {[
            { icon: <Store className="h-5 w-5 mc-text-emerald" />, label: 'Shops', value: '12+' },
            { icon: <Search className="h-5 w-5 mc-text-diamond" />, label: 'Items', value: `${DEFAULT_ITEMS.length}` },
            { icon: <TrendingUp className="h-5 w-5 mc-text-gold" />, label: 'Preise', value: 'Live' },
          ].map(stat => (
            <div key={stat.label} className="mc-slot flex flex-col items-center gap-1 py-3">
              {stat.icon}
              <span className="font-minecraft text-xs mc-text-gold">{stat.value}</span>
              <span className="font-minecraft-body text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Items */}
      <section className="container mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-minecraft text-xs mc-text-emerald">🔥 Beliebte Items</h2>
          <button
            onClick={() => navigate('/items')}
            className="mc-button text-[10px] flex items-center gap-1"
          >
            Alle Items <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2">
          {popularItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
