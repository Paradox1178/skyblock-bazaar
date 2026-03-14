import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, RefreshCw, XCircle, Reply } from 'lucide-react';
import { getAllFeedback, updateFeedbackStatus, ApiFeedback, FeedbackStatus } from '@/api/client';
import { DEFAULT_ITEMS } from '@/data/items';
import { toast } from 'sonner';

const STATUS_LABELS: Record<FeedbackStatus, { label: string; color: string }> = {
  eingereicht: { label: 'Eingereicht', color: 'text-gray-400 bg-gray-800' },
  gesehen: { label: 'Gesehen', color: 'text-blue-400 bg-blue-900/40' },
  beantwortet: { label: 'Beantwortet', color: 'text-purple-400 bg-purple-900/40' },
  geaendert: { label: 'Geändert', color: 'text-green-400 bg-green-900/40' },
  kein_fehler: { label: 'Kein Fehler', color: 'text-orange-400 bg-orange-900/40' },
};

const CATEGORY_LABELS: Record<string, string> = {
  falscher_preis: 'Falscher Marktwert',
  falsche_info: 'Falsche Item-Info',
  fehlender_eintrag: 'Fehlender Eintrag',
  bug: 'Bug / Fehler',
  sonstiges: 'Sonstiges',
};

const CLOSE_OPTIONS: { value: FeedbackStatus; label: string }[] = [
  { value: 'geaendert', label: 'Korrigiert' },
  { value: 'kein_fehler', label: 'Kein Fehler' },
];

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState<number | null>(null);
  const [responseText, setResponseText] = useState('');
  const [sending, setSending] = useState(false);
  const [closingId, setClosingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FeedbackStatus | 'alle'>('alle');

  const load = () => {
    setLoading(true);
    getAllFeedback()
      .then(setFeedbacks)
      .catch(() => toast.error('Feedback konnte nicht geladen werden.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleClose = async (fb: ApiFeedback, status: FeedbackStatus) => {
    setSending(true);
    try {
      await updateFeedbackStatus(fb.id, { status });
      toast.success(`Feedback als "${STATUS_LABELS[status].label}" geschlossen.`);
      setClosingId(null);
      load();
    } catch {
      toast.error('Fehler beim Schließen.');
    } finally {
      setSending(false);
    }
  };

  const handleReply = async (fb: ApiFeedback) => {
    if (!responseText.trim()) {
      toast.error('Bitte eine Antwort eingeben.');
      return;
    }
    setSending(true);
    try {
      await updateFeedbackStatus(fb.id, {
        status: 'beantwortet',
        admin_response: responseText.trim(),
      });
      toast.success('Antwort gesendet!');
      setReplyingId(null);
      setResponseText('');
      load();
    } catch {
      toast.error('Fehler beim Senden.');
    } finally {
      setSending(false);
    }
  };

  const getItemName = (id: string | null) => {
    if (!id) return null;
    return DEFAULT_ITEMS.find(i => i.id === id)?.name || id;
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    const s = STATUS_LABELS[status];
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
          {Object.entries(STATUS_LABELS).map(([value, s]) => {
            const count = feedbacks.filter(f => f.status === value).length;
            return (
              <button
                key={value}
                onClick={() => setFilter(value as FeedbackStatus)}
                className={`mc-category ${filter === value ? 'mc-category-active' : ''}`}
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

                  {/* Reply form */}
                  {replyingId === fb.id && (
                    <div className="mt-4 p-4 bg-black/20 border border-[#333] space-y-3">
                      <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                        Rückantwort an Spieler
                      </label>
                      <textarea
                        value={responseText}
                        onChange={e => setResponseText(e.target.value)}
                        placeholder="Antwort an den Spieler..."
                        rows={3}
                        maxLength={500}
                        className="mc-input bg-[#1a1a1a] w-full resize-none"
                        autoFocus
                      />
                      <div className="flex gap-3">
                        <button onClick={() => { setReplyingId(null); setResponseText(''); }} className="mc-btn flex-1">Abbrechen</button>
                        <button
                          onClick={() => handleReply(fb)}
                          disabled={sending}
                          className="mc-btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          <Send className="h-4 w-4" /> {sending ? 'Sende...' : 'Absenden'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Close sub-options */}
                  {closingId === fb.id && (
                    <div className="mt-4 p-4 bg-black/20 border border-[#333]">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Schließen als:</p>
                      <div className="flex gap-3">
                        {CLOSE_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => handleClose(fb, opt.value)}
                            disabled={sending}
                            className="mc-btn flex-1 text-sm disabled:opacity-50"
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button onClick={() => setClosingId(null)} className="mc-btn text-sm">Abbrechen</button>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  {replyingId !== fb.id && closingId !== fb.id && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => { setReplyingId(fb.id); setClosingId(null); setResponseText(fb.admin_response || ''); }}
                        className="mc-btn-primary text-xs flex items-center gap-1"
                      >
                        <Reply className="h-3 w-3" /> Rückantwort
                      </button>
                      <button
                        onClick={() => { setClosingId(fb.id); setReplyingId(null); }}
                        className="mc-btn text-xs flex items-center gap-1 text-red-400 border-red-900/50"
                      >
                        <XCircle className="h-3 w-3" /> Schließen
                      </button>
                    </div>
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
