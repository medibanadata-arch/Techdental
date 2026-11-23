import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/PatientRights/PublicShow';

export default function PatientRights_PublicShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
