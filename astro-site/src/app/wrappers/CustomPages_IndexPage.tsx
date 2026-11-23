import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/CustomPages/Index';

export default function CustomPages_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
