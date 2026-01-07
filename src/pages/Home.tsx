import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Page from '../components/Page';
import HeroField from '../components/HeroField';
import MediaFrame from '../components/MediaFrame';

const storyboard = [
  {
    title: 'QR on stand',
    description: 'Print or display the join QR where the room can see it.',
    src: '/media/join-qr-stand.jpg',
    label: 'Join QR on a stand',
  },
  {
    title: 'iPhone opens App Clip',
    description: 'Scan to open the App Clip or the full app in one tap.',
    src: '/media/join-app-clip.jpg',
    label: 'App Clip opening after scan',
  },
  {
    title: 'Sync View connected',
    description: 'You land in SYNC VIEW already locked to the parent.',
    src: '/media/join-sync-view.jpg',
    label: 'SYNC VIEW connected',
  },
];

const faqs = [
  {
    q: 'How can I sync with others?',
    a: 'SyncTimer uses your local network and bluetooth connections Apple’s Bonjour discovery to automatically find nearby devices. Simply launch the app on each device, set your connection settings, and you’re instantly in perfect lockstep—no awkward pairing, no cables required.',
  },
  {
    q: 'Why is SyncTimer useful?',
    a: 'Whether you’re on stage, in the studio, or teaching a class, SyncTimer replaces clumsy visual count-offs, hardware click tracks, and error-prone spreadsheets. You get rock-solid, drift-corrected timing across any number of devices—so you can focus on the music, not the metronome.',
  },
  {
    q: 'How robust is SyncTimer?',
    a: 'We’ve stress-tested SyncTimer across 30+ iOS devices on congested Wi-Fi, fiber backbones, and enterprise-campus networks. Our two-state Kalman filter and outlier-gating algorithm keep your timing accurate to within 10 ms—even under heavy packet loss.',
  },
  {
    q: 'How does licensing work? (for enterprise/schools)',
    a: 'SyncTimer offers flexible volume licensing: Single-user (App Store purchase); Studio packs (5–25 seats with bulk codes); Institutional (100+ seats with priority support & custom onboarding). Enterprise and educational customers enjoy site-wide deployment, centralized billing, and discounted multi-year agreements.',
  },
  {
    q: 'What about syncing between iPhone and Mac? Max/MSP / DAW / TouchDesigner / QLab / API / Hardware / Offline integration?',
    a: 'Right now SyncTimer focuses on device-to-device timing across iOS hardware via Wi-Fi, Bluetooth, and Bonjour. Native Mac support and external integrations (OSC bridge, REST API, DAW plugins, QLab cues) are on our roadmap and will arrive in with SyncTimer COMPLETE. In the meantime you can run SyncTimer on multiple iPhones and iPads together—any deeper host-to-host or software/hardware hooks will be available soon.',
  },
];

export default function Home() {
  const reduced = useReducedMotion();
  const location = useLocation();
  const [heroVideoFailed, setHeroVideoFailed] = useState(false);

  const heroMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  useEffect(() => {
    if (!location.hash) return;
    const targetId = location.hash.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    }
  }, [location.hash, reduced]);

  return (
    <Page className="home">
      <section className="hero" id="top">
        <HeroField />
        <div className="hero-timecode" aria-hidden="true" />
        <div className="hero-inner">
          <motion.div className="hero-copy" {...heroMotion}>
            <p className="hero-eyebrow">SyncTimer Ensemble</p>
            <h1>Lock every iPhone in the room to ±5 ms.</h1>
            <p className="hero-lead">Parent runs the clock. Everyone follows. Join by QR in seconds.</p>
            <div className="hero-actions">
              <Link className="button primary" to="/#get">
                Get SyncTimer
              </Link>
              <Link className="button secondary" to="/qr">
                Generate Join QR
              </Link>
              <Link className="button tertiary" to="/#join">
                How Join Works
              </Link>
            </div>
            <div className="hero-metrics">
              <span>±5 ms phase lock</span>
              <span>30+ devices stress-tested</span>
            </div>
          </motion.div>
          <div className="hero-media">
            {!heroVideoFailed ? (
              <div className="hero-video">
                {/* Drop the hero video at public/media/hero-video.mp4 (optional). */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster="/media/hero-poster.jpg"
                  onError={() => setHeroVideoFailed(true)}
                >
                  <source src="/media/hero-video.mp4" type="video/mp4" />
                </video>
                <div className="media-caption">Composite SyncTimer screens in rehearsal.</div>
              </div>
            ) : (
              <div className="hero-montage">
                {/* Optional screenshots live in public/media/. */}
                <MediaFrame src="/media/hero-screen-1.jpg" label="SyncTimer hero screen" />
                <MediaFrame src="/media/hero-screen-2.jpg" label="SyncTimer sync view" />
                <MediaFrame src="/media/hero-screen-3.jpg" label="SyncTimer transport view" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="home-section" id="join">
        <div className="section-heading">
          <p className="section-eyebrow">Join</p>
          <h2>Join in one scan</h2>
          <p className="section-desc">One QR gets every device into the right room, instantly.</p>
        </div>
        <div className="storyboard">
          {storyboard.map((frame, index) => (
            <div className="storyboard-card" key={frame.title}>
              <div className="storyboard-label">0{index + 1}</div>
              <MediaFrame src={frame.src} label={frame.label} className="storyboard-media" />
              <h3>{frame.title}</h3>
              <p>{frame.description}</p>
            </div>
          ))}
        </div>
        <details className="detail">
          <summary>What the QR encodes</summary>
          <ul>
            <li>Which mode to join (Wi-Fi or Nearby) so devices connect correctly.</li>
            <li>Which hosts are allowed, plus a room/device label to avoid mix-ups.</li>
            <li>Minimum build or version requirements so incompatible installs never join.</li>
          </ul>
        </details>
      </section>

      <section className="home-section" id="set-forget">
        <div className="section-grid">
          <div>
            <p className="section-eyebrow">Set &amp; Forget</p>
            <h2>Stage-proven controls &amp; safety locks.</h2>
            <p className="section-desc">
              Built for live performance: countdown lock, start/stop lock, parent/child permissions, and robust
              multi-device sync. All the safeguards you need for flawless shows—so you can focus on the music, not
              the timer.
            </p>
          </div>
          <div className="operator-timeline">
            <div className="timeline-node">
              <span>Stop</span>
              <p>Hold the ensemble at a shared zero.</p>
            </div>
            <div className="timeline-node">
              <span>Cue</span>
              <p>Trigger a unified cue call.</p>
            </div>
            <div className="timeline-node">
              <span>Loop</span>
              <p>Repeat safely without drift.</p>
            </div>
            <div className="timeline-node">
              <span>End</span>
              <p>Freeze and archive the run.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" id="countdown">
        <div className="section-grid">
          <div>
            <p className="section-eyebrow">Countdown-first</p>
            <h2>Dial a number. Push it to the room.</h2>
            <p className="section-desc">
              Operators stay on the countdown screen. A dedicated numpad feeds a single master timer that every
              device follows.
            </p>
          </div>
          <div className="countdown-panel">
            <div className="numpad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                <span key={value}>{value}</span>
              ))}
              <span className="wide">0</span>
              <span className="wide">Start</span>
            </div>
            <div className="countdown-meta">
              <p className="muted">Numpad → Countdown → Broadcast</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" id="cue-sheets">
        <div className="section-grid">
          <div>
            <p className="section-eyebrow">Cue Sheets</p>
            <h2>Score SyncTimer with cues and media.</h2>
            <ul className="bullet-list">
              <li>Rehearsal marks + cues stay aligned to the master clock.</li>
              <li>Compositions can SyncTimer as a score through cue sheets messages and images events.</li>
              <li>Editor/preview notes keep rehearsals clear before you push live.</li>
            </ul>
          </div>
          <div className="cue-sheet-visual">
            {/* Drop cue sheet screenshots at public/media/cue-sheet-editor.jpg (optional). */}
            <MediaFrame src="/media/cue-sheet-editor.jpg" label="Cue sheet editor preview" className="cue-sheet-image" />
            <ol className="cue-callouts">
              <li>
                <strong>1</strong>
                <span>Rehearsal marks and cue ordering.</span>
              </li>
              <li>
                <strong>2</strong>
                <span>Message + image cues that travel with the score.</span>
              </li>
              <li>
                <strong>3</strong>
                <span>Preview panel before the run starts.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="home-section" id="transports">
        <div className="section-grid">
          <div>
            <p className="section-eyebrow">Transports</p>
            <h2>Two transports, equal priorities.</h2>
            <p className="section-desc">Pick the transport that matches the room. SyncTimer keeps both in lockstep.</p>
            <ul className="bullet-list">
              <li>Wi-Fi when you control the network and need range.</li>
              <li>Nearby when you need fast setup without infrastructure.</li>
            </ul>
          </div>
          <div className="transport-table">
            <div className="table-row header">
              <span>Transport</span>
              <span>Strength</span>
              <span>Requirement</span>
            </div>
            <div className="table-row">
              <span>Wi-Fi (Bonjour-first)</span>
              <span>Stable multi-room coverage</span>
              <span>Same Wi-Fi required</span>
            </div>
            <div className="table-row">
              <span>Nearby</span>
              <span>Zero setup</span>
              <span>Bluetooth required</span>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section" id="scale">
        <div className="section-grid">
          <div>
            <p className="section-eyebrow">Scale</p>
            <h2>Built for 30+ devices.</h2>
            <p className="section-desc">Parent → children → status. Know who is locked before the downbeat.</p>
          </div>
          <div className="scale-diagram">
            <div className="scale-node parent">Parent</div>
            <div className="scale-children">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index} className="scale-node">
                  Child
                </span>
              ))}
            </div>
            <div className="scale-status">Status: 30+ locked</div>
          </div>
        </div>
      </section>

      <section className="home-section" id="faq">
        <div className="section-heading">
          <p className="section-eyebrow">Q&amp;A</p>
          <h2>Questions, answered.</h2>
          <p className="section-desc">Pulled from the Stage Devices FAQ for SyncTimer operators.</p>
        </div>
        <div className="faq-accordion">
          {faqs.map((item) => (
            <details key={item.q} className="faq-item">
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="home-section get-section" id="get">
        <div className="section-grid">
          <div>
            <p className="section-eyebrow">Get</p>
            <h2>Ready for the room?</h2>
            <p className="section-desc">Install SyncTimer, print a join QR, and lock the room in seconds.</p>
          </div>
          <div className="get-actions">
            <Link className="button primary" to="/app-clip">
              Open App Clip
            </Link>
            <Link className="button secondary" to="/features">
              Explore Features
            </Link>
            <Link className="button tertiary" to="/qr">
              Build a Join QR
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
