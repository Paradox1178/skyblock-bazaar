import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Plus, Trash2, Save, Package, Pencil, Check, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth, UserShopItem } from '@/context/AuthContext';
import { DEFAULT_ITEMS } from '@/data/items';
import { getPlayerFeedback, ApiFeedback, FeedbackStatus } from '@/api/client';
import TalerIcon from '@/components/TalerIcon';
import ItemSearchPicker from '@/components/ItemSearchPicker';

const Settings = () => {
  const { user, updateProfile, addItem, removeItem, updateItemPrice, logout } = useAuth();
  const navigate = useNavigate();

  const [shopName, setShopName] = useState(user?.shopName || '');
  const [shopCoordinates, setShopCoordinates] = useState(user?.shopCoordinates || '');
  const [newItemId, setNewItemId] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  const items = user.shopItems;

  const handleAddItem = async () => {
    if (!newItemId || !newPrice) {
      toast.error('Bitte Item und Preis angeben!');
      return;
    }
    if (items.some(i => i.itemId === newItemId)) {
      toast.error('Dieses Item ist bereits in deinem Shop!');
      return;
    }
    await addItem(newItemId, Number(newPrice));
    setNewItemId('');
    setNewPrice('');
    toast.success('Item hinzugefügt!');
  };

  const handleRemoveItem = async (itemId: string) => {
    await removeItem(itemId);
    toast.success('Item entfernt!');
  };

  const startEdit = (shopItem: UserShopItem) => {
    setEditingItemId(shopItem.itemId);
    setEditPrice(String(shopItem.price));
  };

  const saveEdit = async () => {
    if (!editingItemId || !editPrice) return;
    await updateItemPrice(editingItemId, Number(editPrice));
    setEditingItemId(null);
    setEditPrice('');
    toast.success('Preis aktualisiert!');
  };

  const cancelEdit = () => {
    setEditingItemId(null);
    setEditPrice('');
  };

  const saveProfile = async () => {
    if (!shopName.trim()) {
      toast.error('Bitte gib deinem Shop einen Namen!');
      return;
    }
    setSaving(true);
    await updateProfile({
      shopName: shopName.trim(),
      shopCoordinates: shopCoordinates.trim() || undefined,
    });
    setSaving(false);
    toast.success('Profil gespeichert! ⛏️');
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
              <input className="mc-input bg-[#1a1a1a]" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="z.B. DiamantKönig Shop" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Besuchbefehl</label>
              <input className="mc-input bg-[#1a1a1a]" value={shopCoordinates} onChange={e => setShopCoordinates(e.target.value)} placeholder="z.B. /visit DerOmat" />
            </div>
          </div>
        </div>

        {/* Shop Items */}
        <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 mb-8">
          <h2 className="text-xl font-black flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-yellow-500" /> Deine Angebote ({items.length})
          </h2>

          <div className="flex flex-col gap-3 mb-6 p-4 bg-black/20 border border-[#333]">
            <ItemSearchPicker
              value={newItemId}
              onChange={setNewItemId}
              excludeIds={items.map(i => i.itemId)}
              placeholder="Item suchen und auswählen..."
            />
            <div className="flex gap-3">
              <input
                className="mc-input bg-[#1a1a1a] flex-1"
                type="number"
                min="0"
                value={newPrice}
                onChange={e => setNewPrice(e.target.value)}
                placeholder="Preis in Taler"
              />
              <button onClick={handleAddItem} className="mc-btn-primary flex items-center gap-1 shrink-0">
                <Plus className="h-4 w-4" /> Hinzufügen
              </button>
            </div>
          </div>

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

                  {editingItemId === shopItem.itemId ? (
                    <div className="flex items-center gap-2">
                      <input
                        className="mc-input bg-[#1a1a1a] w-24 text-center py-1"
                        type="number"
                        min="0"
                        value={editPrice}
                        onChange={e => setEditPrice(e.target.value)}
                        autoFocus
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                      />
                      <button onClick={saveEdit} className="text-green-400 hover:text-green-300 transition-colors">
                        <Check className="h-4 w-4" />
                      </button>
                      <button onClick={cancelEdit} className="text-gray-400 hover:text-white transition-colors">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-yellow-500 font-bold flex items-center gap-1">
                        {shopItem.price} <TalerIcon className="w-3 h-3" />
                      </span>
                      <button onClick={() => startEdit(shopItem)} className="text-blue-400 hover:text-blue-300 transition-colors" title="Preis bearbeiten">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleRemoveItem(shopItem.itemId)} className="text-red-500 hover:text-red-400 transition-colors" title="Entfernen">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
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
          <button onClick={saveProfile} disabled={saving} className="mc-btn-primary flex-1 py-3 font-black flex items-center justify-center gap-2 disabled:opacity-50">
            <Save className="h-4 w-4" /> {saving ? 'Speichern...' : 'Profil speichern'}
          </button>
          <button onClick={() => { logout(); navigate('/'); }} className="mc-btn py-3 font-black text-red-400 border-red-900/50">
            Abmelden
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
