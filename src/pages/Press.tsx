import { useEffect, useMemo, useRef, useState } from 'react';
import Page from '../components/Page';
import MediaFrame from '../components/MediaFrame';

const APP_STORE_URL =
  'https://apps.apple.com/us/app/synctimer-ensemble-stopwatch/id6747689247?itscg=30200&itsct=apps_box_badge&mttnsubad=6747689247';
const PRESS_CONTACT_NAME = 'TODO: Add press contact name';
const PRESS_CONTACT_EMAIL = 'press@stagedevices.com';

const pressAssetManifest = import.meta.glob<string>('/public/press/*', {
  eager: true,
  query: '?url',
  import: 'default',
});

const getPressAssetUrl = (filename: string) => {
  const hasAsset = Object.keys(pressAssetManifest).some((path) => path.includes(`/public/press/${filename}`));
  return hasAsset ? `/press/${filename}` : null;
};

type CopyBlock = {
  id: string;
  label: string;
  text: string;
};

type MediaAsset = {
  id: string;
  src: string;
  label: string;
  alt: string;
};

export default function Press() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<MediaAsset | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);

  const pressKitUrl = getPressAssetUrl('presskit-complete.zip');
  const downloadPacks = [
    { id: 'presskit', label: 'Complete press kit (.zip)', filename: 'presskit-complete.zip' },
    { id: 'logos', label: 'Logo pack (.zip)', filename: 'logos.zip' },
    { id: 'screenshots', label: 'Screenshots pack (.zip)', filename: 'screenshots.zip' },
    { id: 'video', label: 'Video pack (.zip)', filename: 'video.zip' },
    { id: 'brand', label: 'Brand guidelines (PDF)', filename: 'brand-guidelines.pdf' },
  ]
    .map((pack) => ({ ...pack, url: getPressAssetUrl(pack.filename) }))
    .filter((pack) => pack.url);

  const logoAssets: MediaAsset[] = [
    {
      id: 'logo-full',
      src: '/brand/synctimer-logo.png',
      label: 'SyncTimer logo (full color)',
      alt: 'SyncTimer full color logo',
    },
    {
      id: 'logo-header',
      src: '/brand/header.png',
      label: 'SyncTimer header lockup',
      alt: 'SyncTimer header lockup',
    },
  ];

  const screenshotAssets: MediaAsset[] = [
    {
      id: 'screenshot-countdown',
      src: '/media/countdownfirst.png',
      label: 'Countdown-first timer',
      alt: 'Countdown-first timer screen',
    },
    {
      id: 'screenshot-cues',
      src: '/media/cuesheets.png',
      label: 'Cue sheets editor',
      alt: 'Cue sheets editor screen',
    },
    {
      id: 'screenshot-locks',
      src: '/media/setandforget.png',
      label: 'Stage-proven locks',
      alt: 'Stage-proven controls screen',
    },
  ];

  const videoAssets = [
    {
      id: 'video-stage-reel',
      src: '/media/stage-devices-hero.mp4',
      label: 'SyncTimer stage reel',
    },
  ];

  const storyAngles = [
    {
      id: 'angle-ensemble',
      headline: 'Rehearsal sync without the hardware stack',
      body:
        'SyncTimer replaces shared click tracks and hardware timers with a network-synchronized clock that every device follows. Ensembles get a single countdown, synchronized cues, and predictable starts without new boxes on the music stand.',
    },
    {
      id: 'angle-cues',
      headline: 'Cue sheets as live prompts, not paperwork',
      body:
        'Cue sheets run inside the same synchronized session, so prompts, images, and notes appear at the exact moment across the room. That keeps operators and performers aligned while trimming rehearsal chatter.',
    },
    {
      id: 'angle-privacy',
      headline: 'Privacy-first production timing',
      body:
        'SyncTimer does not require accounts and keeps session data on device. That makes it a practical fit for classrooms, pits, and touring crews that need reliable timing without data handoffs.',
    },
  ];

  const copyBlocks: CopyBlock[] = [
    {
      id: 'tagline',
      label: 'Tagline (≤8 words)',
      text: 'Ensemble sync with cue sheets, instantly.',
    },
    {
      id: 'desc-25',
      label: '25-word description',
      text: 'SyncTimer is a network-synchronized rehearsal timer with cue sheets, built for ensembles to start together, stay aligned, and communicate live prompts without accounts or logins.',
    },
    {
      id: 'desc-50',
      label: '50-word description',
      text: 'Designed for rehearsals, SyncTimer keeps every device on the same countdown while cue sheets fire messages, images, and marks at precise times. Parent/child sessions keep control centralized, and Wi-Fi or Nearby transports handle tough rooms without manual pairing or accounts to get started so ensembles stay together through every take.',
    },
    {
      id: 'desc-100',
      label: '100-word description',
      text: 'SyncTimer is a rehearsal-first stopwatch that locks ensembles to one shared clock. Hosts run a parent session and push synced countdowns, while child devices follow in lockstep with drift correction. Cue sheets add timed prompts, images, and stage notes so everyone sees the same moment. Operators can join by QR, choose Wi-Fi or Nearby transport, and keep privacy intact with no required accounts. The result is tighter starts, cleaner transitions, and clearer communication across stages, pits, classrooms, and studios. It is built for musicians, directors, and stage managers who need reliable sync without extra hardware or setup delays each rehearsal.',
    },
    {
      id: 'boilerplate',
      label: 'Boilerplate (250–500 words)',
      text: 'SyncTimer is a rehearsal-first timing system built for ensembles that need to start together and stay together. Instead of relying on verbal count-offs, external click tracks, or manual spreadsheets, SyncTimer provides a network-synchronized stopwatch that every device follows. Operators run a parent session, performers join as child devices, and the room shares one authoritative countdown that stays aligned with drift correction.\n\nCue sheets bring rehearsal notes into the same timeline. Timed prompts, images, and messages appear exactly when they should, which keeps the entire room aligned without extra announcements. SyncTimer supports QR joins so new devices can enter a session quickly, and operators can choose Wi-Fi (Bonjour) or Nearby transport depending on the room. The workflow is designed for real rehearsal constraints: low setup time, clear ownership, and a single source of timing truth.\n\nSyncTimer is privacy-first. No account is required, and session data stays on device and clears after the session ends. That makes the app well suited for schools, touring groups, and production teams that need dependable timing without extra data collection or administrative overhead.\n\nSyncTimer is used by musicians, stage managers, directors, and educators who run complex rehearsals and live performances. It brings synced countdowns, cue sheets, and live prompts into one clear interface so everyone is looking at the same moment. The result is fewer false starts, cleaner transitions, and rehearsals that run on time.',
    },
  ];

  const factsheetItems = [
    { label: 'Product', value: 'SyncTimer' },
    { label: 'Category', value: 'Music' },
    { label: 'Platforms', value: 'iOS, macOS' },
    { label: 'Website', value: 'synctimerapp.com', href: 'https://synctimerapp.com' },
    {
      label: 'Press contact',
      value: `${PRESS_CONTACT_NAME} — ${PRESS_CONTACT_EMAIL}`,
      href: `mailto:${PRESS_CONTACT_EMAIL}`,
    },
    { label: 'Company', value: 'Stage Devices' },
  ];

  const factsheetCopy = factsheetItems.map((item) => `${item.label}: ${item.value}`).join('\n');

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'SyncTimer',
      url: 'https://synctimerapp.com/press',
      applicationCategory: 'MusicApplication',
      operatingSystem: 'iOS, macOS',
      description: 'Network-synchronized rehearsal timer with cue sheets for ensembles.',
      publisher: {
        '@type': 'Organization',
        name: 'Stage Devices',
        url: 'https://synctimerapp.com',
      },
      downloadUrl: APP_STORE_URL,
    }),
    []
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = 'SyncTimer Press Kit';
    const metaTags = [
      { name: 'description', content: 'Press kit for SyncTimer: factsheet, copy, screenshots, and logos.' },
      { property: 'og:title', content: 'SyncTimer Press Kit' },
      { property: 'og:description', content: 'Network-synchronized rehearsal timer + cue sheets for ensembles.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://synctimerapp.com/press' },
      { property: 'og:image', content: 'https://synctimerapp.com/brand/synctimer-logo.png' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'SyncTimer Press Kit' },
      { name: 'twitter:description', content: 'Network-synchronized rehearsal timer + cue sheets for ensembles.' },
      { name: 'twitter:image', content: 'https://synctimerapp.com/brand/synctimer-logo.png' },
    ];
    const created: HTMLMetaElement[] = [];

    metaTags.forEach((tag) => {
      const selector = tag.name ? `meta[name="${tag.name}"]` : `meta[property="${tag.property}"]`;
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement('meta');
        if (tag.name) {
          element.setAttribute('name', tag.name);
        } else if (tag.property) {
          element.setAttribute('property', tag.property);
        }
        element.dataset.press = 'true';
        document.head.appendChild(element);
        created.push(element);
      }
      element.setAttribute('content', tag.content);
    });

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.dataset.press = 'true';
      document.head.appendChild(canonical);
    }
    canonical.href = 'https://synctimerapp.com/press';

    return () => {
      document.title = previousTitle;
      created.forEach((element) => element.remove());
      if (canonical?.dataset.press === 'true') {
        canonical.remove();
      }
    };
  }, []);

  useEffect(
    () => () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!activeMedia) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMedia(null);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [activeMedia]);

  const handleCopy = async (id: string, text: string) => {
    const fallbackCopy = (value: string) => {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy(text);
      }
      setCopiedId(id);
    } catch (error) {
      fallbackCopy(text);
      setCopiedId(id);
    }

    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = window.setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Page className="stack press-page">
      <header className="page-header press-hero" id="top">
        <div>
          <h1>SyncTimer Press Kit</h1>
          <p className="press-hero-lead">Network-synchronized rehearsal timer + cue sheets for ensembles.</p>
          <div className="press-hero-actions">
            {pressKitUrl ? (
              <a className="button primary" href={pressKitUrl}>
                Download press kit (.zip)
              </a>
            ) : (
              <button className="primary" type="button" disabled aria-disabled="true">
                Download press kit (.zip)
              </button>
            )}
            <a className="button primary" href={APP_STORE_URL}>
              App Store
            </a>
          </div>
          {!pressKitUrl && (
            <p className="muted press-hero-note">
              Press kit download links are not bundled in this build.
            </p>
          )}
          <div className="press-hero-links">
            <a href="#contact" className="text-link">
              Contact
            </a>
            <a href="#factsheet" className="text-link">
              Factsheet
            </a>
            <a href="#screenshots" className="text-link">
              Screenshots
            </a>
            <a href="#logos" className="text-link">
              Logos
            </a>
          </div>
        </div>
      </header>

      <section className="panel press-factsheet" id="factsheet">
        <div className="press-factsheet-header">
          <div>
            <p className="section-eyebrow">Factsheet</p>
            <h2>Fast reference</h2>
          </div>
          <div className="row compact">
            <button className="secondary" type="button" onClick={() => handleCopy('factsheet-all', factsheetCopy)}>
              Copy all
            </button>
            {copiedId === 'factsheet-all' && (
              <span className="press-copy-status" aria-live="polite">
                Copied
              </span>
            )}
          </div>
        </div>
        <div className="press-factsheet-table">
          {factsheetItems.map((item) => (
            <div key={item.label} className="table-row press-factsheet-row">
              <span className="press-factsheet-label">{item.label}</span>
              <span className="press-factsheet-value">
                {item.href ? (
                  <a href={item.href} className="text-link">
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </span>
              <div className="press-factsheet-actions">
                <button
                  type="button"
                  className="secondary press-copy-button"
                  onClick={() => handleCopy(`factsheet-${item.label}`, item.value)}
                >
                  Copy
                </button>
                {copiedId === `factsheet-${item.label}` && (
                  <span className="press-copy-status" aria-live="polite">
                    Copied
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="press-copy" id="copy-blocks">
        <div className="section-heading">
          <p className="section-eyebrow">Copy blocks</p>
          <h2>Ready-to-use descriptions</h2>
          <p className="section-desc">Copy any block for quick insertion into press coverage or listings.</p>
        </div>
        <div className="press-copy-grid">
          {copyBlocks.map((block) => (
            <div key={block.id} className="panel press-copy-card">
              <div className="press-copy-card-header">
                <h3>{block.label}</h3>
                <button type="button" className="secondary press-copy-button" onClick={() => handleCopy(block.id, block.text)}>
                  Copy
                </button>
              </div>
              <p className="press-copy-text">{block.text}</p>
              {copiedId === block.id && (
                <span className="press-copy-status" aria-live="polite">
                  Copied
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="press-story" id="story-angles">
        <div className="section-heading">
          <p className="section-eyebrow">Story angles</p>
          <h2>Coverage-ready angles</h2>
        </div>
        <div className="press-story-grid">
          {storyAngles.map((angle) => (
            <div key={angle.id} className="panel press-story-card">
              <h3>{angle.headline}</h3>
              <p>{angle.body}</p>
              <button type="button" className="secondary press-copy-button" onClick={() => handleCopy(angle.id, angle.body)}>
                Copy angle
              </button>
              {copiedId === angle.id && (
                <span className="press-copy-status" aria-live="polite">
                  Copied
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="press-assets" id="assets">
        <div className="section-heading">
          <p className="section-eyebrow">Media assets</p>
          <h2>Logos, screenshots, and downloads</h2>
          <p className="section-desc">Browse inline assets and download packs when they are available.</p>
        </div>

        <div className="press-downloads">
          <h3>Download packs</h3>
          {downloadPacks.length > 0 ? (
            <div className="grid press-download-grid">
              {downloadPacks.map((pack) => (
                <a key={pack.id} className="panel press-download-card" href={pack.url ?? undefined}>
                  <h4>{pack.label}</h4>
                  <p className="muted">{pack.filename}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className="muted">No downloadable packs are published in this build.</p>
          )}
        </div>

        <div className="press-zip-structure">
          <h3>Press kit folder layout</h3>
          <ul className="press-zip-list">
            <li>/01-logos/</li>
            <li>/02-icons/</li>
            <li>/03-screenshots/iphone/ /ipad/ /mac/</li>
            <li>/04-video/15s/ /30s/ /60s/ /broll/</li>
            <li>/05-copy/</li>
          </ul>
        </div>
      </section>

      {logoAssets.length > 0 && (
        <section className="press-logos" id="logos">
          <div className="section-heading">
            <p className="section-eyebrow">Logos</p>
            <h2>Logo gallery</h2>
          </div>
          <div className="press-gallery">
            {logoAssets.map((logo) => (
              <button key={logo.id} type="button" className="press-media-button" onClick={() => setActiveMedia(logo)}>
                <MediaFrame src={logo.src} alt={logo.alt} label={logo.label} />
                <span className="press-media-caption">{logo.label}</span>
              </button>
            ))}
          </div>
          <div className="panel press-logo-rules">
            <h3>Logo usage</h3>
            <ul className="press-rule-list">
              <li>Do keep clearspace around the mark.</li>
              <li>Don’t stretch, outline, add shadows, recolor, or place on low-contrast backgrounds.</li>
            </ul>
          </div>
        </section>
      )}

      {screenshotAssets.length > 0 && (
        <section className="press-screenshots" id="screenshots">
          <div className="section-heading">
            <p className="section-eyebrow">Screenshots</p>
            <h2>Press picks</h2>
            <p className="section-desc">Highlights include cue sheets and in-session timing views.</p>
          </div>
          <div className="press-gallery">
            {screenshotAssets.map((shot) => (
              <button key={shot.id} type="button" className="press-media-button" onClick={() => setActiveMedia(shot)}>
                <MediaFrame src={shot.src} alt={shot.alt} label={shot.label} />
                <span className="press-media-caption">{shot.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {videoAssets.length > 0 && (
        <section className="press-video" id="video">
          <div className="section-heading">
            <p className="section-eyebrow">Video</p>
            <h2>Available footage</h2>
          </div>
          <div className="panel press-video-panel">
            <p className="muted">Preview the available product reel below.</p>
            <video controls preload="metadata">
              <source src={videoAssets[0].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      )}

      <section className="press-faq" id="faq">
        <div className="section-heading">
          <p className="section-eyebrow">FAQ</p>
          <h2>Quick answers</h2>
        </div>
        <div className="faq-accordion">
          <details className="faq-item">
            <summary>Who is SyncTimer for?</summary>
            <p>
              SyncTimer is built for ensembles, stage managers, directors, and educators who need precise timing across
              multiple devices during rehearsal.
            </p>
          </details>
          <details className="faq-item">
            <summary>Does SyncTimer require the internet?</summary>
            <p>
              SyncTimer syncs over local Wi-Fi (Bonjour) or Nearby transport. An internet connection is not required for
              in-room sessions.
            </p>
          </details>
          <details className="faq-item">
            <summary>Which devices are supported?</summary>
            <p>SyncTimer supports iOS and macOS devices distributed via the App Store.</p>
          </details>
          <details className="faq-item">
            <summary>How does SyncTimer handle data?</summary>
            <p>No account is required. Session data stays on-device and is cleared after the session ends.</p>
          </details>
          <details className="faq-item">
            <summary>How should reviewers represent the app?</summary>
            <p>
              Describe SyncTimer as a rehearsal-first, network-synchronized stopwatch with cue sheets and live prompts
              that keep ensembles aligned.
            </p>
          </details>
          <details className="faq-item">
            <summary>Where can I get assets or schedule an interview?</summary>
            <p>
              Use the download packs when available or reach out directly to {PRESS_CONTACT_NAME} at {PRESS_CONTACT_EMAIL}
              for assets or interviews.
            </p>
          </details>
        </div>
      </section>

      <section className="panel press-contact" id="contact">
        <h2>Contact</h2>
        <p>
          {PRESS_CONTACT_NAME}
          <br />
          <a className="text-link" href={`mailto:${PRESS_CONTACT_EMAIL}`}>
            {PRESS_CONTACT_EMAIL}
          </a>
        </p>
      </section>

      {activeMedia && (
        <div className="press-modal" role="dialog" aria-modal="true" aria-label={activeMedia.label}>
          <div className="press-modal-content">
            <div className="press-modal-header">
              <button type="button" className="secondary press-modal-close" onClick={() => setActiveMedia(null)}>
                Close
              </button>
            </div>
            <img src={activeMedia.src} alt={activeMedia.alt} />
            <p className="press-modal-caption">{activeMedia.label}</p>
          </div>
          <button
            type="button"
            className="press-modal-backdrop"
            onClick={() => setActiveMedia(null)}
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </Page>
  );
}
