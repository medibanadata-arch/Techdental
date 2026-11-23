import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Team/AdminEdit';

export default function Team_AdminEditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
