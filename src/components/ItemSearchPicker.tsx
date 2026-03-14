import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DEFAULT_ITEMS, Item } from '@/data/items';

interface ItemSearchPickerProps {
  value: string;
  onChange: (itemId: string) => void;
  excludeIds?: string[];
  placeholder?: string;
}

const ItemSearchPicker = ({ value, onChange, excludeIds = [], placeholder = 'Item suchen...' }: ItemSearchPickerProps) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedItem = DEFAULT_ITEMS.find(i => i.id === value);

  const results = search.trim().length > 0
    ? DEFAULT_ITEMS
        .filter(i => !excludeIds.includes(i.id))
        .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 8)
    : DEFAULT_ITEMS
        .filter(i => !excludeIds.includes(i.id))
        .slice(0, 8);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const selectItem = (item: Item) => {
    onChange(item.id);
    setSearch('');
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      {selectedItem && !open ? (
        <button
          type="button"
          onClick={() => { setOpen(true); setSearch(''); }}
          className="mc-input bg-[#1a1a1a] w-full flex items-center gap-3 text-left cursor-pointer"
        >
          <div className="mc-item-slot bg-[#373737] w-8 h-8 shrink-0">
            <img src={selectedItem.icon} alt="" className="pixelated w-5 h-5" />
          </div>
          <span className="text-white font-bold text-sm">{selectedItem.name}</span>
          <span className="ml-auto text-gray-500 text-xs">Ändern</span>
        </button>
      ) : (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            className="mc-input bg-[#1a1a1a] w-full pl-9"
            value={search}
            onChange={e => { setSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            autoFocus={open}
          />
        </div>
      )}

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-50 max-h-64 overflow-y-auto">
          {results.length > 0 ? (
            results.map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => selectItem(item)}
                className="flex items-center gap-3 p-2.5 w-full text-left hover:bg-[#323232] transition-colors border-b border-black/20"
              >
                <div className="mc-item-slot bg-[#373737] w-8 h-8 shrink-0">
                  <img src={item.icon} alt="" className="pixelated w-5 h-5" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold">{item.name}</p>
                  <p className="text-[9px] text-gray-500 uppercase">{item.category}</p>
                </div>
              </button>
            ))
          ) : (
            <p className="p-4 text-gray-500 text-sm text-center italic">Kein Item gefunden</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemSearchPicker;
