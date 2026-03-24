import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, RefreshCw, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllFeedback, updateFeedbackStatus, ApiFeedback, FeedbackStatus, getFeedbackMessages, sendFeedbackReply, ApiFeedbackMessage } from '@/api/client';
import { useItems } from '@/hooks/useItems';
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
  const { data: allItems = [] } = useItems();
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [closingId, setClosingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FeedbackStatus | 'alle'>('alle');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, ApiFeedbackMessage[]>>({});
  const [replyText, setReplyText] = useState('');

  const load = () => {
    setLoading(true);
    getAllFeedback()
      .then(setFeedbacks)
      .catch(() => toast.error('Feedback konnte nicht geladen werden.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const loadMessages = async (feedbackId: number) => {
    try {
      const msgs = await getFeedbackMessages(feedbackId);
      setMessages(prev => ({ ...prev, [feedbackId]: msgs }));
    } catch {}
  };

  const toggleExpand = (fbId: number) => {
    if (expandedId === fbId) { setExpandedId(null); }
    else { setExpandedId(fbId); if (!messages[fbId]) loadMessages(fbId); }
    setReplyText('');
    setClosingId(null);
  };

  const handleClose = async (fb: ApiFeedback, status: FeedbackStatus) => {
    setSending(true);
    try {
      await updateFeedbackStatus(fb.id, { status });
      toast.success(`Feedback als "${STATUS_LABELS[status].label}" geschlossen.`);
      setClosingId(null);
      load();
    } catch { toast.error('Fehler beim Schließen.'); }
    finally { setSending(false); }
  };

  const handleReply = async (fbId: number) => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await sendFeedbackReply(fbId, 'admin', replyText.trim());
      toast.success('Antwort gesendet!');
      setReplyText('');
      await loadMessages(fbId);
      load();
    } catch { toast.error('Fehler beim Senden.'); }
    finally { setSending(false); }
  };

  const getItemName = (id: string | null) => {
    if (!id) return null;
    return allItems.find(i => i.id === id)?.name || id;
  };

  const getStatusBadge = (status: FeedbackStatus) => {
    const s = STATUS_LABELS[status];
    return <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${s.color}`}>{s.label}</span>;
  };

  const filtered = filter === 'alle' ? feedbacks : feedbacks.filter(f => f.status === filter);
  const isClosed = (status: FeedbackStatus) => ['geaendert', 'kein_fehler'].includes(status);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Admin Panel
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black drop-shadow-[3px_3px_0px_#000] flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-yellow-500" /> Feedback Verwaltung
          </h1>
          <button onClick={load} className="mc-btn flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Aktualisieren
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={() => setFilter('alle')} className={`mc-category ${filter === 'alle' ? 'mc-category-active' : ''}`}>
            Alle ({feedbacks.length})
          </button>
          {Object.entries(STATUS_LABELS).map(([value, s]) => {
            const count = feedbacks.filter(f => f.status === value).length;
            return (
              <button key={value} onClick={() => setFilter(value as FeedbackStatus)} className={`mc-category ${filter === value ? 'mc-category-active' : ''}`}>
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
            {filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(fb => {
              const isExpanded = expandedId === fb.id;
              const msgs = messages[fb.id] || [];
              return (
                <div key={fb.id} className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-lg">
                  <button onClick={() => toggleExpand(fb.id)} className="w-full p-5 text-left hover:bg-[#333] transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <img src={`https://mc-heads.net/avatar/${fb.player_name}/24`} alt="" className="w-6 h-6 pixelated" />
                        <span className="font-bold text-white">{fb.player_name}</span>
                        {getStatusBadge(fb.status)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 font-bold">{new Date(fb.created_at).toLocaleString('de-DE')}</span>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-yellow-900/40 text-yellow-500">
                        {CATEGORY_LABELS[fb.category] || fb.category}
                      </span>
                      {fb.item_id && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-900/40 text-blue-400">
                          📦 {getItemName(fb.item_id)}
                        </span>
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-[#333]">
                      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                        {msgs.length === 0 ? (
                          <p className="text-gray-500 text-xs italic text-center py-4">Lade Nachrichten...</p>
                        ) : msgs.map(msg => {
                          const isAdmin = msg.sender_type === 'admin';
                          return (
                            <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] px-3 py-2 text-sm ${isAdmin ? 'bg-green-900/20 border border-green-900/40 text-green-200' : 'bg-[#333] border border-[#444] text-gray-200'}`}>
                                <p className="text-[9px] font-black uppercase mb-1 opacity-60">
                                  {isAdmin ? 'Admin' : fb.player_name} · {new Date(msg.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {closingId === fb.id && (
                        <div className="p-4 border-t border-[#333] bg-black/20">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Schließen als:</p>
                          <div className="flex gap-3">
                            {CLOSE_OPTIONS.map(opt => (
                              <button key={opt.value} onClick={() => handleClose(fb, opt.value)} disabled={sending} className="mc-btn flex-1 text-sm disabled:opacity-50">{opt.label}</button>
                            ))}
                            <button onClick={() => setClosingId(null)} className="mc-btn text-sm">Abbrechen</button>
                          </div>
                        </div>
                      )}

                      {!isClosed(fb.status) && closingId !== fb.id && (
                        <div className="p-3 border-t border-[#333]">
                          <div className="flex gap-2">
                            <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Admin-Antwort schreiben..." className="mc-input bg-[#1a1a1a] flex-1 resize-none text-sm" rows={1} />
                            <button onClick={() => handleReply(fb.id)} disabled={sending || !replyText.trim()} className="px-3 bg-green-700 hover:bg-green-600 text-white font-black disabled:opacity-50 transition-colors">
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => setClosingId(fb.id)} className="mc-btn text-xs flex items-center gap-1 text-red-400 border-red-900/50">
                              <XCircle className="h-3 w-3" /> Schließen
                            </button>
                          </div>
                        </div>
                      )}

                      {isClosed(fb.status) && (
                        <div className="p-3 border-t border-[#333] text-center">
                          <p className="text-xs text-gray-500 italic">Geschlossen als „{STATUS_LABELS[fb.status].label}"</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFeedback;
