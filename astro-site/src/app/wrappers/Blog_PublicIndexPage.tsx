import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Blog/PublicIndex';

export default function Blog_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
