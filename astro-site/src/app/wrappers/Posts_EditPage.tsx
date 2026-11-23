import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Posts/Edit';

export default function Posts_EditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
