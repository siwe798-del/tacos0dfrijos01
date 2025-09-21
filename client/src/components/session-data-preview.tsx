import { useQuery } from "@tanstack/react-query";
import type { SessionWithData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";

export default function SessionDataPreview() {
  const { user } = usePermanentAuth();
  
  // Admin ve todas las sesiones activas, usuarios normales solo las suyas
  const endpoint = user?.role === 'admin' ? "/api/sessions/active" : `/api/users/${user?.id}/sessions/active`;
  
  const { data: sessions } = useQuery<SessionWithData[]>({
    queryKey: [endpoint],
    refetchInterval: 3000,
    enabled: !!user, // Solo hacer query cuando tengamos el usuario
  });

  const latestSession = sessions?.[0];

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Session Data Preview</h3>
      </div>
      <div className="p-6">
        {latestSession ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-foreground" data-testid="text-session-id">
                  Session: {latestSession.id.slice(0, 12)}
                </span>
                <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-md">
                  Live
                </span>
              </div>
              
              <div className="space-y-3">
                {latestSession.submissions.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {latestSession.submissions.map((submission, index) => (
                      <div key={submission.id}>
                        <p className="text-xs text-muted-foreground">{submission.fieldName}</p>
                        <p className="text-sm text-foreground" data-testid={`text-field-${submission.fieldName}`}>
                          {submission.fieldName.toLowerCase().includes('password') ? '••••••••' : submission.fieldValue}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No data submitted yet</p>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="text-sm text-foreground" data-testid="text-ip-address">
                      {latestSession.ipAddress || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">User Agent</p>
                    <p className="text-sm text-foreground truncate" data-testid="text-user-agent">
                      {latestSession.userAgent?.split(" ")[0] || "N/A"}
                    </p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p className="text-sm text-foreground" data-testid="text-timestamp">
                    {new Date(latestSession.startedAt!).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button className="text-sm text-muted-foreground hover:text-foreground" data-testid="button-export-data">
                Export Data
              </button>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                data-testid="button-view-full-details"
              >
                View Full Details
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No active sessions to preview
          </div>
        )}
      </div>
    </div>
  );
}
