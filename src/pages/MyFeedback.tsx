import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPlayerFeedback, ApiFeedback, FeedbackStatus, getFeedbackMessages, sendFeedbackReply, ApiFeedbackMessage } from '@/api/client';
import { DEFAULT_ITEMS } from '@/data/items';
import { Textarea } from '@/components/ui/textarea';

const STATUS_MAP: Record<FeedbackStatus, { label: string; color: string }> = {
  eingereicht: { label: 'Eingereicht', color: 'text-gray-400 bg-gray-800' },
  gesehen: { label: 'Gesehen', color: 'text-blue-400 bg-blue-900/40' },
  beantwortet: { label: 'Beantwortet', color: 'text-purple-400 bg-purple-900/40' },
  geaendert: { label: 'Geändert', color: 'text-green-400 bg-green-900/40' },
  kein_fehler: { label: 'Kein Fehler', color: 'text-orange-400 bg-orange-900/40' },
};

const CLOSED_STATUSES: FeedbackStatus[] = ['geaendert', 'kein_fehler'];

const MyFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Record<number, ApiFeedbackMessage[]>>({});
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);

  const loadFeedbacks = () => {
    if (!user) return;
    setLoading(true);
    getPlayerFeedback(user.id)
      .then(setFeedbacks)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadFeedbacks();
  }, [user?.id]);

  const loadMessages = async (feedbackId: number) => {
    try {
      const msgs = await getFeedbackMessages(feedbackId);
      setMessages(prev => ({ ...prev, [feedbackId]: msgs }));
    } catch {}
  };

  const toggleExpand = (fbId: number) => {
    if (expandedId === fbId) {
      setExpandedId(null);
    } else {
      setExpandedId(fbId);
      if (!messages[fbId]) loadMessages(fbId);
    }
    setReplyText('');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  const handleReply = async (feedbackId: number) => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    try {
      await sendFeedbackReply(feedbackId, 'player', replyText.trim(), user.id);
      setReplyText('');
      await loadMessages(feedbackId);
      loadFeedbacks();
    } catch {}
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>

        <h1 className="text-3xl font-black drop-shadow-[3px_3px_0px_#000] flex items-center gap-3 mb-8">
          <MessageSquare className="h-8 w-8 text-yellow-500" /> Meine Meldungen ({feedbacks.length})
        </h1>

        {loading ? (
          <p className="text-gray-400 animate-pulse text-sm">Lade...</p>
        ) : feedbacks.length === 0 ? (
          <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] p-16 text-center">
            <p className="text-gray-500 text-sm italic">Du hast noch kein Feedback eingereicht.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feedbacks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(fb => {
              const s = STATUS_MAP[fb.status];
              const itemName = fb.item_id ? (DEFAULT_ITEMS.find(i => i.id === fb.item_id)?.name || fb.item_id) : null;
              const isExpanded = expandedId === fb.id;
              const isClosed = CLOSED_STATUSES.includes(fb.status);
              const msgs = messages[fb.id] || [];

              return (
                <div key={fb.id} className={`bg-[#2a2a2a] border-2 ${fb.status === 'beantwortet' ? 'border-yellow-600' : 'border-[#1e1e1e]'}`}>
                  {/* Header */}
                  <button
                    onClick={() => toggleExpand(fb.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-[#333] transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${s.color}`}>{s.label}</span>
                      {itemName && <span className="text-[10px] text-gray-500">📦 {itemName}</span>}
                      <span className="text-xs text-gray-400 truncate max-w-[200px]">{fb.message?.split('\n')[0]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{new Date(fb.created_at).toLocaleDateString('de-DE')}</span>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                    </div>
                  </button>

                  {/* Chat view */}
                  {isExpanded && (
                    <div className="border-t border-[#333]">
                      <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                        {msgs.length === 0 ? (
                          <p className="text-gray-500 text-xs italic text-center py-4">Lade Nachrichten...</p>
                        ) : (
                          msgs.map(msg => {
                            const isPlayer = msg.sender_type === 'player';
                            return (
                              <div key={msg.id} className={`flex ${isPlayer ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-3 py-2 text-sm ${
                                  isPlayer
                                    ? 'bg-yellow-900/30 border border-yellow-800/50 text-yellow-100'
                                    : 'bg-green-900/20 border border-green-900/40 text-green-200'
                                }`}>
                                  <p className="text-[9px] font-black uppercase mb-1 opacity-60">
                                    {isPlayer ? 'Du' : 'Admin'} · {new Date(msg.created_at).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                  <p className="whitespace-pre-wrap">{msg.message}</p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Reply input */}
                      {!isClosed && (
                        <div className="p-3 border-t border-[#333] flex gap-2">
                          <Textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Antwort schreiben..."
                            className="bg-[#1e1e1e] border-[#444] text-white text-sm min-h-[40px] flex-1 resize-none"
                            rows={1}
                          />
                          <button
                            onClick={() => handleReply(fb.id)}
                            disabled={sending || !replyText.trim()}
                            className="px-3 bg-yellow-600 hover:bg-yellow-500 text-black font-black disabled:opacity-50 transition-colors self-end"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {isClosed && (
                        <div className="p-3 border-t border-[#333] text-center">
                          <p className="text-xs text-gray-500 italic">Diese Meldung wurde geschlossen.</p>
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

export default MyFeedback;
