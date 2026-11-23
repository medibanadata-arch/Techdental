import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Profile/Partials/UpdateProfileInformationForm';

export default function Profile_Partials_UpdateProfileInformationFormPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
