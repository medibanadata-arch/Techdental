import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Complaints/PublicShow';

export default function Complaints_PublicShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
