import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Redirects/Index';

export default function Redirects_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
