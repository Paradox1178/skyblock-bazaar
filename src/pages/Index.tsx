import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Flame, Sparkles, LayoutGrid } from 'lucide-react';
import ItemCard from '@/components/ItemCard';
import { DEFAULT_ITEMS, getItemShops } from '@/data/items';

const Index = () => {
  const navigate = useNavigate();

  // Sortierung nach Beliebtheit (Anzahl der Shops)
  const popularItems = [...DEFAULT_ITEMS]
    .sort((a, b) => getItemShops(b.id).length - getItemShops(a.id).length)
    .slice(0, 12); // Erhöht auf 12 für ein volleres Grid

  const newItems = [...DEFAULT_ITEMS].slice(-12).reverse();

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      
      {/* Hero Banner - Nutzt dein mc-stone-panel aus der CSS */}
      <section className="mc-stone-panel border-b-4 border-black relative">
        {/* Dunkles Overlay für bessere Lesbarkeit auf der Textur */}
        <div className="absolute inset-0 bg-black/40 z-0" />
        
        <div className="container mx-auto px-4 py-16 text-center relative z-10">
          <h1 className="font-pixel text-2xl sm:text-4xl text-white mb-4 drop-shadow-[4px_4px_0px_#000]">
            ⛏️ CytoMarkt
          </h1>
          <p className="text-lg md:text-xl font-bold text-gray-200 max-w-2xl mx-auto mb-8 drop-shadow-[2px_2px_0px_#000]">
            Der Marktplatz für Cytooxien Skyblock. <br />
            Finde die günstigsten Preise unter {DEFAULT_ITEMS.length} Items.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => navigate('/items')} 
              className="mc-btn-primary px-8 py-4 text-sm font-pixel flex items-center gap-2"
            >
              <LayoutGrid className="h-4 w-4" /> Items suchen
            </button>
            <button 
              onClick={() => navigate('/submit')} 
              className="mc-category-active px-8 py-4 text-sm font-bold flex items-center gap-2 border-white/20"
            >
              <PlusSquare className="h-4 w-4" /> Shop eintragen
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Most Traded - Beliebteste Items */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8 border-l-4 border-yellow-600 pl-4">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-2">
                Beliebteste Items <Flame className="h-6 w-6 text-orange-500" />
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase mt-1">Meist angebotene Waren im Bazaar</p>
            </div>
            <Link 
              to="/items" 
              className="mc-category text-[10px] flex items-center gap-2 hover:bg-[#333] transition-colors"
            >
              ALLE ANZEIGEN <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {popularItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* New Items - Neue Items */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8 border-l-4 border-blue-600 pl-4">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-2">
                Frisch eingetroffen <Sparkles className="h-6 w-6 text-blue-400" />
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase mt-1">Zuletzt zum Katalog hinzugefügt</p>
            </div>
            <Link 
              to="/items" 
              className="mc-category text-[10px] flex items-center gap-2"
            >
              ZUM KATALOG <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {newItems.map(item => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Footer Info Box */}
        <div className="mc-panel mt-20 p-8 text-center bg-[#2a2a2a]">
          <h3 className="text-xl font-black mb-2 uppercase">Werde Teil der Community</h3>
          <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
            Hilf anderen Spielern, indem du deine Shop-Preise teilst. 
            Je mehr Daten wir haben, desto besser für alle!
          </p>
          <Link to="/submit" className="mc-btn-primary px-10 py-3 inline-block">
            Meinen Shop registrieren
          </Link>
        </div>
      </div>
    </div>
  );
};

// Hilfs-Icon Import Fix für dieses Snippet
import { PlusSquare } from 'lucide-react';

export default Index;