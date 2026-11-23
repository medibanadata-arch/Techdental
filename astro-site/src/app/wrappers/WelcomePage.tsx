import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Welcome';

export default function WelcomePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
