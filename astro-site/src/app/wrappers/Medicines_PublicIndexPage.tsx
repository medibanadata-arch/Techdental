import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Medicines/PublicIndex';

export default function Medicines_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
