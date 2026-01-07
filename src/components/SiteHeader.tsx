import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../theme/useTheme';

export default function SiteHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand-logo" to="/" aria-label="SyncTimer home">
          <img src="/brand/header.png" alt="SyncTimer" />
        </Link>
        <nav className="nav">
          <NavLink to="/community" className="nav-link">
            Community
          </NavLink>
          <NavLink to="/features" className="nav-link">
            Features
          </NavLink>
          <NavLink to="/support" className="nav-link">
            Support
          </NavLink>
          <NavLink to="/qr" className="nav-link">
            QR Tool
          </NavLink>
          <Link to="/#get" className="nav-link nav-cta">
            Get
          </Link>
          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
            Light / Dark
          </button>
        </nav>
      </div>
    </header>
  );
}
