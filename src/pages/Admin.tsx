import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, MessageSquare, Package, Search, Pencil, Trash2, Save, X, RefreshCw, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useItems } from '@/hooks/useItems';
import { updateItem, deleteItem, getAllFeedback } from '@/api/client';
import { CATEGORIES, RARITY_LABELS } from '@/data/items';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: allItems = [], isLoading } = useItems();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'feedback'>('overview');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Alle');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ display_name: string; category: string; rarity: string; market_price: string; icon: string }>({ display_name: '', category: '', rarity: '', market_price: '', icon: '' });
  const [saving, setSaving] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(0);

  useEffect(() => {
    getAllFeedback().then(fb => setFeedbackCount(fb.filter(f => f.status === 'eingereicht').length)).catch(() => {});
  }, []);

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="mc-panel p-8 text-center max-w-md">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Zugriff verweigert</h1>
          <p className="text-gray-400 text-sm mb-6">Du hast keine Admin-Berechtigung.</p>
          <Link to="/" className="mc-btn-primary inline-block">Zurück zur Startseite</Link>
        </div>
      </div>
    );
  }

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'Alle' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const startEdit = (item: typeof allItems[0]) => {
    setEditingId(item.dbId);
    setEditData({
      display_name: item.name,
      category: item.category,
      rarity: item.rarity,
      market_price: String(item.marketPrice || 0),
      icon: item.icon,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;
    setSaving(true);
    try {
      await updateItem(editingId, {
        display_name: editData.display_name,
        category: editData.category,
        rarity: editData.rarity,
        market_price: Number(editData.market_price),
        icon: editData.icon,
      });
      toast.success('Item gespeichert!');
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch {
      toast.error('Fehler beim Speichern.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (dbId: number, name: string) => {
    if (!confirm(`"${name}" wirklich löschen?`)) return;
    try {
      await deleteItem(dbId);
      toast.success('Item gelöscht!');
      queryClient.invalidateQueries({ queryKey: ['items'] });
    } catch {
      toast.error('Fehler beim Löschen.');
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="h-10 w-10 text-red-500" />
          <div>
            <h1 className="text-3xl font-black drop-shadow-[3px_3px_0px_#000]">Admin Panel</h1>
            <p className="text-gray-500 text-xs uppercase font-bold">Angemeldet als {user.username}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button onClick={() => setActiveTab('overview')} className={`mc-category ${activeTab === 'overview' ? 'mc-category-active' : ''}`}>
            Übersicht
          </button>
          <button onClick={() => setActiveTab('items')} className={`mc-category ${activeTab === 'items' ? 'mc-category-active' : ''}`}>
            Items ({allItems.length})
          </button>
          <button onClick={() => setActiveTab('feedback')} className={`mc-category ${activeTab === 'feedback' ? 'mc-category-active' : ''}`}>
            Feedback {feedbackCount > 0 && `(${feedbackCount} offen)`}
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-6">
              <Package className="h-8 w-8 text-yellow-500 mb-3" />
              <p className="text-3xl font-black text-white">{allItems.length}</p>
              <p className="text-gray-500 text-xs uppercase font-bold mt-1">Items in der Datenbank</p>
              <button onClick={() => setActiveTab('items')} className="mc-btn text-xs mt-4 w-full">Verwalten</button>
            </div>
            <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-6">
              <MessageSquare className="h-8 w-8 text-yellow-500 mb-3" />
              <p className="text-3xl font-black text-white">{feedbackCount}</p>
              <p className="text-gray-500 text-xs uppercase font-bold mt-1">Offene Feedback-Meldungen</p>
              <Link to="/admin/feedback" className="mc-btn text-xs mt-4 w-full block text-center">Feedback ansehen</Link>
            </div>
            <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-6">
              <Users className="h-8 w-8 text-yellow-500 mb-3" />
              <p className="text-gray-500 text-xs uppercase font-bold mt-1">Spieler-Verwaltung</p>
              <p className="text-gray-600 text-xs mt-2 italic">Kommt bald...</p>
            </div>
          </div>
        )}

        {/* Items Tab */}
        {activeTab === 'items' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Item suchen..."
                  className="mc-input pl-10"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="mc-input bg-[#1a1a1a] w-full md:w-48"
              >
                <option value="Alle">Alle Kategorien</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => queryClient.invalidateQueries({ queryKey: ['items'] })} className="mc-btn flex items-center gap-2 shrink-0">
                <RefreshCw className="h-4 w-4" /> Aktualisieren
              </button>
            </div>

            <p className="text-gray-500 text-xs mb-4">{filteredItems.length} Items angezeigt</p>

            {isLoading ? (
              <p className="text-gray-400 animate-pulse text-center py-12">Lade Items...</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredItems.slice(0, 100).map(item => (
                  <div key={item.dbId} className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-3 hover:border-gray-500 transition-colors">
                    {editingId === item.dbId ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Name</label>
                            <input className="mc-input bg-[#1a1a1a] text-sm" value={editData.display_name} onChange={e => setEditData(d => ({ ...d, display_name: e.target.value }))} />
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Kategorie</label>
                            <select className="mc-input bg-[#1a1a1a] text-sm" value={editData.category} onChange={e => setEditData(d => ({ ...d, category: e.target.value }))}>
                              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Seltenheit</label>
                            <select className="mc-input bg-[#1a1a1a] text-sm" value={editData.rarity} onChange={e => setEditData(d => ({ ...d, rarity: e.target.value }))}>
                              {Object.keys(RARITY_LABELS).map(r => <option key={r} value={r}>{RARITY_LABELS[r].text}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] text-gray-500 uppercase font-black block mb-1">Marktwert</label>
                            <input className="mc-input bg-[#1a1a1a] text-sm" type="number" value={editData.market_price} onChange={e => setEditData(d => ({ ...d, market_price: e.target.value }))} />
                          </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => setEditingId(null)} className="mc-btn text-xs flex items-center gap-1"><X className="h-3 w-3" /> Abbrechen</button>
                          <button onClick={handleSave} disabled={saving} className="mc-btn-primary text-xs flex items-center gap-1 disabled:opacity-50"><Save className="h-3 w-3" /> Speichern</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="mc-item-slot bg-[#373737] w-10 h-10 shrink-0">
                            <img src={item.icon} alt="" className="pixelated w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{item.name}</p>
                            <div className="flex gap-2 mt-0.5">
                              <span className="text-[9px] text-gray-500 uppercase">{item.category}</span>
                              <span className={`text-[9px] uppercase font-bold ${RARITY_LABELS[item.rarity]?.cls || ''}`}>{item.rarity}</span>
                              {item.isCustom && <span className="text-[9px] text-purple-400 uppercase font-bold">Custom</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-500 font-bold text-sm">{item.marketPrice} T</span>
                          <button onClick={() => startEdit(item)} className="text-blue-400 hover:text-blue-300 transition-colors p-1" title="Bearbeiten">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(item.dbId, item.name)} className="text-red-500 hover:text-red-400 transition-colors p-1" title="Löschen">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div>
            <p className="text-gray-400 mb-4">Feedback wird auf der separaten Feedback-Seite verwaltet.</p>
            <Link to="/admin/feedback" className="mc-btn-primary inline-flex items-center gap-2">
              <MessageSquare className="h-4 w-4" /> Zur Feedback Verwaltung
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
