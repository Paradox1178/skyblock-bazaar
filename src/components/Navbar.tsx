import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { CATEGORIES } from '@/data/items';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/items?q=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Dirt-textured Navbar */}
      <div className="mc-navbar">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⛏️</span>
            <span className="font-pixel text-[11px] text-primary-foreground tracking-wider hidden sm:inline drop-shadow-[2px_2px_0_rgba(0,0,0,0.5)]">
              CytoMarkt
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Item suchen..."
              className="mc-input pr-10"
            />
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 mc-btn-primary p-1.5">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/submit" className="mc-btn-accent flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Shop eintragen</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mc-panel border-t-0" style={{ borderTop: 'none' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <Link
              to="/items"
              className={`mc-category ${
                location.pathname === '/items' && !location.search ? 'mc-category-active' : ''
              }`}
            >
              Alle
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/items?category=${encodeURIComponent(cat)}`}
                className={`mc-category ${
                  location.search.includes(encodeURIComponent(cat)) ? 'mc-category-active' : ''
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
