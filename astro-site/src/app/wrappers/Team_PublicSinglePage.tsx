import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Team/PublicSingle';

export default function Team_PublicSinglePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
