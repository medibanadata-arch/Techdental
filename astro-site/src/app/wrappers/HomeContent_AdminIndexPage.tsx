import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/HomeContent/AdminIndex';

export default function HomeContent_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
