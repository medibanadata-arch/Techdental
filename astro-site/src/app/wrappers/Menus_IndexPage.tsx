import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Menus/Index';

export default function Menus_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
