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

  const fieldClass = "w-full px-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary";

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="section-title text-center mb-2">Shop eintragen 🏪</h1>
      <p className="text-muted-foreground text-center text-sm mb-8">
        Teile deinen Shop mit der Cytooxien Skyblock Community
      </p>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm font-bold text-foreground mb-1.5">Shop Name *</label>
          <input className={fieldClass} value={form.shopName} onChange={e => update('shopName', e.target.value)} placeholder="z.B. DiamantKönig Shop" />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1.5">Spielername *</label>
          <input className={fieldClass} value={form.ownerName} onChange={e => update('ownerName', e.target.value)} placeholder="Dein Minecraft Name" />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1.5">Item *</label>
          <select className={fieldClass} value={form.itemId} onChange={e => update('itemId', e.target.value)}>
            <option value="">Item auswählen...</option>
            {DEFAULT_ITEMS.sort((a, b) => a.name.localeCompare(b.name)).map(item => (
              <option key={item.id} value={item.id}>{item.icon} {item.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1.5">Preis (pro Stück) *</label>
          <input className={fieldClass} type="number" min="0" value={form.price} onChange={e => update('price', e.target.value)} placeholder="z.B. 500" />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1.5">Warp / Koordinaten</label>
          <input className={fieldClass} value={form.coordinates} onChange={e => update('coordinates', e.target.value)} placeholder="z.B. /is warp MeinShop" />
        </div>

        <div>
          <label className="block text-sm font-bold text-foreground mb-1.5">Beschreibung</label>
          <textarea className={`${fieldClass} min-h-[80px] resize-y`} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Weitere Infos zum Shop..." />
        </div>

        <button type="submit" className="btn-accent w-full py-3 text-base">
          ✅ Shop eintragen
        </button>
      </form>
    </div>
  );
};

export default SubmitShop;
