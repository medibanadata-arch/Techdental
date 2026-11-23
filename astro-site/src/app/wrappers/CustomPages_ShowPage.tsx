import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/CustomPages/Show';

export default function CustomPages_ShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
