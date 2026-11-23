import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Posts/Index';

export default function Posts_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
