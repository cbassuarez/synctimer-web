import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Page from '../components/Page';
import { buildJoinUrl } from '../features/qr/buildJoinUrl';
import { BrandingCorner, BrandingOptions, downloadPng, downloadSvg, generateSvgMarkup } from '../features/qr/qr';
import {
  GeneratorConfig,
  HostEntry,
  Mode,
  ValidationResult,
  defaultConfig,
  normalizeDeviceNames,
  uuidRegex,
  validateConfig,
} from '../features/qr/model';
import { parseAnyInput, parseHostShareLinks, parseJoinLink } from '../features/qr/parse';
import { copyText } from '../features/qr/ui';
import { decodeState, encodeState, loadPersistedConfig, persistConfig } from '../features/qr/storage';

function usePersistentConfig(): [GeneratorConfig, React.Dispatch<React.SetStateAction<GeneratorConfig>>] {
  const [config, setConfig] = useState<GeneratorConfig>(() => {
    const fromHash = decodeState(window.location.hash);
    if (fromHash) return fromHash;
    try {
      return loadPersistedConfig();
    } catch (err) {
      return { ...defaultConfig };
    }
  });

  useEffect(() => {
    persistConfig(config);
    const encoded = encodeState(config);
    const newHash = `#${encoded}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [config]);

  return [config, setConfig];
}

export default function QrTool() {
  const [config, setConfig] = usePersistentConfig();
  const [hostInput, setHostInput] = useState('');
  const [manualUuid, setManualUuid] = useState('');
  const [manualDevice, setManualDevice] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [svgMarkup, setSvgMarkup] = useState('');
  const [validation, setValidation] = useState<ValidationResult>(validateConfig(config));
  const [transportHintNote, setTransportHintNote] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [branding, setBranding] = useState<BrandingOptions>({
    enabled: true,
    corner: 'bottom-right',
    sizePct: 0.13,
    patchPaddingPct: 0.12,
    printSafe: false,
    logoUrl: '/brand/synctimer-logo.png',
  });

  const joinUrl = useMemo(() => buildJoinUrl(config), [config]);
  const deviceNames = useMemo(() => normalizeDeviceNames(config.hosts), [config.hosts]);

  useEffect(() => {
    setValidation(validateConfig(config));
  }, [config]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setConfig((prev) => ({ ...prev, displayMode: false }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setConfig]);

  useEffect(() => {
    let alive = true;
    const logoUrl = '/brand/synctimer-logo.png';
    fetch(logoUrl)
      .then(async (response) => {
        if (!response.ok) return null;
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer.slice(0, 8));
        const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
        const valid = signature.every((byte, idx) => bytes[idx] === byte);
        return valid ? logoUrl : null;
      })
      .catch(() => null)
      .then((resolved) => {
        if (!alive) return;
        setBranding((prev) => ({ ...prev, logoUrl: resolved ?? LOGO_FALLBACK_DATA_URL }));
      });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    async function buildSvg() {
      try {
        const svg = await generateSvgMarkup(joinUrl, 320, branding);
        setSvgMarkup(svg);
      } catch (err) {
        console.error('Failed to generate QR', err);
      }
    }
    if (validation.valid) {
      buildSvg();
    } else {
      setSvgMarkup('');
    }
  }, [joinUrl, validation.valid, branding]);

  const addHosts = (newHosts: HostEntry[]) => {
    if (!newHosts.length) return;
    setConfig((prev) => {
      const merged = [...prev.hosts];
      for (const host of newHosts) {
        if (merged.some((h) => h.uuid === host.uuid)) continue;
        merged.push(host);
      }
      return { ...prev, hosts: merged };
    });
  };

  const handleParse = () => {
    const parsedJoin = parseJoinLink(hostInput.trim());
    if (parsedJoin) {
      const next: GeneratorConfig = {
        ...config,
        ...parsedJoin.config,
        hosts: parsedJoin.config.hosts || [],
        displayMode: false,
      } as GeneratorConfig;
      setConfig(next);
      if (parsedJoin.transportHintWarning) {
        setTransportHintNote('Transport hint set to bonjour for Wi-Fi mode.');
      } else {
        setTransportHintNote(null);
      }
      return;
    }
    const { hosts, join } = parseAnyInput(hostInput.trim());
    if (join && join.config.hosts) {
      setConfig((prev) => ({ ...prev, ...join.config, hosts: join.config.hosts } as GeneratorConfig));
      return;
    }
    const { errors } = parseHostShareLinks(hostInput.trim());
    if (errors.length) {
      setTransportHintNote(errors.join('\n'));
    } else {
      setTransportHintNote(null);
    }
    addHosts(hosts);
    setHostInput('');
  };

  const handleManualAdd = () => {
    if (!uuidRegex.test(manualUuid.trim())) {
      setTransportHintNote('Enter a valid UUID for manual host.');
      return;
    }
    addHosts([{ uuid: manualUuid.trim(), deviceName: manualDevice.trim() }]);
    setManualUuid('');
    setManualDevice('');
    setTransportHintNote(null);
  };

  const updateHost = (idx: number, patch: Partial<HostEntry>) => {
    setConfig((prev) => {
      const copy = [...prev.hosts];
      copy[idx] = { ...copy[idx], ...patch };
      return { ...prev, hosts: copy };
    });
  };

  const removeHost = (idx: number) => {
    setConfig((prev) => ({ ...prev, hosts: prev.hosts.filter((_, i) => i !== idx) }));
  };

  const moveHost = (idx: number, delta: number) => {
    setConfig((prev) => {
      const copy = [...prev.hosts];
      const newIndex = idx + delta;
      if (newIndex < 0 || newIndex >= copy.length) return prev;
      const [item] = copy.splice(idx, 1);
      copy.splice(newIndex, 0, item);
      return { ...prev, hosts: copy };
    });
  };

  const handleCopy = async (text: string) => {
    const ok = await copyText(text);
    setCopyMessage(ok ? 'Copied!' : 'Copy failed');
    setTimeout(() => setCopyMessage(''), 1500);
  };

  const handleCopyGeneratorLink = async () => {
    const encoded = encodeState(config);
    const url = `${window.location.origin}${window.location.pathname}#${encoded}`;
    await handleCopy(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBrandingCorner = (corner: BrandingCorner) => {
    setBranding((prev) => ({ ...prev, corner }));
  };

  const handleBrandingSize = (value: number) => {
    const clamped = clampPct(value, 0.1, 0.16);
    setBranding((prev) => ({ ...prev, sizePct: clamped, printSafe: false }));
  };

  const handlePrintSafePreset = () => {
    setBranding((prev) => ({ ...prev, enabled: true, sizePct: 0.11, printSafe: true }));
  };

  return (
    <Page className="qr-page">
      <header className="page-header">
        <div>
          <h1>QR generator</h1>
          <p>Create reliable join links and QR codes for SyncTimer sessions.</p>
        </div>
        <div className="mode-switch">
          <label>Mode</label>
          <div className="segmented">
            {(['wifi', 'nearby'] as Mode[]).map((m) => (
              <button
                key={m}
                className={config.mode === m ? 'active' : ''}
                onClick={() => setConfig({ ...config, mode: m })}
              >
                {m === 'wifi' ? 'Wi-Fi' : 'Nearby'}
              </button>
            ))}
          </div>
          <small>Wi-Fi mode always uses transport_hint=bonjour.</small>
        </div>
      </header>

      <main className="layout">
        <section className="left">
          <Step title="Step 1: Session basics">
            <div className="field">
              <label>Room label (optional)</label>
              <input
                type="text"
                value={config.roomLabel}
                onChange={(e) => setConfig({ ...config, roomLabel: e.target.value })}
                placeholder="Room 12A"
              />
            </div>
          </Step>

          <Step title="Step 2: Hosts">
            <div className="field">
              <label htmlFor="host-input">Host Share Link(s) or join link</label>
              <textarea
                id="host-input"
                rows={3}
                value={hostInput}
                onChange={(e) => setHostInput(e.target.value)}
                placeholder="Paste host share links or a join link here"
              />
              <button className="primary" onClick={handleParse}>
                Parse
              </button>
              <small>Paste multiple links separated by spaces or newlines. Join links auto-fill everything.</small>
            </div>

            <HostList
              hosts={config.hosts}
              deviceNames={deviceNames}
              onChange={updateHost}
              onRemove={removeHost}
              onMove={moveHost}
              onCopy={handleCopy}
            />

            <div className="manual">
              <button className="link" onClick={() => setShowManual(!showManual)}>
                {showManual ? 'Hide' : 'Add host manually'}
              </button>
              <AnimatePresence>
                {showManual && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="manual-grid">
                      <div className="field">
                        <label>Host UUID</label>
                        <input
                          type="text"
                          value={manualUuid}
                          onChange={(e) => setManualUuid(e.target.value)}
                          placeholder="123e4567-e89b-12d3-a456-426614174000"
                        />
                      </div>
                      <div className="field">
                        <label>Device name (optional)</label>
                        <input
                          type="text"
                          value={manualDevice}
                          onChange={(e) => setManualDevice(e.target.value)}
                          placeholder="iPad Pro"
                        />
                      </div>
                    </div>
                    <button onClick={handleManualAdd} className="secondary">
                      Add host
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Step>

          <Step title="Step 3: Compatibility">
            <div className="grid">
              <div className="field">
                <label>Minimum build</label>
                <input
                  type="number"
                  min={1}
                  value={config.minBuild || ''}
                  onChange={(e) => setConfig({ ...config, minBuild: e.target.value })}
                  placeholder="e.g. 1200"
                />
              </div>
              <div className="field">
                <label>Minimum version</label>
                <input
                  type="text"
                  value={config.minVersion || ''}
                  onChange={(e) => setConfig({ ...config, minVersion: e.target.value })}
                  placeholder="e.g. 1.2.3"
                />
              </div>
            </div>
          </Step>

          <Step title="Step 4: Output">
            <Summary checklist={validation.checklist} errors={validation.errors} />
            <div className="actions">
              <button onClick={() => setConfig({ ...config, displayMode: true })} disabled={!validation.valid}>
                Display mode
              </button>
              <button onClick={() => setConfig({ ...config, printMode: !config.printMode })}>
                {config.printMode ? 'Hide print layout' : 'Print mode preview'}
              </button>
              <button onClick={handleCopyGeneratorLink}>Copy generator link</button>
            </div>
            {transportHintNote && <div className="note">{transportHintNote}</div>}
            {copyMessage && <div className="note success">{copyMessage}</div>}
          </Step>

          <Step title="Branding">
            <div className="field toggle">
              <label htmlFor="branding-toggle">Add SyncTimer logo</label>
              <input
                id="branding-toggle"
                type="checkbox"
                checked={branding.enabled}
                onChange={(e) => setBranding((prev) => ({ ...prev, enabled: e.target.checked }))}
              />
            </div>
            <div className="field">
              <label>Corner</label>
              <div className="segmented">
                {[
                  { label: 'TL', value: 'top-left' },
                  { label: 'TR', value: 'top-right' },
                  { label: 'BL', value: 'bottom-left' },
                  { label: 'BR', value: 'bottom-right' },
                ].map((item) => (
                  <button
                    key={item.value}
                    className={branding.corner === item.value ? 'active' : ''}
                    onClick={() => handleBrandingCorner(item.value as BrandingCorner)}
                    disabled={!branding.enabled}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Logo size ({Math.round(branding.sizePct * 100)}%)</label>
              <input
                type="range"
                min={10}
                max={16}
                step={1}
                value={Math.round(branding.sizePct * 100)}
                onChange={(e) => handleBrandingSize(Number(e.target.value) / 100)}
                disabled={!branding.enabled}
              />
              <small>Range: 10–16% of QR size.</small>
            </div>
            <div className="row">
              <button onClick={handlePrintSafePreset} disabled={!branding.enabled}>
                Print-safe preset
              </button>
            </div>
          </Step>
        </section>

        <section className="right">
          <h2>Live output</h2>
          <div className="field">
            <label>Join URL</label>
            <textarea readOnly rows={3} value={joinUrl} />
            <div className="row">
              <button onClick={() => handleCopy(joinUrl)} disabled={!validation.valid}>
                Copy join URL
              </button>
              <button onClick={() => downloadSvg('synctimer-qr.svg', svgMarkup)} disabled={!validation.valid || !svgMarkup}>
                Export SVG
              </button>
              <button onClick={() => downloadPng(joinUrl, 'synctimer-qr.png', 1024, branding)} disabled={!validation.valid}>
                Export PNG
              </button>
            </div>
          </div>

          <div className="preview">
            <div className="preview-header">
              <h3>QR preview</h3>
              <span className="pill">{branding.enabled ? 'Quiet zone: boosted for logo' : 'Quiet zone: 4 modules'}</span>
            </div>
            {validation.valid ? (
              <div className="qr" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
            ) : (
              <div className="note">Fix validation to render QR.</div>
            )}
            <div className="summary">
              <p>
                Mode: <strong>{config.mode === 'wifi' ? 'Wi-Fi' : 'Nearby'}</strong> · Hosts:{' '}
                <strong>{config.hosts.length}</strong>
              </p>
              <p>Device names: {deviceNames.join(', ')}</p>
            </div>
          </div>

          {config.printMode && validation.valid && (
            <div className="print-area" id="print-area">
              <div className="label">
                <p className="room">{config.roomLabel || 'SyncTimer room'}</p>
                <p className="subtitle">Scan to join SyncTimer</p>
                <div className="qr" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
              </div>
              <div className="row">
                <button onClick={handlePrint}>Print</button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div>
          <h4>Troubleshooting</h4>
          <ul>
            <li>Ensure each host UUID is correct and unique.</li>
            <li>Transport hint is always bonjour in Wi-Fi mode for reliability.</li>
            <li>Device names are optional; blanks auto-label as Host 1…N.</li>
            <li>Use the generator link to share this setup.</li>
          </ul>
        </div>
        <div>
          <h4>Notes</h4>
          <ul>
            <li>Export SVG/PNG for print-quality QR codes.</li>
            <li>Print mode hides the rest of the page when printing.</li>
            <li>Display mode shows a full-screen QR overlay (Esc closes).</li>
          </ul>
        </div>
      </footer>

      <AnimatePresence>
        {config.displayMode && validation.valid && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfig({ ...config, displayMode: false })}
          >
            <div className="overlay-inner" onClick={(e) => e.stopPropagation()}>
              <div className="overlay-content">
                <div className="qr" dangerouslySetInnerHTML={{ __html: svgMarkup }} />
                <p className="room">{config.roomLabel || 'SyncTimer'}</p>
                <button onClick={() => setConfig({ ...config, displayMode: false })}>Close</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Page>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function HostList({
  hosts,
  deviceNames,
  onChange,
  onRemove,
  onMove,
  onCopy,
}: {
  hosts: HostEntry[];
  deviceNames: string[];
  onChange: (idx: number, patch: Partial<HostEntry>) => void;
  onRemove: (idx: number) => void;
  onMove: (idx: number, delta: number) => void;
  onCopy: (text: string) => void;
}) {
  if (!hosts.length) return <div className="note">No hosts added yet.</div>;
  return (
    <div className="host-list">
      {hosts.map((host, idx) => (
        <div key={host.uuid} className="host-row">
          <div className="field">
            <label>Device name</label>
            <input
              type="text"
              value={host.deviceName ?? ''}
              onChange={(e) => onChange(idx, { deviceName: e.target.value })}
              placeholder={deviceNames[idx]}
            />
          </div>
          <div className="field">
            <label>UUID</label>
            <input type="text" value={host.uuid} readOnly />
          </div>
          <div className="row compact">
            <button onClick={() => onCopy(host.uuid)}>Copy UUID</button>
            <button onClick={() => onMove(idx, -1)} disabled={idx === 0}>
              ↑
            </button>
            <button onClick={() => onMove(idx, 1)} disabled={idx === hosts.length - 1}>
              ↓
            </button>
            <button onClick={() => onRemove(idx)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Summary({ checklist, errors }: { checklist: ValidationResult['checklist']; errors: string[] }) {
  return (
    <div className="summary">
      <ul className="checklist">
        {checklist.map((item) => (
          <li key={item.label} className={item.ok ? 'ok' : 'bad'}>
            {item.ok ? '✔︎' : '•'} {item.label}
          </li>
        ))}
      </ul>
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function clampPct(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

const LOGO_FALLBACK_DATA_URL =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<rect width="64" height="64" rx="12" fill="#0B0F14"/>' +
      '<path d="M20 22h24v6H20zm0 14h16v6H20z" fill="#FFFFFF"/>' +
      '<circle cx="44" cy="39" r="6" fill="#FFFFFF"/>' +
    '</svg>',
  );
