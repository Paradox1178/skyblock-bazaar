import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { DEFAULT_ITEMS, CATEGORIES } from '@/data/items';

const Items = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const category = searchParams.get('category') || 'Alle';

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'Alle') {
      params.delete('category');
    } else {
      params.set('category', cat);
    }
    setSearchParams(params);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    const params = new URLSearchParams(searchParams);
    if (val) params.set('q', val);
    else params.delete('q');
    setSearchParams(params);
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="mc-section-title">
          {category !== 'Alle' ? category : 'Alle Items'} 📦
        </h1>
        <span className="text-sm text-muted-foreground">{filtered.length} Items</span>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Item suchen..."
          className="mc-input pl-10"
        />
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {['Alle', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`mc-category ${category === cat ? 'mc-category-active' : ''}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} showHot />
          ))}
        </div>
      ) : (
        <div className="mc-panel p-12 text-center">
          <p className="text-lg text-muted-foreground">Keine Items gefunden 😢</p>
          <p className="text-sm text-muted-foreground mt-1">Versuch einen anderen Suchbegriff</p>
        </div>
      )}
    </div>
  );
};

export default Items;
