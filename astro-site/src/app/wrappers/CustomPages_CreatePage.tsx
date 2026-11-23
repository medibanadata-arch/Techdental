import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/CustomPages/Create';

export default function CustomPages_CreatePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
