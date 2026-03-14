import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Store, Info } from 'lucide-react';
import { DEFAULT_ITEMS, addShop } from '@/data/items';
import ItemSearchPicker from '@/components/ItemSearchPicker';

const SubmitShop = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shopName: '',
    ownerName: '',
    itemId: '',
    price: '',
    coordinates: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.shopName || !form.ownerName || !form.itemId || !form.price) {
      toast.error('Bitte fülle alle Pflichtfelder aus!');
      return;
    }
    addShop({
      shopName: form.shopName,
      ownerName: form.ownerName,
      itemId: form.itemId,
      price: Number(form.price),
      coordinates: form.coordinates || undefined,
      description: form.description || undefined,
    });
    toast.success('Shop erfolgreich eingetragen! ⛏️');
    navigate(`/items/${form.itemId}`);
  };

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const selectedItem = DEFAULT_ITEMS.find(i => i.id === form.itemId);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-xl text-left">
        <Link to="/items" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Katalog
        </Link>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black flex items-center justify-center md:justify-start gap-4 drop-shadow-[3px_3px_0px_#000]">
            <Store className="h-10 w-10 text-yellow-500" /> Shop eintragen
          </h1>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-2 border-l-4 border-yellow-600 pl-3">
            Teile deinen Shop mit der Cytooxien Community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 space-y-6">
          {/* Item Preview */}
          <div className="flex flex-col items-center justify-center py-4 bg-black/20 border-2 border-dashed border-[#444] mb-4">
            {selectedItem ? (
              <div className="flex flex-col items-center gap-3">
                <div className="mc-item-slot bg-[#373737] w-16 h-16">
                  <img src={selectedItem.icon} alt={selectedItem.name} className="pixelated w-10 h-10" />
                </div>
                <span className="text-yellow-500 font-bold text-sm uppercase tracking-tighter italic">Ausgewählt: {selectedItem.name}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-500">
                <div className="mc-item-slot bg-[#1e1e1e] border-[#333] opacity-50">
                  <Info className="h-6 w-6" />
                </div>
                <span className="text-xs uppercase font-black">Kein Item gewählt</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shop Name *</label>
              <input className="mc-input bg-[#1a1a1a]" value={form.shopName} onChange={e => update('shopName', e.target.value)} placeholder="z.B. DiamantKönig" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Spielername *</label>
              <input className="mc-input bg-[#1a1a1a]" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="Dein Ingame-Name" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Item Auswählen *</label>
            <ItemSearchPicker
              value={form.itemId}
              onChange={(id) => update('itemId', id)}
              placeholder="Item suchen..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Preis pro Stück *</label>
              <input className="mc-input bg-[#1a1a1a]" type="number" min="0" value={form.price} onChange={e => update('price', e.target.value)} placeholder="z.B. 500" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Besuchbefehl</label>
              <input className="mc-input bg-[#1a1a1a]" value={form.coordinates} onChange={e => update('coordinates', e.target.value)} placeholder="z.B. /visit DevDave" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Zusatzinfos</label>
            <textarea className="mc-input bg-[#1a1a1a] min-h-[100px] resize-none" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Welche Kiste? Welcher Stock?" />
          </div>

          <button type="submit" className="mc-category-active w-full py-4 text-lg font-black transition-transform active:scale-95 shadow-[4px_4px_0px_#1a3a1a]">
            ✅ SHOP JETZT EINTRAGEN
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-[10px] uppercase font-bold tracking-tighter">
          * Pflichtfelder müssen ausgefüllt werden
        </p>
      </div>
    </div>
  );
};

export default SubmitShop;
