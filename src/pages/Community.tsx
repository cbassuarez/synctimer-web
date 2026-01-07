import { Link } from 'react-router-dom';
import Page from '../components/Page';

const communityLinks = [
  { slug: 'discord', title: 'Discord', description: 'Join the operator chat and patch notes.' },
  { slug: 'workshops', title: 'Workshops', description: 'Schedule a SyncTimer rehearsal walkthrough.' },
  { slug: 'showcase', title: 'Showcase', description: 'See how ensembles score with SyncTimer.' },
];

export default function Community() {
  return (
    <Page className="stack">
      <header className="page-header">
        <h1>Community</h1>
        <p>Stay connected with the Stage Devices operator network.</p>
      </header>
      <div className="feature-index">
        {communityLinks.map((item) => (
          <Link key={item.slug} to={`/community/${item.slug}`} className="panel feature-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </Link>
        ))}
      </div>
    </Page>
  );
}
