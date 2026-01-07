import { Link } from 'react-router-dom';
import Page from '../components/Page';

const permissionNotes = [
  'Local Network access is required for Wi-Fi mode discovery.',
  'Bluetooth is required for Nearby transport.',
  'Location is not required for SyncTimer.',
];

export default function Support() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Support</h1>
        <p>FAQ links, permissions help, and contact.</p>
      </header>

      <section className="panel">
        <h2>Permissions help</h2>
        <ul>
          {permissionNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="panel">
        <h2>FAQ</h2>
        <p>
          Visit the <Link to="/#faq">SyncTimer Q&amp;A</Link> for the latest operator answers.
        </p>
      </section>

      <section className="panel">
        <h2>Contact</h2>
        <p>support@synctimerapp.com</p>
        <p className="muted">Response time: one business day.</p>
      </section>
    </Page>
  );
}
