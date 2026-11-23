import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Auth/VerifyEmail';

export default function Auth_VerifyEmailPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
