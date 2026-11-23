import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Auth/ForgotPassword';

export default function Auth_ForgotPasswordPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
