import Page from '../components/Page';

export default function CueSheets() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Cue sheets</h1>
        <p>Design a cue list once, then align it to the master clock.</p>
      </header>

      <section className="panel">
        <h2>Overview</h2>
        <p>Cue sheets align each event to a known timestamp. Operators focus on timing, not typing.</p>
        <ul>
          <li>Import CSV from stage management tools.</li>
          <li>Reorder cues while the timer remains locked.</li>
          <li>Export PDF for print.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Examples</h2>
        <div className="cue-grid">
          <div>
            <p className="cue-label">Cue 04</p>
            <p className="cue-time">00:02:45</p>
            <p className="muted">Standby: Lighting preset 6</p>
          </div>
          <div>
            <p className="cue-label">Cue 11</p>
            <p className="cue-time">00:07:10</p>
            <p className="muted">Audio track A</p>
          </div>
          <div>
            <p className="cue-label">Cue 19</p>
            <p className="cue-time">00:12:30</p>
            <p className="muted">Scene change</p>
          </div>
        </div>
      </section>
    </Page>
  );
}
