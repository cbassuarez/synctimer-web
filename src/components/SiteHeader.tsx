import { NavLink } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-lockup">
            <span className="brand-eyebrow">Stage Devices</span>
            <span className="brand-name">SyncTimer</span>
          </div>
          <span className="brand-tagline">Synchronized timers for ensembles.</span>
        </div>
        <nav className="nav">
          <NavLink to="/app-clip" className="nav-link">
            Download
          </NavLink>
          <NavLink to="/qr" className="nav-link">
            QR Tool
          </NavLink>
          <NavLink to="/support" className="nav-link">
            Support
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
