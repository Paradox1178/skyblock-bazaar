import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Package, FilterX, LayoutGrid } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { CATEGORIES } from '@/data/items';
import { useItems } from '@/hooks/useItems';

const ITEMS_PER_PAGE = 60;

const Items = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const category = searchParams.get('category') || 'Alle';
  const { data: allItems = [], isLoading } = useItems();

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === 'Alle') params.delete('category');
    else params.set('category', cat);
    setSearchParams(params);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    const params = new URLSearchParams(searchParams);
    if (val) params.set('q', val);
    else params.delete('q');
    setSearchParams(params);
  };

  const { filteredItems, totalCount, hasMore } = useMemo(() => {
    const allFiltered = allItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'Alle' || item.category === category;
      return matchesSearch && matchesCategory;
    });
    return {
      filteredItems: allFiltered.slice(0, ITEMS_PER_PAGE),
      totalCount: allFiltered.length,
      hasMore: allFiltered.length > ITEMS_PER_PAGE
    };
  }, [search, category, allItems]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="bg-[#2a2a2a] border-b-4 border-black shadow-[0_4px_10px_rgba(0,0,0,0.5)] mb-8">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black flex items-center gap-3 drop-shadow-[3px_3px_0px_#000]">
                <Package className="h-10 w-10 text-yellow-500" />
                {category !== 'Alle' ? category : 'Bazaar Katalog'}
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-medium flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                {isLoading ? 'Lade Items...' : `Durchsuche ${allItems.length} Minecraft Items`}
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Item suchen..."
                className="mc-input pl-12 h-12 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl pb-20">
        <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
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

        <div className="flex items-center justify-between mb-6 px-1 border-l-4 border-yellow-600 pl-4">
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-300">
            {category} <span className="text-gray-600 mx-2">/</span>
            <span className="text-yellow-500">{totalCount} Treffer</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="mc-panel flex flex-col items-center justify-center py-20 text-center">
            <p className="text-gray-400 font-bold animate-pulse">Lade Items aus der Datenbank...</p>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="mc-panel flex flex-col items-center justify-center py-20 text-center">
            <FilterX className="h-16 w-16 text-gray-700 mb-4" />
            <h3 className="text-2xl font-bold text-gray-400">Keine Items gefunden</h3>
            <p className="text-gray-600 mt-2">Versuch es mit einem anderen Namen oder Filter.</p>
            <button
              onClick={() => { setSearch(''); setCategory('Alle'); }}
              className="mt-6 mc-category"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {hasMore && (
          <div className="mt-12 p-6 bg-[#252525] border-2 border-dashed border-[#333] text-center rounded-lg">
            <p className="text-gray-500 text-sm italic">
              Zeige die ersten {ITEMS_PER_PAGE} Ergebnisse. Nutze die Suche, um gezielter zu finden.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;
