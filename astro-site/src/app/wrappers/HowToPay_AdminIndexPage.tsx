import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/HowToPay/AdminIndex';

export default function HowToPay_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
