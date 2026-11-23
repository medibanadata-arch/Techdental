import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Settings/HeaderFooter';

export default function Settings_HeaderFooterPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
