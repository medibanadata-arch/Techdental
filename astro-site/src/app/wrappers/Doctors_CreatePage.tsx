import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Doctors/Create';

export default function Doctors_CreatePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
