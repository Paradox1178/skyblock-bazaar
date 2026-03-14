import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Plus, Trash2, Save, Package } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth, UserShopItem } from '@/context/AuthContext';
import { DEFAULT_ITEMS } from '@/data/items';
import TalerIcon from '@/components/TalerIcon';

const Settings = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  const [shopName, setShopName] = useState(user?.shopName || '');
  const [shopCoordinates, setShopCoordinates] = useState(user?.shopCoordinates || '');
  const [items, setItems] = useState<UserShopItem[]>(user?.shopItems || []);
  const [newItemId, setNewItemId] = useState('');
  const [newPrice, setNewPrice] = useState('');

  if (!user) return null;

  const addItem = () => {
    if (!newItemId || !newPrice) {
      toast.error('Bitte Item und Preis angeben!');
      return;
    }
    if (items.some(i => i.itemId === newItemId)) {
      toast.error('Dieses Item ist bereits in deinem Shop!');
      return;
    }
    setItems([...items, { itemId: newItemId, price: Number(newPrice) }]);
    setNewItemId('');
    setNewPrice('');
    toast.success('Item hinzugefügt!');
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(i => i.itemId !== itemId));
  };

  const saveProfile = () => {
    if (!shopName.trim()) {
      toast.error('Bitte gib deinem Shop einen Namen!');
      return;
    }
    updateProfile({
      shopName: shopName.trim(),
      shopCoordinates: shopCoordinates.trim() || undefined,
      shopItems: items,
    });
    toast.success('Profil gespeichert! Deine Angebote sind jetzt sichtbar. ⛏️');
  };

  const getItemName = (id: string) => DEFAULT_ITEMS.find(i => i.id === id)?.name || id;
  const getItemIcon = (id: string) => DEFAULT_ITEMS.find(i => i.id === id)?.icon || '';

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-10">
          <img
            src={`https://mc-heads.net/avatar/${user.username}/64`}
            alt={user.username}
            className="w-16 h-16 pixelated border-2 border-[#1e1e1e]"
          />
          <div>
            <h1 className="text-3xl font-black drop-shadow-[3px_3px_0px_#000]">{user.username}</h1>
            <p className="text-gray-500 text-xs uppercase font-bold">Dabei seit {user.joinedAt}</p>
          </div>
        </div>

        {/* Shop Settings */}
        <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 mb-8">
          <h2 className="text-xl font-black flex items-center gap-2 mb-6">
            <Store className="h-5 w-5 text-yellow-500" /> Shop Einstellungen
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Shop Name *</label>
              <input
                className="mc-input bg-[#1a1a1a]"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="z.B. DiamantKönig Shop"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Besuchbefehl</label>
              <input
                className="mc-input bg-[#1a1a1a]"
                value={shopCoordinates}
                onChange={e => setShopCoordinates(e.target.value)}
                placeholder="z.B. /visit DerOmat"
              />
            </div>
          </div>
        </div>

        {/* Shop Items */}
        <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 mb-8">
          <h2 className="text-xl font-black flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-yellow-500" /> Deine Angebote ({items.length})
          </h2>

          {/* Add Item Form */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 bg-black/20 border border-[#333]">
            <select
              className="mc-input bg-[#1a1a1a] flex-1"
              value={newItemId}
              onChange={e => setNewItemId(e.target.value)}
            >
              <option value="" disabled>Item wählen...</option>
              {DEFAULT_ITEMS
                .filter(item => !items.some(i => i.itemId === item.id))
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(item => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
            </select>
            <input
              className="mc-input bg-[#1a1a1a] w-full sm:w-32"
              type="number"
              min="0"
              value={newPrice}
              onChange={e => setNewPrice(e.target.value)}
              placeholder="Preis"
            />
            <button onClick={addItem} className="mc-btn-primary flex items-center gap-1 shrink-0">
              <Plus className="h-4 w-4" /> Hinzufügen
            </button>
          </div>

          {/* Item List */}
          {items.length > 0 ? (
            <div className="space-y-2">
              {items.map(shopItem => (
                <div
                  key={shopItem.itemId}
                  className="flex items-center justify-between p-3 bg-black/20 border border-[#333] hover:border-gray-500 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="mc-item-slot bg-[#373737] w-10 h-10 shrink-0">
                      <img src={getItemIcon(shopItem.itemId)} alt="" className="pixelated w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-white">{getItemName(shopItem.itemId)}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-500 font-bold flex items-center gap-1">
                      {shopItem.price} <TalerIcon className="w-3 h-3" />
                    </span>
                    <button
                      onClick={() => removeItem(shopItem.itemId)}
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic text-center py-4">
              Noch keine Items hinzugefügt. Füge deine Angebote oben hinzu!
            </p>
          )}
        </div>

        {/* Save / Logout */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={saveProfile} className="mc-btn-primary flex-1 py-3 font-black flex items-center justify-center gap-2">
            <Save className="h-4 w-4" /> Profil speichern
          </button>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="mc-btn py-3 font-black text-red-400 border-red-900/50"
          >
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
