import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItemCard from '@/components/ItemCard';
import { fetchItems, Item, CATEGORIES } from '@/data/items';

const Items = () => {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const query = (searchParams.get('q') || '').trim().toLowerCase();
  const category = (searchParams.get('category') || '').trim();

  useEffect(() => {
    fetchItems()
      .then(data => setItems(data))
      .catch(err => {
        console.error('Fehler beim Laden der Items:', err);
      })
      .finally(() => setLoadingItems(false));
  }, []);

  const allFiltered = useMemo(() => {
    return items.filter(item => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query);

      const matchesCategory =
        !category ||
        item.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [items, query, category]);

  if (loadingItems) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        <div className="container mx-auto px-4 py-10">
          <p className="text-gray-400 font-bold animate-pulse">Lade Items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black drop-shadow-[3px_3px_0px_#000] mb-2">Item Katalog</h1>
          <p className="text-gray-400 text-sm">
            {allFiltered.length} {allFiltered.length === 1 ? 'Item gefunden' : 'Items gefunden'}
          </p>
          {query && (
            <p className="text-xs text-gray-500 mt-2">
              Suche nach: <span className="text-yellow-500 font-bold">{query}</span>
            </p>
          )}
          {category && CATEGORIES.includes(category as any) && (
            <p className="text-xs text-gray-500 mt-1">
              Kategorie: <span className="text-blue-400 font-bold">{category}</span>
            </p>
          )}
        </div>

        {allFiltered.length === 0 ? (
          <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-16 text-center">
            <p className="text-gray-500 italic">Keine Items gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allFiltered.map((item, index) => (
              <ItemCard key={`${item.id}-${index}`} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Items;