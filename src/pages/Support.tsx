import Page from '../components/Page';

const faqs = [
  {
    q: 'Why did a device fall out of sync?',
    a: 'Most drift events come from transport mismatch or a sleeping device. Rejoin with the QR and verify phase lock.',
  },
  {
    q: 'Which permissions are required?',
    a: 'Local network access is required for Wi-Fi mode. Bluetooth is used for Nearby. Location is not required.',
  },
  {
    q: 'What are the boring failure states?',
    a: 'Invalid host UUID, duplicate host, or incompatible minimum build/version. The app surfaces each before start.',
  },
];

export default function Support() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Support</h1>
        <p>FAQ and operational checklist.</p>
      </header>

      <section className="panel">
        <h2>Pre-flight checklist</h2>
        <ul>
          <li>Confirm host devices show “Phase lock stable.”</li>
          <li>Verify transport mode matches the room setup.</li>
          <li>Keep devices on power during long rehearsals.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>FAQ</h2>
        <div className="faq">
          {faqs.map((item) => (
            <div key={item.q}>
              <p className="faq-q">{item.q}</p>
              <p className="faq-a">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Contact</h2>
        <p>support@synctimerapp.com</p>
        <p className="muted">Response time: one business day.</p>
      </section>
    </Page>
  );
}
