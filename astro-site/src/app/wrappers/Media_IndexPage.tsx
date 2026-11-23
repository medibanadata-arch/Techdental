import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Media/Index';

export default function Media_IndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
