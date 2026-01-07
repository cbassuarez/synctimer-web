import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Page from '../components/Page';
import Section from '../components/Section';
import HeroMock from '../components/HeroMock';
import PhaseField from '../components/PhaseField';
import DriftLens from '../components/DriftLens';

export default function Home() {
  const reduced = useReducedMotion();
  const heroMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <Page>
      <section className="hero">
        <PhaseField />
        <div className="hero-inner">
          <motion.div className="hero-copy" {...heroMotion}>
            <p className="hero-eyebrow">SyncTimer v1</p>
            <h1>Precise ensemble timing without drift.</h1>
            <p className="hero-lead">
              SyncTimer keeps performers locked to one countdown. Wi-Fi and Nearby transport modes, QR join, and
              cue sheet handoff.
            </p>
            <div className="hero-actions">
              <Link className="button primary" to="/app-clip">
                Download App Clip
              </Link>
              <Link className="button secondary" to="/qr">
                Open QR tool
              </Link>
            </div>
            <div className="hero-meta">
              <span className="chip accent">Phase lock stable</span>
              <span className="chip">Latency budget: &lt; 15 ms</span>
            </div>
          </motion.div>
          <div className="hero-media">
            <DriftLens />
            <HeroMock />
          </div>
        </div>
      </section>

      <Section
        eyebrow="Join"
        title="Join in one scan"
        description="Scan the QR. SyncTimer opens the correct room with host ordering preserved."
        media={
          <div className="panel">
            <p className="panel-title">Join link payload</p>
            <p className="panel-body">Hosts, mode, compatibility, and transport hints.</p>
          </div>
        }
      >
        <details className="detail">
          <summary>What the QR encodes</summary>
          <ul>
            <li>Room label and host UUIDs</li>
            <li>Mode-specific transport hinting</li>
            <li>Optional minimum build or version gate</li>
          </ul>
        </details>
      </Section>

      <Section
        eyebrow="Countdown"
        title="Countdown-first workflow"
        description="Dial in a time, push to ensemble, and track the same zero point across every device."
        media={
          <div className="panel">
            <p className="panel-title">Numpad → Countdown</p>
            <p className="panel-body">Operators stay on one screen. No layering or hidden modes.</p>
          </div>
        }
      />

      <Section
        eyebrow="Transport"
        title="Sync transports compare"
        description="Choose the transport that fits the room. SyncTimer maintains timing discipline either way."
        media={
          <div className="panel table">
            <div className="table-row">
              <span>Wi-Fi Bonjour</span>
              <span>Longer range</span>
              <span>Managed network</span>
            </div>
            <div className="table-row">
              <span>Nearby</span>
              <span>Zero infrastructure</span>
              <span>Small rooms</span>
            </div>
          </div>
        }
      />

      <Section
        eyebrow="Cue sheets"
        title="Hand off cues without retyping"
        description="Import or author cues once and keep them aligned to the master timer."
        media={
          <div className="panel">
            <p className="panel-title">Cue sheets</p>
            <p className="panel-body">CSV import, instant re-ordering, and on-cue alerts.</p>
          </div>
        }
      />

      <Section
        eyebrow="Reliability"
        title="Status semantics you can trust"
        description="SyncTimer surfaces clear failure states, so you can correct before rehearsal starts."
        media={
          <div className="panel">
            <p className="panel-title">System status</p>
            <p className="panel-body">Host dropped, drift detected, or transport mismatch flagged.</p>
            <Link className="text-link" to="/support">
              Go to Support →
            </Link>
          </div>
        }
      />
    </Page>
  );
}
