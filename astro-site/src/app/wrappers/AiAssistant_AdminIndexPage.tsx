import { PageProvider } from '../../lib/inertia';
import Page from '../Pages/AiAssistant/AdminIndex';

export default function AiAssistant_AdminIndexPage({ page }: { page: any }) {
  return (
    <PageProvider page={page}>
      <Page {...page.props} />
    </PageProvider>
  );
}
