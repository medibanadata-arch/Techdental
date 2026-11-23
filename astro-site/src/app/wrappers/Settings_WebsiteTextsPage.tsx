import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/Settings/WebsiteTexts';

export default function Settings_WebsiteTextsPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
