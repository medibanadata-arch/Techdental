import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Blog/PublicSingle';

export default function Blog_PublicSinglePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
