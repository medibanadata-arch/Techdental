import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Profile/Partials/UpdatePasswordForm';

export default function Profile_Partials_UpdatePasswordFormPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
