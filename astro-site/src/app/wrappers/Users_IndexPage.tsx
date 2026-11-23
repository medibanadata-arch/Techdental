import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Users/Index';

export default function Users_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
