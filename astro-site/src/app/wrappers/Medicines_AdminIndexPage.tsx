import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Medicines/AdminIndex';

export default function Medicines_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
