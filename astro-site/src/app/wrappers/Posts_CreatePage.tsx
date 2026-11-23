import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Posts/Create';

export default function Posts_CreatePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
