import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DEFAULT_ITEMS, addShop } from '@/data/items';

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="font-minecraft text-sm mc-text-gold mb-6 text-center">🏪 Shop einreichen</h1>

      <form onSubmit={handleSubmit} className="mc-panel p-6 space-y-4">
        <div>
          <label className="font-minecraft text-[9px] text-muted-foreground block mb-1">Shop Name *</label>
          <input className="mc-input" value={form.shopName} onChange={e => update('shopName', e.target.value)} placeholder="z.B. DiamantKönig Shop" />
        </div>

        <div>
          <label className="font-minecraft text-[9px] text-muted-foreground block mb-1">Spielername *</label>
          <input className="mc-input" value={form.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="Dein Minecraft Name" />
        </div>

        <div>
          <label className="font-minecraft text-[9px] text-muted-foreground block mb-1">Item *</label>
          <select
            className="mc-input"
            value={form.itemId}
            onChange={e => update('itemId', e.target.value)}
          >
            <option value="">Item auswählen...</option>
            {DEFAULT_ITEMS.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
              <option key={item.id} value={item.id}>{item.icon} {item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-minecraft text-[9px] text-muted-foreground block mb-1">Preis (pro Stück) *</label>
          <input className="mc-input" type="number" min="0" value={form.price} onChange={e => update('price', e.target.value)} placeholder="z.B. 500" />
        </div>

        <div>
          <label className="font-minecraft text-[9px] text-muted-foreground block mb-1">Warp / Koordinaten</label>
          <input className="mc-input" value={form.coordinates} onChange={e => update('coordinates', e.target.value)} placeholder="z.B. /is warp MeinShop" />
        </div>

        <div>
          <label className="font-minecraft text-[9px] text-muted-foreground block mb-1">Beschreibung</label>
          <textarea className="mc-input min-h-[60px] resize-y" value={form.description} onChange={e => update('description', e.target.value)} placeholder="Weitere Infos..." />
        </div>

        <button type="submit" className="mc-button-primary w-full text-[10px] py-3">
          ✅ Shop eintragen
        </button>
      </form>
    </div>
  );
};

export default SubmitShop;
