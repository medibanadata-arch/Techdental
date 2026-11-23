import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/BookAppointment/PublicIndex';

export default function BookAppointment_PublicIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
