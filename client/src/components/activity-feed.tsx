import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";

export default function ActivityFeed() {
  const { user } = usePermanentAuth();
  
  // Admin ve todas las actividades, usuarios normales solo las suyas
  const endpoint = user?.role === 'admin' ? "/api/activities" : `/api/users/${user?.id}/activities`;
  
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: [endpoint],
    refetchInterval: 2000, // Refresh every 2 seconds
    enabled: !!user, // Solo hacer query cuando tengamos el usuario
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted-foreground rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-muted-foreground rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case "session_created":
        return "bg-green-400";
      case "data_submitted":
        return "bg-blue-400";
      case "link_generated":
        return "bg-yellow-400";
      case "session_expired":
        return "bg-purple-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 animate-fade-in" data-testid={`activity-${activity.id}`}>
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt!), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {activities?.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
