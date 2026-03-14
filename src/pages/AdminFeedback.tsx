import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, RefreshCw } from 'lucide-react';
import { getAllFeedback, updateFeedbackStatus, ApiFeedback, FeedbackStatus } from '@/api/client';
import { DEFAULT_ITEMS } from '@/data/items';
import { toast } from 'sonner';

const STATUS_OPTIONS: { value: FeedbackStatus; label: string; color: string }[] = [
  { value: 'eingereicht', label: 'Eingereicht', color: 'text-gray-400 bg-gray-800' },
  { value: 'gesehen', label: 'Gesehen', color: 'text-blue-400 bg-blue-900/40' },
  { value: 'beantwortet', label: 'Beantwortet', color: 'text-purple-400 bg-purple-900/40' },
  { value: 'geaendert', label: 'Geändert', color: 'text-green-400 bg-green-900/40' },
  { value: 'kein_fehler', label: 'Kein Fehler', color: 'text-orange-400 bg-orange-900/40' },
];

const CATEGORY_LABELS: Record<string, string> = {
  falscher_preis: 'Falscher Marktwert',
  falsche_info: 'Falsche Item-Info',
  fehlender_eintrag: 'Fehlender Eintrag',
  bug: 'Bug / Fehler',
  sonstiges: 'Sonstiges',
};

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [newStatus, setNewStatus] = useState<FeedbackStatus>('gesehen');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<FeedbackStatus | 'alle'>('alle');

  const load = () => {
    setLoading(true);
    getAllFeedback()
      .then(setFeedbacks)
      .catch(() => toast.error('Feedback konnte nicht geladen werden.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleRespond = async (fb: ApiFeedback) => {
    setSending(true);
    try {
      await updateFeedbackStatus(fb.id, {
        status: newStatus,
        admin_response: responseText.trim() || undefined,
      });
      toast.success('Status aktualisiert!');
      setSelectedId(null);
      setResponseText('');
      load();
    } catch {
      toast.error('Fehler beim Aktualisieren.');
    } finally {
      setSending(false);
    }
  };

  const getItemName = (id: string | null) => {
    if (!id) return null;
    return DEFAULT_ITEMS.find(i => i.id === id)?.name || id;
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    const s = STATUS_OPTIONS.find(o => o.value === status);
    if (!s) return null;
    return <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${s.color}`}>{s.label}</span>;
  };

  const filtered = filter === 'alle' ? feedbacks : feedbacks.filter(f => f.status === filter);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black drop-shadow-[3px_3px_0px_#000] flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-yellow-500" /> Feedback Verwaltung
          </h1>
          <button onClick={load} className="mc-btn flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Aktualisieren
          </button>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('alle')}
            className={`mc-category ${filter === 'alle' ? 'mc-category-active' : ''}`}
          >
            Alle ({feedbacks.length})
          </button>
          {STATUS_OPTIONS.map(s => {
            const count = feedbacks.filter(f => f.status === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={`mc-category ${filter === s.value ? 'mc-category-active' : ''}`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-16 text-center">
            <p className="text-gray-400 font-bold animate-pulse">Lade Feedback...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-16 text-center">
            <p className="text-gray-500 italic">Kein Feedback vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(fb => (
              <div key={fb.id} className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-lg">
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img src={`https://mc-heads.net/avatar/${fb.player_name}/24`} alt="" className="w-6 h-6 pixelated" />
                      <span className="font-bold text-white">{fb.player_name}</span>
                      {getStatusBadge(fb.status)}
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">
                      {new Date(fb.created_at).toLocaleString('de-DE')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-yellow-900/40 text-yellow-500">
                      {CATEGORY_LABELS[fb.category] || fb.category}
                    </span>
                    {fb.item_id && (
                      <Link to={`/items/${fb.item_id}`} className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-900/40 text-blue-400 hover:text-blue-300">
                        📦 {getItemName(fb.item_id)}
                      </Link>
                    )}
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed bg-black/20 p-3 border border-[#333]">
                    {fb.message}
                  </p>

                  {fb.admin_response && (
                    <div className="mt-3 p-3 bg-green-900/10 border border-green-900/30">
                      <p className="text-[10px] font-black text-green-500 uppercase mb-1">Admin-Antwort:</p>
                      <p className="text-sm text-green-300">{fb.admin_response}</p>
                    </div>
                  )}

                  {/* Respond Section */}
                  {selectedId === fb.id ? (
                    <div className="mt-4 p-4 bg-black/20 border border-[#333] space-y-3">
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                          Neuer Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value as FeedbackStatus)}
                          className="mc-input bg-[#1a1a1a] w-full"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                          Antwort (optional)
                        </label>
                        <textarea
                          value={responseText}
                          onChange={e => setResponseText(e.target.value)}
                          placeholder="Antwort an den Spieler..."
                          rows={3}
                          maxLength={500}
                          className="mc-input bg-[#1a1a1a] w-full resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setSelectedId(null)} className="mc-btn flex-1">Abbrechen</button>
                        <button
                          onClick={() => handleRespond(fb)}
                          disabled={sending}
                          className="mc-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" /> {sending ? 'Sende...' : 'Absenden'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedId(fb.id);
                        setNewStatus(fb.status === 'eingereicht' ? 'gesehen' : fb.status);
                        setResponseText(fb.admin_response || '');
                      }}
                      className="mt-3 mc-btn-primary text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="h-3 w-3" /> Bearbeiten / Antworten
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
