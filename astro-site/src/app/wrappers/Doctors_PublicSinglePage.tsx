import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Doctors/PublicSingle';

export default function Doctors_PublicSinglePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
