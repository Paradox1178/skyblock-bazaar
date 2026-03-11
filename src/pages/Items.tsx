import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/SearchBar';
import ItemCard from '@/components/ItemCard';
import { DEFAULT_ITEMS, CATEGORIES } from '@/data/items';

const Items = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState<string>('Alle');

  const handleSearch = (val: string) => {
    setSearch(val);
    setSearchParams(val ? { q: val } : {});
  };

  const filtered = useMemo(() => {
    return DEFAULT_ITEMS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'Alle' || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-minecraft text-sm mc-text-gold mb-6 text-center">📦 Item Katalog</h1>

      <SearchBar value={search} onChange={handleSearch} />

      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 justify-center mt-6 mb-8">
        {['Alle', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`mc-button text-[9px] ${category === cat ? 'mc-text-gold' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mc-panel p-8 text-center">
          <p className="font-minecraft text-xs text-muted-foreground">Keine Items gefunden 😢</p>
        </div>
      )}
    </div>
  );
};

export default Items;
