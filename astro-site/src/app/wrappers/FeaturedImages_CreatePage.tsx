import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/FeaturedImages/Create';

export default function FeaturedImages_CreatePage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
