import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Posts/Categories';

export default function Posts_CategoriesPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
