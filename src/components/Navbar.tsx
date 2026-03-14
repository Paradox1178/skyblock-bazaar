import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus, Store, Settings, LogIn, LogOut, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { CATEGORIES, DEFAULT_ITEMS } from '@/data/items';
import { useAuth } from '@/context/AuthContext';
import { getPlayerUnreadFeedbackCount } from '@/api/client';
import LoginDialog from '@/components/LoginDialog';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const results = search.trim().length > 1 
    ? DEFAULT_ITEMS
        .filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/items?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user) { setUnreadCount(0); return; }
    getPlayerUnreadFeedbackCount(user.id)
      .then(r => setUnreadCount(r.count))
      .catch(() => {});
  }, [user, location.pathname]);

  return (
    <>
      <header className="sticky top-0 z-50">
        <div className="mc-navbar">
          <div className="container mx-auto flex items-center gap-4 px-4 py-3">
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="text-2xl">⛏️</span>
              <span className="font-pixel text-[11px] text-primary-foreground tracking-wider hidden sm:inline drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
                CytoMarkt
              </span>
            </Link>

            <div className="flex-1 max-w-lg relative" ref={dropdownRef}>
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Item suchen..."
                  className="mc-input pr-10"
                />
                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 mc-btn-primary p-1.5">
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {showDropdown && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-[60]">
                  {results.map((item) => (
                    <Link
                      key={item.id}
                      to={`/items/${item.id}`}
                      onClick={() => { setSearch(''); setShowDropdown(false); }}
                      className="flex items-center gap-3 p-3 border-b border-black/20 hover:bg-[#323232] transition-colors group"
                    >
                      <div className="mc-item-slot bg-[#1a1a1a] w-10 h-10 shrink-0">
                        <img src={item.icon} alt="" className="pixelated w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-white text-sm group-hover:text-yellow-500">{item.name}</p>
                        <p className="text-[9px] text-gray-500 uppercase">{item.category}</p>
                      </div>
                    </Link>
                  ))}
                  <div
                    className="p-2 bg-black/10 text-center text-[10px] text-gray-400 cursor-pointer hover:text-white"
                    onClick={handleSearch}
                  >
                    Alle Ergebnisse für "{search}" anzeigen...
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link to="/submit" className="mc-btn-accent flex items-center gap-1.5 active:translate-y-0.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Shop eintragen</span>
              </Link>

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 mc-btn py-1.5 px-2"
                  >
                    <img
                      src={`https://mc-heads.net/avatar/${user.username}/24`}
                      alt={user.username}
                      className="w-6 h-6 pixelated"
                    />
                    <span className="hidden sm:inline text-sm font-bold">{user.username}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] border-2 border-[#1e1e1e] shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-[60]">
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 p-3 hover:bg-[#323232] text-white text-sm font-bold transition-colors"
                      >
                        <Settings className="h-4 w-4 text-yellow-500" /> Einstellungen
                      </Link>
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="flex items-center gap-2 p-3 hover:bg-[#323232] text-red-400 text-sm font-bold w-full text-left transition-colors border-t border-black/20"
                      >
                        <LogOut className="h-4 w-4" /> Abmelden
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="mc-btn flex items-center gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Anmelden</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mc-panel border-t-0 bg-[#222222]/95 backdrop-blur-sm" style={{ borderTop: 'none' }}>
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
              <Link
                to="/items"
                className={`mc-category ${location.pathname === '/items' && !location.search ? 'mc-category-active' : ''}`}
              >
                Alle
              </Link>
              {CATEGORIES.map(cat => (
                <Link
                  key={cat}
                  to={`/items?category=${encodeURIComponent(cat)}`}
                  className={`mc-category ${location.search.includes(encodeURIComponent(cat)) ? 'mc-category-active' : ''}`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Navbar;
