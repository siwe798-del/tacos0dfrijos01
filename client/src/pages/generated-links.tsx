import AdminLayout from "@/components/admin-layout";
import GeneratedLinksTable from "@/components/generated-links-table";

export default function GeneratedLinksPage() {
  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6 p-4 lg:p-0">
        <div>
          <h1 className="heading-responsive font-bold tracking-tight" data-testid="page-title">
            Enlaces Generados
          </h1>
          <p className="text-responsive text-muted-foreground" data-testid="page-description">
            Gestiona todos los enlaces de tus sitios disponibles
          </p>
        </div>
        
        <GeneratedLinksTable />
      </div>
    </AdminLayout>
  );
}