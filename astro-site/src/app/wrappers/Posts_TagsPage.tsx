import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Posts/Tags';

export default function Posts_TagsPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
