import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/FeaturedImages/Edit';

export default function FeaturedImages_EditPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
