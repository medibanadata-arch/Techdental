import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Doctors/PublicIndex';

export default function Doctors_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
