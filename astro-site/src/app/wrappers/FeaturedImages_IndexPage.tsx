import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/FeaturedImages/Index';

export default function FeaturedImages_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
