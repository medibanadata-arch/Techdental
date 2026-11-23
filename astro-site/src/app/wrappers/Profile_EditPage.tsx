import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Profile/Edit';

export default function Profile_EditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
