import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Medicines/AdminEdit';

export default function Medicines_AdminEditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
