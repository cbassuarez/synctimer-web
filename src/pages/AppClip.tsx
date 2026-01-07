import Page from '../components/Page';

export default function AppClip() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>App Clip deployment</h1>
        <p>Place a QR code at each rehearsal room door. Scan to join the active SyncTimer room.</p>
      </header>

      <section className="panel">
        <h2>Recommended placement</h2>
        <ul>
          <li>Print on matte stock; 3–4 inch square.</li>
          <li>Mount at eye level within two meters of the door.</li>
          <li>Keep a spare copy in the stage manager kit.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>What happens after scan</h2>
        <p>
          The QR opens the SyncTimer App Clip and joins the room immediately. If the host list changes, reprint the
          QR label from the generator.
        </p>
        <p className="muted">Join links are stable and do not expose internal service endpoints.</p>
      </section>
    </Page>
  );
}
