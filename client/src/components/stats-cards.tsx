import { useQuery } from "@tanstack/react-query";
import { Users, ExternalLink, FileText, TrendingUp } from "lucide-react";
import type { DashboardStats } from "@shared/schema";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";

export default function StatsCards() {
  const { user, isLoading: authLoading } = usePermanentAuth();
  
  // Admin ve todos los datos, usuarios normales solo los suyos
  const endpoint = user?.role === 'admin' ? "/api/dashboard/stats" : `/api/users/${user?.id}/dashboard/stats`;
  
  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: [endpoint],
    refetchInterval: 5000, // Refresh every 5 seconds
    enabled: !!user, // Solo hacer query cuando tengamos el usuario
  });

  if (authLoading || isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 mb-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-md p-2 text-center">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded mb-1"></div>
              <div className="h-5 bg-muted rounded mb-1"></div>
              <div className="h-3 bg-muted rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Sesiones Activas",
      value: stats?.activeSessions || 0,
      change: "+12% última hora",
      changeType: "positive" as const,
      icon: Users,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Enlaces Generados", 
      value: stats?.totalLinks || 0,
      change: "+8 hoy",
      changeType: "positive" as const,
      icon: ExternalLink,
      iconBg: "bg-accent/20",
      iconColor: "text-accent-foreground",
    },
    
    {
      title: "Tasa de Éxito",
      value: `${stats?.successRate || 0}%`,
      change: "+2.1% mejora",
      changeType: "positive" as const,
      icon: TrendingUp,
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 lg:gap-4 mb-4 lg:mb-6">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-card border border-border rounded-md p-2 text-center" data-testid={`stat-card-${stat.title.toLowerCase().replace(/\s+/g, "-")}`}>
            <div className={`w-5 h-5 ${stat.iconBg} rounded flex items-center justify-center mx-auto mb-1`}>
              <Icon className={`w-3 h-3 ${stat.iconColor}`} />
            </div>
            <p className="text-sm font-bold text-foreground" data-testid={`stat-value-${index}`}>{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.title}</p>
          </div>
        );
      })}
    </div>
  );
}
