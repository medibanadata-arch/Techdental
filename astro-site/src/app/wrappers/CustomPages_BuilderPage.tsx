import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/CustomPages/Builder';

export default function CustomPages_BuilderPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
