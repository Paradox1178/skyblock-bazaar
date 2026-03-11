import { Link, useLocation } from 'react-router-dom';
import { Search, Store, Plus, Home } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const links = [
    { to: '/', label: 'Start', icon: Home },
    { to: '/items', label: 'Items', icon: Search },
    { to: '/submit', label: 'Shop einreichen', icon: Plus },
  ];

  return (
    <nav className="mc-panel sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Store className="h-5 w-5 mc-text-emerald" />
          <span className="font-minecraft text-xs mc-text-gold hidden sm:inline">
            CytoMarkt
          </span>
        </Link>

        <div className="flex gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`mc-button text-[10px] flex items-center gap-1.5 ${
                location.pathname === to ? 'mc-text-gold' : ''
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
