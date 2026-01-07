import Page from '../components/Page';

export default function Press() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Press kit</h1>
        <p>Assets and contact for SyncTimer announcements.</p>
      </header>
      <section className="panel">
        <h2>Press assets</h2>
        <ul>
          <li>Product screenshots (coming soon)</li>
          <li>Logo pack (SVG, EPS)</li>
          <li>Fact sheet</li>
        </ul>
      </section>
      <section className="panel">
        <h2>Contact</h2>
        <p>press@stagedevices.com</p>
      </section>
    </Page>
  );
}
