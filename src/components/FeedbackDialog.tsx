import { useState } from 'react';
import { X, MessageSquareWarning } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { submitFeedback } from '@/api/client';
import { toast } from 'sonner';
import LoginDialog from './LoginDialog';

const FEEDBACK_CATEGORIES = [
  { value: 'falscher_preis', label: 'Falscher Marktwert' },
  { value: 'falsche_info', label: 'Falsche Item-Info' },
  { value: 'fehlender_eintrag', label: 'Fehlender Eintrag' },
  { value: 'bug', label: 'Bug / Fehler' },
  { value: 'sonstiges', label: 'Sonstiges' },
];

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  itemId?: string;
  itemName?: string;
}

const FeedbackDialog = ({ open, onClose, itemId, itemName }: FeedbackDialogProps) => {
  const { user } = useAuth();
  const [category, setCategory] = useState(itemId ? 'falscher_preis' : '');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }
    if (!category) {
      toast.error('Bitte wähle eine Kategorie!');
      return;
    }
    if (!message.trim() || message.trim().length < 10) {
      toast.error('Bitte beschreibe das Problem genauer (mind. 10 Zeichen).');
      return;
    }

    setSending(true);
    try {
      await submitFeedback(user.id, {
        item_id: itemId || undefined,
        category,
        message: message.trim(),
      });
      toast.success('Feedback eingereicht! Danke für deine Meldung.');
      setMessage('');
      setCategory(itemId ? 'falscher_preis' : '');
      onClose();
    } catch {
      toast.error('Feedback konnte nicht gesendet werden.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
        <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] w-full max-w-md mx-4">
          <div className="flex items-center justify-between p-4 border-b border-black/30">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <MessageSquareWarning className="h-5 w-5 text-yellow-500" />
              Feedback / Fehler melden
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {itemName && (
              <div className="bg-black/20 border border-[#333] p-3 text-sm">
                <span className="text-gray-400">Betrifft: </span>
                <span className="text-yellow-500 font-bold">{itemName}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Kategorie *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="mc-input bg-[#1a1a1a] w-full"
              >
                <option value="">— Bitte wählen —</option>
                {FEEDBACK_CATEGORIES.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Beschreibung *
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Beschreibe den Fehler oder dein Feedback möglichst genau..."
                rows={4}
                maxLength={1000}
                className="mc-input bg-[#1a1a1a] w-full resize-none"
              />
              <p className="text-[10px] text-gray-500 mt-1 text-right">{message.length}/1000</p>
            </div>

            {!user && (
              <p className="text-xs text-yellow-500/80 italic">
                Du musst angemeldet sein, um Feedback einzureichen.
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={onClose} className="mc-btn flex-1">Abbrechen</button>
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="mc-btn-primary flex-1 disabled:opacity-50"
              >
                {sending ? 'Senden...' : 'Absenden'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default FeedbackDialog;
