import { Link, useLocation } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      {/* Main Nav */}
      <div className="nav-bar">
        <div className="container mx-auto flex items-center gap-4 px-4 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">⛏️</span>
            <span className="font-pixel text-[10px] text-nav-foreground tracking-wider hidden sm:inline">
              CytoMarkt
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-lg relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Items..."
              className="search-input pr-10"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/submit" className="btn-accent flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Shop eintragen</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <Link
              to="/items"
              className={`category-tab whitespace-nowrap ${
                location.pathname === '/items' && !location.search ? 'category-tab-active' : ''
              }`}
            >
              Alle
            </Link>
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/items?category=${encodeURIComponent(cat)}`}
                className={`category-tab whitespace-nowrap ${
                  location.search.includes(cat) ? 'category-tab-active' : ''
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
