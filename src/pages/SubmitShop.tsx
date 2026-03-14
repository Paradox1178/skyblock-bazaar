import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Store, Info } from 'lucide-react';
import { DEFAULT_ITEMS } from '@/data/items';
import ItemSearchPicker from '@/components/ItemSearchPicker';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';

const SubmitShop = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [itemId, setItemId] = useState('');

  const selectedItem = DEFAULT_ITEMS.find(i => i.id === itemId);

  const handleSubmit = () => {
    if (!user) {
      toast.error('Bitte melde dich zuerst an!');
      return;
    }
    if (!user.shopName) {
      toast.info('Richte zuerst deinen Shop in den Einstellungen ein!');
      navigate('/settings');
      return;
    }
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white pb-20">
      <div className="container mx-auto px-4 py-8 max-w-xl text-left">
        <Link to="/items" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zurück zum Katalog
        </Link>

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-black flex items-center justify-center md:justify-start gap-4 drop-shadow-[3px_3px_0px_#000]">
            <Store className="h-10 w-10 text-yellow-500" /> Shop eintragen
          </h1>
          <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-2 border-l-4 border-yellow-600 pl-3">
            Teile deinen Shop mit der Cytooxien Community
          </p>
        </div>

        <div className="bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[inset_3px_3px_0px_#3c3c3c] p-8 space-y-6">
          <div className="flex flex-col items-center justify-center py-6 bg-black/20 border-2 border-dashed border-[#444]">
            <Info className="h-10 w-10 text-yellow-500 mb-4" />
            <h3 className="text-lg font-black text-white mb-2">So funktioniert's</h3>
            <p className="text-gray-400 text-sm text-center max-w-sm">
              Shops werden jetzt über dein <span className="text-yellow-500 font-bold">Profil</span> verwaltet. 
              Melde dich an, geh in die Einstellungen und füge dort deine Items hinzu.
            </p>
          </div>

          <button 
            onClick={handleSubmit} 
            className="mc-category-active w-full py-4 text-lg font-black transition-transform active:scale-95 shadow-[4px_4px_0px_#1a3a1a]"
          >
            {user ? '⚙️ ZU DEN EINSTELLUNGEN' : '🔑 ERST ANMELDEN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitShop;
