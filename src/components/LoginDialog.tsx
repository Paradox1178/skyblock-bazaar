import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, LogIn } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  const { login } = useAuth();
  const [name, setName] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 3) return;
    login(name.trim());
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" onClick={onClose}>
      <div 
        className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 w-full max-w-sm mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <LogIn className="h-5 w-5 text-yellow-500" /> Anmelden
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-gray-400 text-sm mb-6">
          Gib deinen Minecraft-Namen ein, um dich anzumelden.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              Minecraft Name
            </label>
            <input
              className="mc-input bg-[#1a1a1a] w-full"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="z.B. DerOmat"
              minLength={3}
              maxLength={16}
              autoFocus
            />
          </div>

          {name.trim().length >= 3 && (
            <div className="flex items-center gap-3 p-3 bg-black/30 border border-[#333]">
              <img
                src={`https://mc-heads.net/avatar/${name.trim()}/40`}
                alt=""
                className="w-10 h-10 pixelated"
              />
              <div>
                <p className="text-white font-bold text-sm">{name.trim()}</p>
                <p className="text-gray-500 text-[10px] uppercase">Vorschau</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={name.trim().length < 3}
            className="mc-btn-primary w-full py-3 font-black disabled:opacity-50"
          >
            ⛏️ Einloggen
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginDialog;
