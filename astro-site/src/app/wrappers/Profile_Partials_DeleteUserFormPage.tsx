import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Profile/Partials/DeleteUserForm';

export default function Profile_Partials_DeleteUserFormPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
