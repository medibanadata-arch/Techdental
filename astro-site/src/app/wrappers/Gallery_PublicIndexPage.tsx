import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Gallery/PublicIndex';

export default function Gallery_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
