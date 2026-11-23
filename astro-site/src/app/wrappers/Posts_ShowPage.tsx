import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Posts/Show';

export default function Posts_ShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
