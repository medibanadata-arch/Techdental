import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Auth/Register';

export default function Auth_RegisterPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
