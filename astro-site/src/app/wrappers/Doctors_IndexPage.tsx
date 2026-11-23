import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Doctors/Index';

export default function Doctors_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
