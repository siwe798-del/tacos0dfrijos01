import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { AvailableDomain } from "@shared/schema";

export default function DomainManager() {
  const [newDomain, setNewDomain] = useState("");
  const { toast } = useToast();

  const { data: domains = [] } = useQuery<AvailableDomain[]>({
    queryKey: ["/api/domains"],
  });

  const addDomainMutation = useMutation({
    mutationFn: async (domain: string) => {
      const response = await apiRequest("POST", "/api/domains", { domain: domain.replace(/^https?:\/\//, ''), isActive: true });
      return response.json();
    },
    onSuccess: () => {
      setNewDomain("");
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Dominio agregado",
        description: "El nuevo dominio está disponible para usar",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo agregar el dominio",
        variant: "destructive",
      });
    },
  });

  const toggleDomainMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest("PATCH", `/api/domains/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Dominio actualizado",
        description: "El estado del dominio ha sido cambiado",
      });
    },
  });

  const deleteDomainMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/domains/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
      toast({
        title: "Dominio eliminado",
        description: "El dominio ha sido removido del sistema",
      });
    },
  });

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDomain.trim()) {
      addDomainMutation.mutate(newDomain.trim());
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Gestión de Dominios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Domain */}
        <form onSubmit={handleAddDomain} className="flex gap-2">
          <Input
            placeholder="ejemplo: secure-login.com"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            className="flex-1"
            data-testid="input-new-domain"
          />
          <Button 
            type="submit" 
            disabled={addDomainMutation.isPending || !newDomain.trim()}
            size="sm"
            data-testid="button-add-domain"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        {/* Domain List */}
        <div className="space-y-2">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="flex items-center justify-between p-2 border rounded-md bg-card/50"
            >
              <div className="flex items-center gap-2">
                <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                  {domain.domain}
                </code>
                <Button
                  variant={domain.isActive ? "default" : "secondary"}
                  size="sm"
                  onClick={() =>
                    toggleDomainMutation.mutate({ id: domain.id, isActive: !domain.isActive })
                  }
                  disabled={toggleDomainMutation.isPending}
                  data-testid={`toggle-domain-${domain.id}`}
                  className="h-6 text-xs px-2"
                >
                  {domain.isActive ? "Activo" : "Inactivo"}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteDomainMutation.mutate(domain.id)}
                disabled={deleteDomainMutation.isPending}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                data-testid={`button-delete-${domain.id}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {domains.length === 0 && (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No hay dominios configurados
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}