import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Branch/PublicShow';

export default function Branch_PublicShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
