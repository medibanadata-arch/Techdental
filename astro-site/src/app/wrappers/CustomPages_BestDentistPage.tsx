import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/CustomPages/BestDentist';

export default function CustomPages_BestDentistPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
