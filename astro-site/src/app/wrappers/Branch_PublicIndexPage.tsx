import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Branch/PublicIndex';

export default function Branch_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
