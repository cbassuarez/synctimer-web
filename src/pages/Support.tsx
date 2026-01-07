import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Page from '../components/Page';

type Playbook = {
  id: string;
  title: string;
  outcome: string;
  steps: string[];
  fails: string[];
  tags: string[];
  glossary?: { label: string; action: string }[];
};

type FilterOption = { label: string; value: string; tag: string };

type TriageSelections = {
  issue: string;
  platform: string;
  transport: string;
  role: string;
};

const playbooks: Playbook[] = [
  {
    id: 'join-qr',
    title: 'Join by QR (App Clip + installed)',
    outcome: 'Join a running sync room quickly via QR, without opening a dead web page.',
    steps: [
      'On the host, open Sync and make sure the QR is visible.',
      'Scan with the iOS Camera or in-app scanner; you should see an App Clip or the full app open.',
      'If Safari opens or you see a 404 page, rescan using the Camera and keep the QR fully in frame.',
      'If the App Clip is unavailable in your region, install the full app and rescan.',
      'For printed codes, use a 3–4 inch square, matte finish, and avoid glare or extreme angles.',
      'Keep the scan distance under 1 meter and steady for 1–2 seconds.',
    ],
    fails: [
      'Ask the host to refresh the QR by reopening Sync.',
      'Try scanning on a different device to rule out camera issues.',
      'Switch to Nearby and join manually if Wi-Fi is unreliable.',
    ],
    tags: [
      'qr',
      'app clip',
      'install',
      'ios',
      'camera',
      'platform:ios',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'wifi-bonjour',
    title: 'Wi-Fi (Bonjour-first)',
    outcome: 'Discover and connect to the host over Wi-Fi using Bonjour discovery.',
    steps: [
      'Confirm every device is on the same SSID and captive portals are cleared.',
      'Allow Local Network permissions for SyncTimer in iOS/macOS Settings.',
      'Open Sync on the host first, then open Sync on the joining devices.',
      'If the host list is empty, pull-to-refresh or rescan the QR to rebuild discovery.',
      'Allow multicast on the router if possible and avoid guest networks.',
      'If connected but drifting, move closer to the router and reduce Wi-Fi load.',
    ],
    fails: [
      'Reboot the access point and re-open Sync on all devices.',
      'Switch to Nearby transport for the rehearsal session.',
      'Check that VPNs or firewall profiles are disabled on the network.',
    ],
    tags: [
      'wifi',
      'bonjour',
      'local network',
      'router',
      'ssid',
      'transport:wifi',
      'platform:ios',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'nearby-bluetooth',
    title: 'Nearby (Bluetooth)',
    outcome: 'Connect using Bluetooth discovery when no Wi-Fi infrastructure is available.',
    steps: [
      'Turn Bluetooth on for every device and grant Nearby permissions.',
      'Open Sync on the host first, then open Sync on joining devices.',
      'Keep devices within 10–12 meters and maintain line-of-sight when possible.',
      'Avoid RF-heavy environments (wireless mics, lighting control, dense backstage).',
      'If discovery stalls, toggle Bluetooth off/on and refresh the host list.',
    ],
    fails: [
      'Restart Bluetooth on all devices and retry within 1 meter.',
      'Ensure no device is in Airplane Mode with Bluetooth disabled.',
      'Switch to Wi-Fi if a stable network is available.',
    ],
    tags: [
      'nearby',
      'bluetooth',
      'permissions',
      'transport:nearby',
      'platform:ios',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'drift-status',
    title: 'Drift / status semantics',
    outcome: 'Interpret Sync status chips quickly and take the correct next action.',
    steps: [
      'Use the status chip as the source of truth before changing settings.',
      'If you see repeated reconnects, reset the transport before rehearsing.',
      'Confirm every device shows the same transport mode.',
      'If drift persists, rebuild the room by rescanning the QR.',
    ],
    fails: [
      'Switch transports (Wi-Fi ↔ Nearby) for a clean session.',
      'Force quit and reopen SyncTimer on all devices.',
    ],
    glossary: [
      { label: 'Connected', action: 'Stay in Sync view; no action needed.' },
      { label: 'Searching', action: 'Wait 5–10 seconds or refresh host list.' },
      { label: 'Connecting', action: 'Keep the app open; avoid backgrounding.' },
      { label: 'Drift OK', action: 'Timers are within tolerance; continue.' },
      { label: 'Drift high / unstable', action: 'Rescan QR or reset the transport.' },
      { label: 'Not available (mode mismatch)', action: 'Match transport mode across devices.' },
    ],
    tags: [
      'drift',
      'status',
      'connected',
      'searching',
      'connecting',
      'unstable',
      'platform:ios',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'cue-sheets',
    title: 'Cue sheets',
    outcome: 'Ensure cues fire when expected and media events appear correctly.',
    steps: [
      'Confirm the cue sheet is assigned to the active sync room.',
      'Verify the timeline starts at 00:00 and events are within the active range.',
      'If media events are missing, re-import the file and check file type support.',
      'For exports, ensure you are using the latest SyncTimer version on both ends.',
      'Restart the countdown after edits to refresh cue evaluation.',
    ],
    fails: [
      'Re-import the cue sheet from a clean copy.',
      'Remove and re-add media assets to clear cached metadata.',
      'Try a smaller cue sheet to isolate a corrupt row.',
    ],
    tags: [
      'cue sheets',
      'media',
      'import',
      'export',
      'events',
      'platform:ios',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'countdown-first',
    title: 'Countdown-first',
    outcome: 'Start clean countdowns and understand numpad resume/restart behavior.',
    steps: [
      'Enter the target time with the numpad; it fills right-to-left (SS → MM → HH).',
      'Press Start to begin; Pause retains the current countdown position.',
      'Restart resets the timer to the last entered value.',
      'If a countdown resumes unexpectedly, clear and re-enter the time.',
    ],
    fails: [
      'Force quit SyncTimer and re-open before rehearsal.',
      'Use a shorter countdown to validate the workflow.',
    ],
    tags: [
      'countdown',
      'numpad',
      'resume',
      'restart',
      'rehearsal',
      'platform:ios',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'mac-support',
    title: 'Mac support',
    outcome: 'Resolve Catalyst-specific quirks and macOS permission prompts.',
    steps: [
      'Allow Bluetooth and Local Network access in System Settings → Privacy & Security.',
      'Keep the app window visible; minimized windows can pause discovery.',
      'If input feels off, disable Full Screen and resize the window manually.',
      'For trackpad issues, use keyboard shortcuts to start/stop the timer.',
    ],
    fails: [
      'Restart the Mac after changing permissions.',
      'Switch to iOS for rehearsal-critical sessions.',
    ],
    tags: [
      'mac',
      'catalyst',
      'permissions',
      'window',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
  {
    id: 'install-builds',
    title: 'Install / builds',
    outcome: 'Choose the right build channel and refresh universal links.',
    steps: [
      'App Store builds are stable; TestFlight builds may include newer fixes.',
      'Install TestFlight, accept the invite, and install the SyncTimer build.',
      'On macOS, enable TestFlight in the Mac App Store and open the beta build.',
      'If links still open in Safari, open the app, then re-scan or tap the link again.',
      'For stuck universal links, clear Safari history for synctimer.app and retry.',
    ],
    fails: [
      'Delete and reinstall the app to refresh universal links.',
      'Ensure the device date/time is set automatically.',
    ],
    tags: [
      'install',
      'testflight',
      'app store',
      'build',
      'universal link',
      'platform:ios',
      'platform:mac',
      'channel:app-store',
      'channel:testflight',
      'version:v1',
      'version:v2',
    ],
  },
];

const tocSections = [
  { id: 'start-here', label: 'Start here' },
  { id: 'quick-fixes', label: 'Quick fixes' },
  { id: 'playbooks', label: 'Playbooks' },
  { id: 'known-issues', label: 'Known issues' },
  { id: 'recently-fixed', label: 'Recently fixed' },
  { id: 'diagnostics', label: 'Diagnostics' },
];

const filterOptions: Record<'version' | 'platform' | 'channel', FilterOption[]> = {
  version: [
    { label: 'v1.x', value: 'v1', tag: 'version:v1' },
    { label: 'v2.x', value: 'v2', tag: 'version:v2' },
  ],
  platform: [
    { label: 'iOS', value: 'ios', tag: 'platform:ios' },
    { label: 'macOS', value: 'mac', tag: 'platform:mac' },
  ],
  channel: [
    { label: 'App Store', value: 'app-store', tag: 'channel:app-store' },
    { label: 'TestFlight', value: 'testflight', tag: 'channel:testflight' },
  ],
};

const triageOptions = {
  issues: [
    { label: 'Join by QR', value: 'join-qr' },
    { label: "Can’t connect / drifting", value: 'connect-drift' },
    { label: 'Bluetooth permission / Nearby', value: 'nearby-permission' },
    { label: 'Wi-Fi / Bonjour', value: 'wifi-bonjour' },
    { label: 'Cue sheets', value: 'cue-sheets' },
    { label: 'Countdown / numpad', value: 'countdown-first' },
    { label: 'Mac issues', value: 'mac-support' },
    { label: 'Install / TestFlight', value: 'install-builds' },
  ],
  platforms: [
    { label: 'iPhone / iPad', value: 'ios' },
    { label: 'Mac', value: 'mac' },
  ],
  transports: [
    { label: 'Wi-Fi', value: 'wifi' },
    { label: 'Nearby', value: 'nearby' },
  ],
  roles: [{ label: 'Equal peers', value: 'peers' }],
};

const knownIssues = [
  // TODO: replace placeholder entries with real issues.
  {
    title: 'Placeholder: Discovery stalls on dense networks',
    symptom: 'Hosts do not appear for 20–30 seconds on crowded Wi-Fi.',
    workaround: 'Switch to Nearby for rehearsal, or reboot the router before call.',
    fixedIn: 'Planned',
  },
  {
    title: 'Placeholder: App Clip not offered on older devices',
    symptom: 'Camera scan opens Safari instead of the App Clip card.',
    workaround: 'Install the full app or scan from the in-app scanner.',
    fixedIn: 'Planned',
  },
  {
    title: 'Placeholder: Cue sheet media events missing',
    symptom: 'Audio cues do not show in the event list after import.',
    workaround: 'Re-import with supported file types and restart SyncTimer.',
    fixedIn: 'Planned',
  },
];

const recentlyFixed = [
  'Placeholder: Improved QR scan reliability under low light.',
  'Placeholder: Reduced drift after reconnecting on Wi-Fi.',
  'Placeholder: Fixed TestFlight install prompt on macOS.',
  'Placeholder: Resolved cue sheet export naming mismatch.',
  'Placeholder: Improved Nearby discovery timing for iPhone 12.',
];

function getRecommendations(selections: TriageSelections) {
  if (!selections.issue) {
    return [];
  }

  if (selections.issue === 'join-qr') {
    return ['join-qr', 'install-builds'];
  }

  if (selections.issue === 'connect-drift') {
    const transportId = selections.transport === 'nearby' ? 'nearby-bluetooth' : 'wifi-bonjour';
    return [transportId, 'drift-status'];
  }

  if (selections.issue === 'nearby-permission') {
    return ['nearby-bluetooth', 'mac-support'];
  }

  if (selections.issue === 'wifi-bonjour') {
    return ['wifi-bonjour'];
  }

  if (selections.issue === 'cue-sheets') {
    return ['cue-sheets'];
  }

  if (selections.issue === 'countdown-first') {
    return ['countdown-first'];
  }

  if (selections.issue === 'mac-support') {
    return ['mac-support', 'install-builds'];
  }

  if (selections.issue === 'install-builds') {
    return ['install-builds', 'join-qr'];
  }

  return [];
}

export default function Support() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ version: '', platform: '', channel: '' });
  const [triageStep, setTriageStep] = useState(1);
  const [triageSelections, setTriageSelections] = useState<TriageSelections>({
    issue: '',
    platform: '',
    transport: '',
    role: '',
  });
  const [checkedPlaybooks, setCheckedPlaybooks] = useState<string[]>([]);

  const filteredPlaybooks = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    const activeTags = Object.entries(filters)
      .filter(([, value]) => value)
      .map(([key, value]) => {
        const option = filterOptions[key as keyof typeof filterOptions].find((item) => item.value === value);
        return option?.tag ?? '';
      })
      .filter(Boolean);

    return playbooks.filter((playbook) => {
      const searchText = [
        playbook.title,
        playbook.outcome,
        playbook.steps.join(' '),
        playbook.fails.join(' '),
        playbook.tags.join(' '),
        playbook.glossary?.map((item) => `${item.label} ${item.action}`).join(' ') ?? '',
      ]
        .join(' ')
        .toLowerCase();

      const matchesSearch = !normalizedQuery || searchText.includes(normalizedQuery);
      const matchesTags = activeTags.every((tag) => playbook.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  }, [filters, search]);

  const recommendedIds = useMemo(() => getRecommendations(triageSelections), [triageSelections]);
  const recommendedPlaybooks = useMemo(
    () => playbooks.filter((playbook) => recommendedIds.includes(playbook.id)),
    [recommendedIds]
  );

  const mailtoSubject = `SyncTimer Support — ${triageSelections.transport || '[Mode]'} — ${
    triageSelections.platform || '[Platform]'
  } — ${filters.version || 'vX.Y'} (build Z)`;
  const mailtoHref = `mailto:support@stagedevices.com?subject=${encodeURIComponent(mailtoSubject)}`;

  const handleFilterToggle = (key: 'version' | 'platform' | 'channel', value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: current[key] === value ? '' : value,
    }));
  };

  const handleTriageSelect = (key: keyof TriageSelections, value: string) => {
    setTriageSelections((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const toggleCheckedPlaybook = (id: string) => {
    setCheckedPlaybooks((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const canAdvanceToStep3 = triageSelections.platform && triageSelections.transport && triageSelections.role;

  return (
    <Page className="support">
      <header className="support-header">
        <div className="support-header__copy">
          <h1>Support</h1>
          <p>Operator manual + decision system for live SyncTimer rooms.</p>
          <div className="support-links">
            <Link className="text-link" to="/qr">
              Generate Join QR
            </Link>
            <Link className="text-link" to="/app-clip">
              App Clip guide
            </Link>
            <a className="text-link" href="#wifi-bonjour">
              Sync (Wi-Fi vs Nearby)
            </a>
            <a className="text-link" href="#cue-sheets">
              Cue sheets
            </a>
          </div>
        </div>
        <div className="support-search">
          <label htmlFor="support-search">Search topics</label>
          <input
            id="support-search"
            type="search"
            placeholder="Search topics (e.g., join QR, Wi-Fi, Bluetooth, drift, cue sheets)"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      <section className="panel support-filters">
        <div className="support-filters__group" role="group" aria-label="App version filter">
          <span className="support-filters__label">App version</span>
          {filterOptions.version.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip chip-button ${filters.version === option.value ? 'accent' : ''}`.trim()}
              aria-pressed={filters.version === option.value}
              onClick={() => handleFilterToggle('version', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="support-filters__group" role="group" aria-label="Platform filter">
          <span className="support-filters__label">Platform</span>
          {filterOptions.platform.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip chip-button ${filters.platform === option.value ? 'accent' : ''}`.trim()}
              aria-pressed={filters.platform === option.value}
              onClick={() => handleFilterToggle('platform', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="support-filters__group" role="group" aria-label="Build channel filter">
          <span className="support-filters__label">Build channel</span>
          {filterOptions.channel.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`chip chip-button ${filters.channel === option.value ? 'accent' : ''}`.trim()}
              aria-pressed={filters.channel === option.value}
              onClick={() => handleFilterToggle('channel', option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <div className="support-layout">
        <aside className="support-toc">
          <p className="support-toc__title">On this page</p>
          <ul>
            {tocSections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.label}</a>
              </li>
            ))}
            {playbooks.map((playbook) => (
              <li key={playbook.id}>
                <a href={`#${playbook.id}`}>{playbook.title}</a>
              </li>
            ))}
          </ul>
        </aside>

        <div className="support-main">
          <div className="support-main-grid">
            <section id="start-here" className="panel support-main-section">
              <header className="support-section-header">
                <h2>Start here (60s triage)</h2>
                <p>Answer three quick prompts to surface the right playbook.</p>
              </header>

              <div className="support-steps">
                <button
                  type="button"
                  className={`support-step ${triageStep === 1 ? 'active' : ''}`}
                  onClick={() => setTriageStep(1)}
                >
                  Step 1
                </button>
                <button
                  type="button"
                  className={`support-step ${triageStep === 2 ? 'active' : ''}`}
                  onClick={() => setTriageStep(2)}
                  disabled={!triageSelections.issue}
                >
                  Step 2
                </button>
                <button
                  type="button"
                  className={`support-step ${triageStep === 3 ? 'active' : ''}`}
                  onClick={() => setTriageStep(3)}
                  disabled={!canAdvanceToStep3}
                >
                  Step 3
                </button>
              </div>

              {triageStep === 1 && (
                <div className="support-step-panel">
                  <h3>What’s happening?</h3>
                  <div className="support-option-grid">
                    {triageOptions.issues.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`support-option ${triageSelections.issue === option.value ? 'active' : ''}`}
                        onClick={() => {
                          handleTriageSelect('issue', option.value);
                          setTriageStep(2);
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {triageStep === 2 && (
                <div className="support-step-panel">
                  <h3>Your setup</h3>
                  <div className="support-option-group">
                    <p className="support-option-label">Platform</p>
                    <div className="support-option-row">
                      {triageOptions.platforms.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`support-option ${triageSelections.platform === option.value ? 'active' : ''}`}
                          onClick={() => handleTriageSelect('platform', option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="support-option-group">
                    <p className="support-option-label">Transport</p>
                    <div className="support-option-row">
                      {triageOptions.transports.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`support-option ${triageSelections.transport === option.value ? 'active' : ''}`}
                          onClick={() => handleTriageSelect('transport', option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="support-option-group">
                    <p className="support-option-label">Role</p>
                    <div className="support-option-row">
                      {triageOptions.roles.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`support-option ${triageSelections.role === option.value ? 'active' : ''}`}
                          onClick={() => handleTriageSelect('role', option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="support-step-actions">
                    <button
                      type="button"
                      className="button secondary"
                      onClick={() => setTriageStep(1)}
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      className="button primary"
                      onClick={() => setTriageStep(3)}
                      disabled={!canAdvanceToStep3}
                    >
                      See recommendations
                    </button>
                  </div>
                </div>
              )}

              {triageStep === 3 && (
                <div className="support-step-panel">
                  <h3>Do this now</h3>
                  {recommendedPlaybooks.length > 0 ? (
                    <div className="support-recommendations">
                      <p className="support-recommendations__label">Recommended playbook(s)</p>
                      {recommendedPlaybooks.map((playbook) => (
                        <label key={playbook.id} className="support-recommendation">
                          <input
                            type="checkbox"
                            checked={checkedPlaybooks.includes(playbook.id)}
                            onChange={() => toggleCheckedPlaybook(playbook.id)}
                          />
                          <span>
                            <a href={`#${playbook.id}`}>{playbook.title}</a>
                            <span className="support-recommendation__hint">
                              <a href={`#${playbook.id}-fails`}>If this fails</a>
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="muted">Select a Step 1 issue and Step 2 setup to see recommendations.</p>
                  )}
                  <div className="support-step-actions">
                    <button type="button" className="button secondary" onClick={() => setTriageStep(2)}>
                      Back
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section id="quick-fixes" className="panel support-quick-fixes">
              <header className="support-section-header">
                <h2>Quick fixes</h2>
                <p>Fast checks before deeper troubleshooting.</p>
              </header>
              <ul className="support-checklist">
                <li>Same network (Wi-Fi mode): both devices on the same SSID; captive portals off.</li>
                <li>Bluetooth on (Nearby mode): Bluetooth enabled; permission granted.</li>
                <li>App open + Sync view visible on both devices.</li>
                <li>Move closer (Nearby), or move to stronger Wi-Fi (Wi-Fi mode).</li>
                <li>If nothing: force quit SyncTimer on both devices → reopen.</li>
              </ul>
            </section>

            <section id="playbooks" className="support-main-section">
              <header className="support-section-header">
                <h2>Playbooks</h2>
                <p>Search and filters apply here. Each playbook includes a fallback checklist.</p>
              </header>

              <div className="support-playbooks">
                {filteredPlaybooks.map((playbook) => (
                  <section key={playbook.id} id={playbook.id} className="panel support-playbook">
                    <h3>{playbook.title}</h3>
                    <p className="support-outcome">{playbook.outcome}</p>
                    {playbook.glossary ? (
                      <ul className="support-glossary">
                        {playbook.glossary.map((item) => (
                          <li key={item.label}>
                            <span className="chip">{item.label}</span>
                            <span>{item.action}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ol>
                        {playbook.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    )}
                    <details id={`${playbook.id}-fails`} className="support-details">
                      <summary>If this fails</summary>
                      <ul>
                        {playbook.fails.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </details>
                  </section>
                ))}
                {filteredPlaybooks.length === 0 && (
                  <p className="muted">No playbooks match the current search and filters.</p>
                )}
              </div>
            </section>

            <section id="known-issues" className="support-main-section">
              <header className="support-section-header">
                <h2>Known issues</h2>
                <p>Tracked issues with temporary workarounds.</p>
              </header>
              <div className="support-cards">
                {knownIssues.map((issue) => (
                  <article key={issue.title} className="panel support-card">
                    <h3>{issue.title}</h3>
                    <p>
                      <strong>Symptom:</strong> {issue.symptom}
                    </p>
                    <p>
                      <strong>Workaround:</strong> {issue.workaround}
                    </p>
                    <p className="muted">
                      <strong>Fixed in:</strong> {issue.fixedIn}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section id="recently-fixed" className="support-main-section">
              <header className="support-section-header">
                <h2>Recently fixed</h2>
                <p>Recent stability improvements and resolved issues.</p>
              </header>
              <ul className="support-list">
                {recentlyFixed.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="diagnostics" className="support-main-section">
              <header className="support-section-header">
                <h2>Diagnostics</h2>
                <p>Before contacting support, collect this information.</p>
              </header>
              <ul className="support-list">
                <li>App version/build</li>
                <li>Platform + OS version</li>
                <li>Mode (Wi-Fi/Nearby)</li>
                <li>What you expected vs what happened</li>
              </ul>
              <p className="muted">
                Export diagnostics: If available in your build, use the diagnostics export in Settings → Support and
                attach the file to your email.
              </p>
              <a className="button primary" href={mailtoHref}>
                Contact Support
              </a>
            </section>
          </div>
        </div>
      </div>
    </Page>
  );
}
