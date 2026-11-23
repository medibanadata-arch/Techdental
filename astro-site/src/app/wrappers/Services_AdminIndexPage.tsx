import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Services/AdminIndex';

export default function Services_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
