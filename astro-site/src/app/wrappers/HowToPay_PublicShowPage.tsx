import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/HowToPay/PublicShow';

export default function HowToPay_PublicShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
