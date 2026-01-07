import Page from '../components/Page';

export default function Privacy() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Privacy</h1>
        <p>SyncTimer stores only the data required to operate timers in a room.</p>
      </header>
      <section className="panel">
        <h2>Data handling</h2>
        <p>No account required. Session data remains on-device and is cleared after the session ends.</p>
      </section>
      <section className="panel">
        <h2>Contact</h2>
        <p>privacy@stagedevices.com</p>
      </section>
    </Page>
  );
}
