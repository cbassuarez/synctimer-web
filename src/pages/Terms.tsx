import Page from '../components/Page';

export default function Terms() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Terms</h1>
        <p>Standard operating terms for SyncTimer usage.</p>
      </header>
      <section className="panel">
        <h2>Usage</h2>
        <p>SyncTimer is provided as-is for rehearsal and performance timing. Use at your own discretion.</p>
      </section>
      <section className="panel">
        <h2>Liability</h2>
        <p>Stage Devices is not responsible for production delays or equipment damage.</p>
      </section>
    </Page>
  );
}
