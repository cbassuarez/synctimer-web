import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import Page from '../components/Page';
import HeroField from '../components/HeroField';
import MediaFrame from '../components/MediaFrame';
import DeviceMock3D from '../components/DeviceMock3D';

const APP_STORE_URL =
  'https://apps.apple.com/us/app/synctimer-ensemble-stopwatch/id6747689247?itscg=30200&itsct=apps_box_badge&mttnsubad=6747689247';
const MAC_APP_STORE_URL = 'MAC_APP_STORE_URL';
const IOS_TESTFLIGHT_URL = 'IOS_TESTFLIGHT_URL';
const MAC_TESTFLIGHT_URL = 'MAC_TESTFLIGHT_URL';
const ANDROID_BUILD_URL = 'https://github.com/synctimer/android';

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
  const [setForgetFailed, setSetForgetFailed] = useState(false);
  const [countdownFailed, setCountdownFailed] = useState(false);
  const [cueSheetsFailed, setCueSheetsFailed] = useState(false);

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
            <h1>The stopwatch that finally nails ensemble sync.</h1>
            <p className="hero-lead">
              SyncTimer allows you to sync stopwatches on demand with powerful tools for performers, theaters, or
              anyone who wants to sync offstage.
            </p>
            <p className="hero-tagline">Instant, reliable, precise.</p>
            <div className="hero-actions">
              <a href={APP_STORE_URL} style={{ display: 'inline-block' }}>
                <img
                  src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1759190400"
                  alt="Download on the App Store"
                  style={{ width: '246px', height: '82px', verticalAlign: 'middle', objectFit: 'contain' }}
                />
              </a>
              <div className="hero-cta-buttons">
                <Link className="button primary" to="/#get">
                  Get
                </Link>
                <Link className="button secondary" to="/qr">
                  Generate Join QR
                </Link>
              </div>
            </div>
          </motion.div>
          <div className="hero-media">
            <DeviceMock3D
              variant="landscape"
              size="lg"
              tilt={{ x: -9, y: 16 }}
              offset={{ x: 24, y: 10, z: 22 }}
              fallbackLabel="Add stage-devices-hero.mp4 to /public/media/"
              media={
                heroVideoFailed ? undefined : (
                  <video autoPlay muted loop playsInline preload="metadata" onError={() => setHeroVideoFailed(true)}>
                    <source src="/media/stage-devices-hero.mp4" type="video/mp4" />
                  </video>
                )
              }
            />
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
          <div>
            <DeviceMock3D
              variant="portrait"
              size="sm"
              tilt={{ x: -8, y: 14 }}
              offset={{ x: 18, y: 10, z: 20 }}
              fallbackLabel="setandforget.png"
              media={
                setForgetFailed ? undefined : (
                  <img
                    src="/media/setandforget.png"
                    alt="Set & Forget"
                    loading="lazy"
                    onError={() => setSetForgetFailed(true)}
                  />
                )
              }
            />
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
          <div>
            <DeviceMock3D
              variant="portrait"
              size="sm"
              tilt={{ x: -10, y: 18 }}
              offset={{ x: 16, y: 12, z: 22 }}
              fallbackLabel="countdownfirst.png"
              media={
                countdownFailed ? undefined : (
                  <img
                    src="/media/countdownfirst.png"
                    alt="Countdown First"
                    loading="lazy"
                    onError={() => setCountdownFailed(true)}
                  />
                )
              }
            />
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
          <div>
            <DeviceMock3D
              variant="portrait"
              size="sm"
              tilt={{ x: -7, y: 12 }}
              offset={{ x: 14, y: 8, z: 18 }}
              fallbackLabel="cuesheets.png"
              media={
                cueSheetsFailed ? undefined : (
                  <img
                    src="/media/cuesheets.png"
                    alt="Cue Sheets"
                    loading="lazy"
                    onError={() => setCueSheetsFailed(true)}
                  />
                )
              }
            />
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
        <div className="section-heading">
          <h2>Get SyncTimer</h2>
        </div>
        <div className="get-grid">
          <div className="get-card">
            <h3>Stable</h3>
            <div className="get-buttons">
              <a className="button primary" href={APP_STORE_URL}>
                App Store (iOS/iPadOS)
              </a>
              <a className="button secondary" href={MAC_APP_STORE_URL}>
                App Store (macOS)
              </a>
            </div>
          </div>
          <div className="get-card">
            <h3>Nightly</h3>
            <div className="get-buttons">
              <a className="button secondary" href={IOS_TESTFLIGHT_URL}>
                TestFlight (iOS/iPadOS)
              </a>
              <a className="button tertiary" href={MAC_TESTFLIGHT_URL}>
                TestFlight (macOS)
              </a>
            </div>
          </div>
        </div>
        <div className="get-android">
          <a className="button secondary" href={ANDROID_BUILD_URL}>
            Build Android (open source)
          </a>
          <p>Android builds are community-driven. Start here.</p>
        </div>
      </section>
    </Page>
  );
}
