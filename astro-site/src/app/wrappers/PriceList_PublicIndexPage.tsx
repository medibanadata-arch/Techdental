import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/PriceList/PublicIndex';

export default function PriceList_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
