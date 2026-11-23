import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Team/AdminIndex';

export default function Team_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
