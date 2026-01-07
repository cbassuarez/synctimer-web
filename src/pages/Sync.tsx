import Page from '../components/Page';
import Section from '../components/Section';

export default function Sync() {
  return (
    <Page>
      <header className="page-header">
        <h1>Sync transport + drift</h1>
        <p>Operational guidance for keeping a room aligned.</p>
      </header>

      <Section
        eyebrow="Transports"
        title="Wi-Fi Bonjour"
        description="Preferred when a managed Wi-Fi network is available. Long range, stable routing."
      >
        <ul>
          <li>All devices on the same SSID.</li>
          <li>Transport hint locked to bonjour for reliability.</li>
          <li>Allow multicast on the router if possible.</li>
        </ul>
      </Section>

      <Section
        eyebrow="Transports"
        title="Nearby"
        description="Use when there is no network infrastructure. Best for tight rehearsal rooms."
      >
        <ul>
          <li>Keep devices within 10–12 meters.</li>
          <li>Avoid RF-heavy rooms (wireless mics, lighting control).</li>
          <li>Expect slower discovery on older devices.</li>
        </ul>
      </Section>

      <Section
        eyebrow="Drift"
        title="Troubleshooting drift"
        description="If timers diverge, verify the transport and host selection first."
      >
        <ol>
          <li>Confirm all clients show “Phase lock stable.”</li>
          <li>Re-scan the QR to rebuild the host list.</li>
          <li>If on Wi-Fi, reboot the access point before rehearsal.</li>
        </ol>
      </Section>
    </Page>
  );
}
