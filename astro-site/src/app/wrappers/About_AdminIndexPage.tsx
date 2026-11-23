import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/About/AdminIndex';

export default function About_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
