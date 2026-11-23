import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/CustomPages/Edit';

export default function CustomPages_EditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
