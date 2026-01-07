import { Link, NavLink } from 'react-router-dom';

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand">
          <a className="brand-wordmark" href="https://stagedevices.com" target="_blank" rel="noreferrer">
            Stage Devices
          </a>
          <Link className="brand-name" to="/">
            SyncTimer
          </Link>
        </div>
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
        </nav>
      </div>
    </header>
  );
}
