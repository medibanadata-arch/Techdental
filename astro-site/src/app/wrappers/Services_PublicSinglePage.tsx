import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Services/PublicSingle';

export default function Services_PublicSinglePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
