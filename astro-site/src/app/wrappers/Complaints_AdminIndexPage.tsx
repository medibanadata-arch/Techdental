import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Complaints/AdminIndex';

export default function Complaints_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
