import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/PriceList/AdminIndex';

export default function PriceList_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
