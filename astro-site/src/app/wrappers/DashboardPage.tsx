import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Dashboard';

export default function DashboardPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
