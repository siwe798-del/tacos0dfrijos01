import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Copy, Eye, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LinkWithStats } from "@shared/schema";

export default function GeneratedLinksTable() {
  const { toast } = useToast();
  const { user } = usePermanentAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 2;

  const { data: links, isLoading } = useQuery<LinkWithStats[]>({
    queryKey: ["/api/users", user?.id, "links"],
    queryFn: () => user?.id ? apiRequest("GET", `/api/users/${user.id}/links`).then(r => r.json()) : Promise.resolve([]),
    enabled: !!user?.id,
  });

  const deleteLinkMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/links/${id}`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Enlace eliminado exitosamente",
        description: "El enlace ha sido removido.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "links"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete link.",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles.",
      });
    } catch {
      toast({
        title: "Failed to copy",
        description: "Could not copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg mt-8">
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Mis Enlaces</h3>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg mt-8">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Mis Enlaces</h3>
          <div className="flex items-center space-x-3">
            <Input
              type="search"
              placeholder="Search links..."
              className="bg-input border-border text-foreground placeholder-muted-foreground"
              data-testid="input-search-links"
            />
            <Button variant="secondary" data-testid="button-filter">
              Filter
            </Button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Generated URL</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Template</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">User ID</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Created</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Sessions</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {links?.slice((currentPage - 1) * linksPerPage, currentPage * linksPerPage).map((link) => (
              <tr key={link.id} className="hover:bg-accent/50 transition-colors" data-testid={`link-row-${link.id}`}>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <code className="text-sm text-primary bg-background px-2 py-1 rounded max-w-xs truncate">
                      {link.url}
                    </code>
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => copyToClipboard(link.url)}
                      title="Copy link"
                      data-testid={`button-copy-${link.id}`}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded flex items-center justify-center"
                      style={{ backgroundColor: link.template.brandColor }}
                    >
                      <span className="text-white text-xs font-bold">
                        {link.template.brandLetter}
                      </span>
                    </div>
                    <span className="text-sm text-foreground">{link.template.displayName}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-foreground">{link.userId}</span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(link.createdAt!), { addSuffix: true })}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="text-sm font-medium text-primary">
                    {link.sessionCount} sessions
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 text-xs rounded-md ${
                    link.isActive 
                      ? "bg-green-500/10 text-green-400" 
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {link.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      title="View sessions"
                      data-testid={`button-view-sessions-${link.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-muted-foreground hover:text-foreground"
                      title="Edit link"
                      data-testid={`button-edit-link-${link.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-destructive hover:text-destructive/80"
                      title="Delete link"
                      onClick={() => deleteLinkMutation.mutate(link.id)}
                      disabled={deleteLinkMutation.isPending}
                      data-testid={`button-delete-link-${link.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {links?.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 px-6 text-center text-muted-foreground">
                  No generated links found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {links && links.length > 0 && (
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * linksPerPage) + 1}-{Math.min(currentPage * linksPerPage, links.length)} of {links.length} links
            </p>
            <div className="flex items-center space-x-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                data-testid="button-previous"
              >
                Previous
              </Button>
              <span className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm">{currentPage}</span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage * linksPerPage >= links.length}
                data-testid="button-next"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
