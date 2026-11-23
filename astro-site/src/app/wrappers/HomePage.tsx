import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Home';

export default function HomePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
