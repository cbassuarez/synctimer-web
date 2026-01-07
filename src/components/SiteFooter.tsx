import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-block">
          <a className="footer-link" href="https://stagedevices.com" target="_blank" rel="noreferrer">
            Stage Devices →
          </a>
        </div>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/support">Support</Link>
          <Link to="/press">Press</Link>
        </div>
      </div>
    </footer>
  );
}
