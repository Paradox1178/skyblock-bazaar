import { useState, useEffect } from 'react';
import { ScrollText, Plus, Clock, MessageCircle, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getAllRequests, createRequest, deleteRequest, ApiRequest } from '@/api/client';
import { toast } from 'sonner';
import LoginDialog from '@/components/LoginDialog';

const Requests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ApiRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    getAllRequests()
      .then(setRequests)
      .catch(() => toast.error('Ersuchen konnten nicht geladen werden.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title.trim() || !description.trim()) {
      toast.error('Bitte fülle alle Felder aus.');
      return;
    }
    setSubmitting(true);
    try {
      await createRequest(user.id, { title: title.trim(), description: description.trim() });
      toast.success('Ersuchen erstellt!');
      setTitle('');
      setDescription('');
      setShowForm(false);
      fetchRequests();
    } catch {
      toast.error('Ersuchen konnte nicht erstellt werden.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRequest(id);
      toast.success('Ersuchen gelöscht.');
      setRequests(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error('Ersuchen konnte nicht gelöscht werden.');
    }
  };

  const getRemainingTime = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Abgelaufen';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    if (days > 0) return `${days}T ${hours}h übrig`;
    return `${hours}h übrig`;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ScrollText className="h-7 w-7 text-yellow-500" />
          <h1 className="font-pixel text-lg text-foreground drop-shadow-[1px_1px_0_rgba(0,0,0,0.3)]">
            Ersuchen
          </h1>
        </div>
        <button
          onClick={() => user ? setShowForm(!showForm) : setShowLogin(true)}
          className="mc-btn-primary flex items-center gap-2 text-sm"
        >
          <Plus className="h-4 w-4" />
          Neues Ersuchen
        </button>
      </div>

      <p className="text-muted-foreground text-sm mb-6">
        Du suchst ein bestimmtes Item? Stelle hier ein Ersuchen ein – andere Spieler können dich dann auf 
        <strong className="text-foreground"> Cytooxien Skyblock</strong> kontaktieren. Ersuchen sind <strong className="text-foreground">7 Tage</strong> gültig.
      </p>

      {showForm && user && (
        <form onSubmit={handleSubmit} className="mc-panel p-4 mb-6 space-y-3">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Was suchst du?</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z.B. 64x Diamanten, Netherite Schwert, ..."
              maxLength={100}
              className="mc-input w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Details / Preisvorstellung</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Beschreibe genauer, was du suchst und was du bereit bist zu zahlen..."
              maxLength={500}
              rows={3}
              className="mc-input w-full resize-none"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" onClick={() => setShowForm(false)} className="mc-btn text-sm">
              Abbrechen
            </button>
            <button type="submit" disabled={submitting} className="mc-btn-primary text-sm">
              {submitting ? 'Wird erstellt...' : 'Ersuchen aufgeben'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Lade Ersuchen...</div>
      ) : requests.length === 0 ? (
        <div className="mc-panel p-8 text-center">
          <ScrollText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <p className="text-muted-foreground font-bold">Keine Ersuchen vorhanden</p>
          <p className="text-muted-foreground text-sm mt-1">Sei der Erste und stelle ein Ersuchen ein!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <div key={req.id} className="mc-panel p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={`https://mc-heads.net/avatar/${req.player_name}/32`}
                    alt={req.player_name}
                    className="w-8 h-8 pixelated shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-foreground text-sm truncate">{req.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      von <span className="font-bold text-yellow-600">{req.player_name}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {getRemainingTime(req.expires_at)}
                  </span>
                  {user && user.id === req.player_id && (
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                      title="Ersuchen löschen"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-foreground/80 mt-2 whitespace-pre-line">{req.description}</p>

              <div className="mt-3 flex items-center gap-2 bg-[hsl(var(--mc-dirt))]/30 border border-border rounded px-3 py-2">
                <MessageCircle className="h-4 w-4 text-yellow-500 shrink-0" />
                <p className="text-xs text-muted-foreground">
                  Kontaktiere <strong className="text-yellow-600">{req.player_name}</strong> auf Cytooxien Skyblock mit{' '}
                  <code className="bg-black/30 px-1.5 py-0.5 rounded text-yellow-500 font-mono">
                    /msg {req.player_name}
                  </code>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default Requests;
