import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Auth/ResetPassword';

export default function Auth_ResetPasswordPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
