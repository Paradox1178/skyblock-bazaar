import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getPlayerFeedback, ApiFeedback, FeedbackStatus } from '@/api/client';
import { DEFAULT_ITEMS } from '@/data/items';

const STATUS_MAP: Record<FeedbackStatus, { label: string; color: string }> = {
  eingereicht: { label: 'Eingereicht', color: 'text-gray-400 bg-gray-800' },
  gesehen: { label: 'Gesehen', color: 'text-blue-400 bg-blue-900/40' },
  beantwortet: { label: 'Beantwortet', color: 'text-purple-400 bg-purple-900/40' },
  geaendert: { label: 'Geändert', color: 'text-green-400 bg-green-900/40' },
  kein_fehler: { label: 'Kein Fehler', color: 'text-orange-400 bg-orange-900/40' },
};

const MyFeedback = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState<ApiFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getPlayerFeedback(user.id)
      .then(setFeedbacks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  if (!user) {
    navigate('/');
    return null;
  }

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
              const isNew = (fb.status === 'beantwortet' || fb.status === 'geaendert' || fb.status === 'kein_fehler') && fb.admin_response;

              return (
                <div key={fb.id} className={`bg-[#2a2a2a] border-2 ${isNew ? 'border-yellow-600' : 'border-[#1e1e1e]'} p-4`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 ${s.color}`}>{s.label}</span>
                      {itemName && <span className="text-[10px] text-gray-500">📦 {itemName}</span>}
                    </div>
                    <span className="text-[10px] text-gray-500">{new Date(fb.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{fb.message}</p>
                  {fb.admin_response && (
                    <div className="p-2 bg-green-900/10 border border-green-900/30 mt-2">
                      <p className="text-[10px] font-black text-green-500 uppercase mb-1">Antwort:</p>
                      <p className="text-sm text-green-300">{fb.admin_response}</p>
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
