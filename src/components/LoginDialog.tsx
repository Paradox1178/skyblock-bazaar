import { X, LogIn } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
}

const LoginDialog = ({ open, onClose }: LoginDialogProps) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 w-full max-w-md mx-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <LogIn className="h-5 w-5 text-yellow-500" />
            Anmeldung
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Schließen"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-300">
          <p>
            Die Anmeldung erfolgt über die <span className="text-yellow-500 font-bold">Minecraft-Mod</span>.
          </p>

          <div className="bg-black/20 border border-[#333] p-4 space-y-2">
            <p className="font-bold text-white">So loggst du dich ein:</p>
            <ol className="list-decimal ml-5 space-y-1 text-gray-300">
              <li>Minecraft mit installierter Mod starten</li>
              <li>Im Chat <span className="text-yellow-500 font-bold">/sblogin</span> eingeben</li>
              <li>Den erzeugten Login-Link anklicken</li>
              <li>Du wirst automatisch auf der Webseite eingeloggt</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500">
            Die Webseite fragt keinen Benutzernamen mehr direkt ab.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="mc-btn-primary px-4 py-2 font-black">
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginDialog;