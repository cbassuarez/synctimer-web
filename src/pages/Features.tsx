import Page from '../components/Page';

const features = [
  { id: 'phase-lock', title: 'Phase lock', body: 'Maintains sub-frame alignment across devices.' },
  { id: 'qr-join', title: 'QR join', body: 'Scan and join a host list without typing.' },
  { id: 'cue-sheets', title: 'Cue sheets', body: 'Run timed cues tied to the master clock.' },
  { id: 'export', title: 'Export + print', body: 'Generate print-grade QR labels and run sheets.' },
  { id: 'transport', title: 'Transport modes', body: 'Wi-Fi Bonjour or Nearby with explicit hints.' },
];

export default function Features() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Features</h1>
        <p>Index of core capabilities for SyncTimer operators.</p>
      </header>
      <div className="feature-index">
        {features.map((feature) => (
          <a key={feature.id} href={`#${feature.id}`} className="panel feature-card">
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </a>
        ))}
      </div>
      {features.map((feature) => (
        <section key={feature.id} id={feature.id} className="panel feature-detail">
          <h2>{feature.title}</h2>
          <p>{feature.body}</p>
          <p className="muted">Reference: use this feature in rehearsal mode for stable results.</p>
        </section>
      ))}
    </Page>
  );
}
