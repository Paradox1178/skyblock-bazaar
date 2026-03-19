import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    const run = async () => {
      await refreshAuth();
      setTimeout(() => {
        navigate('/settings');
      }, 1200);
    };

    run();
  }, [refreshAuth, navigate]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center px-4">
      <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 max-w-md w-full text-center">
        <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-black mb-3">Anmeldung erfolgreich</h1>
        <p className="text-gray-300 text-sm">
          Deine Browser-Session wurde erstellt. Du wirst jetzt weitergeleitet.
        </p>
      </div>
    </div>
  );
};

export default AuthSuccess;