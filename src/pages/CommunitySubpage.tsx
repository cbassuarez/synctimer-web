import { Link, useParams } from 'react-router-dom';
import Page from '../components/Page';

const copy: Record<string, { title: string; body: string }> = {
  discord: {
    title: 'Discord',
    body: 'Operator chat, patch notes, and quick troubleshooting with the SyncTimer community.',
  },
  workshops: {
    title: 'Workshops',
    body: 'Schedule a rehearsal walkthrough to tune transports, cues, and device roles.',
  },
  showcase: {
    title: 'Showcase',
    body: 'See ensembles using cue sheets, rehearsal marks, and SyncTimer scores.',
  },
};

export default function CommunitySubpage() {
  const { slug } = useParams();
  const entry = (slug && copy[slug]) || {
    title: 'Community',
    body: 'This community page is getting ready. Check back soon for updates.',
  };

  return (
    <Page className="stack">
      <header className="page-header">
        <h1>{entry.title}</h1>
        <p>{entry.body}</p>
      </header>
      <section className="panel">
        <p className="muted">Placeholder content. More details will land here soon.</p>
        <Link className="text-link" to="/community">
          Back to Community →
        </Link>
      </section>
    </Page>
  );
}
