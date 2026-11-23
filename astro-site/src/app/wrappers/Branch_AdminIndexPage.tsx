import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Branch/AdminIndex';

export default function Branch_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
