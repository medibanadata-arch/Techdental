import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Doctors/Edit';

export default function Doctors_EditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
