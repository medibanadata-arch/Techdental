import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Team/PublicIndex';

export default function Team_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
