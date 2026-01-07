import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-block">
          <span className="footer-title">Stage Devices</span>
          <p>Timing, cueing, and rehearsal systems for modern ensembles.</p>
          <a className="footer-link" href="https://stagedevices.com" target="_blank" rel="noreferrer">
            Stage Devices family →
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
