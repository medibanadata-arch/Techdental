import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Settings/AdminIndex';

export default function Settings_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
