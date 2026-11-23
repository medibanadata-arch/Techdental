import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Medicines/PublicSingle';

export default function Medicines_PublicSinglePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
