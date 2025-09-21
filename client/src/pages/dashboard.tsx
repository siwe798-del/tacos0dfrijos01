import AdminLayout from "@/components/admin-layout";
import StatsCards from "@/components/stats-cards";
import TemplateManager from "@/components/template-manager";
import LinkGenerator from "@/components/link-generator";
import DomainManager from "@/components/domain-manager";
import SessionsTable from "@/components/sessions-table";
import ActivityFeed from "@/components/activity-feed";
import SessionDataPreview from "@/components/session-data-preview";
import GeneratedLinksTable from "@/components/generated-links-table";
import { useAdmin } from "@/hooks/use-admin";

export default function Dashboard() {
  const { isAdmin, loading } = useAdmin();
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="animate-pulse">
            <div className="h-32 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <StatsCards />
        
        <div className={`grid gap-4 lg:gap-6 mb-6 lg:mb-8 ${
          isAdmin ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'
        }`}>
          <TemplateManager />
          <LinkGenerator />
          {isAdmin && <DomainManager />}
        </div>

        <SessionsTable />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mt-6 lg:mt-8">
          <ActivityFeed />
          <SessionDataPreview />
        </div>

        <GeneratedLinksTable />
      </div>
    </AdminLayout>
  );
}
