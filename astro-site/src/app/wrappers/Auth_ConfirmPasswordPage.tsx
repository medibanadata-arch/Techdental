import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Auth/ConfirmPassword';

export default function Auth_ConfirmPasswordPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
