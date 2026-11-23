import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Legacy/Show';

export default function Legacy_ShowPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
