import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Template, AvailableDomain } from "@shared/schema";

const linkGeneratorSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
  userId: z.string().min(1, "User ID is required"),
  templateId: z.string().min(1, "Template is required"),
});

type LinkGeneratorForm = z.infer<typeof linkGeneratorSchema>;

// Helper function to generate user ID - shorter and more discrete
const generateUserId = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function LinkGenerator() {
  const { toast } = useToast();
  const { user } = usePermanentAuth();
  const [previewUrl, setPreviewUrl] = useState("");
  const [lastGeneratedLink, setLastGeneratedLink] = useState("");

  const { data: templates } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: domains } = useQuery<AvailableDomain[]>({
    queryKey: ["/api/domains"],
  });

  // Verificar si el usuario tiene membresía activa (admin no requiere membresía)
  const hasActiveMembership = (user && user.role === 'admin') || (user && user.membershipEndDate && new Date(user.membershipEndDate) > new Date());
  
  // Calcular días restantes de membresía
  const daysRemaining = user?.membershipEndDate 
    ? Math.max(0, Math.ceil((new Date(user.membershipEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const form = useForm<LinkGeneratorForm>({
    resolver: zodResolver(linkGeneratorSchema),
    defaultValues: {
      domain: "",
      userId: user?.id || "",
      templateId: "",
    },
  });

  // Update form when user loads
  useEffect(() => {
    if (user?.id && form.getValues().userId !== user.id) {
      form.setValue("userId", user.id);
    }
  }, [user, form]);

  const generateLinkMutation = useMutation({
    mutationFn: async (data: LinkGeneratorForm) => {
      // Ensure userId is set correctly
      const linkData = {
        ...data,
        userId: user?.id || data.userId
      };
      const response = await apiRequest("POST", "/api/links", linkData);
      return response.json();
    },
    onSuccess: (data) => {
      const generatedUrl = data.url;
      setLastGeneratedLink(generatedUrl);
      toast({
        title: "¡Enlace generado exitosamente!",
        description: "Tu enlace está listo para copiar y usar.",
      });
      // Invalidar las queries correctas para que aparezca el nuevo link
      queryClient.invalidateQueries({ queryKey: ["/api/links"] });
      queryClient.invalidateQueries({ queryKey: ["/api/users", user?.id, "links"] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user?.id}/dashboard/stats`] });
      // No resetear el form para mantener la vista del link generado
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Error al generar el enlace. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const updatePreview = () => {
    const { domain, userId, templateId } = form.getValues();
    if (domain && userId && templateId) {
      const template = templates?.find(t => t.id === templateId);
      if (template) {
        setPreviewUrl(`${domain}/${userId}/${template.numericId}`);
      }
    } else {
      setPreviewUrl("");
    }
  };

  const onSubmit = (data: LinkGeneratorForm) => {
    if (!hasActiveMembership) {
      toast({
        title: "Membresía requerida",
        description: "Necesitas una membresía activa para generar enlaces.",
        variant: "destructive",
      });
      return;
    }
    generateLinkMutation.mutate(data);
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">Generar Enlace</h3>
      </div>
      <div className="p-4 space-y-4">
        {/* Link generado recientemente - Mostrar arriba */}
        {lastGeneratedLink && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">✅ ¡Enlace generado exitosamente!</h4>
                <div className="flex items-center space-x-2">
                  <code className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-3 py-2 rounded flex-1 break-all"
                        data-testid="text-generated-link">
                    {lastGeneratedLink}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(lastGeneratedLink);
                      toast({
                        title: "¡Copiado!",
                        description: "El enlace ha sido copiado al portapapeles.",
                      });
                    }}
                    className="bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/60"
                    data-testid="button-copy-generated-link"
                  >
                    Copiar
                  </Button>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setLastGeneratedLink("")}
                className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/40 ml-2"
                data-testid="button-dismiss-generated-link"
              >
                ✕
              </Button>
            </div>
          </div>
        )}
        {!hasActiveMembership && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-destructive rounded-full"></div>
              <p className="text-sm font-medium text-destructive">
                Membresía expirada o inactiva
              </p>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Contacta al administrador para renovar tu membresía y poder generar enlaces.
            </p>
          </div>
        )}
        
        {hasActiveMembership && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Membresía activa - {daysRemaining} días restantes
              </p>
            </div>
          </div>
        )}
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="domain" className="text-foreground">Dominio</Label>
            <Select 
              onValueChange={(value) => {
                form.setValue("domain", value);
                updatePreview();
              }}
              disabled={!hasActiveMembership}
            >
              <SelectTrigger className={`bg-input border-border text-foreground ${!hasActiveMembership ? 'opacity-50 cursor-not-allowed' : ''}`} data-testid="select-domain">
                <SelectValue placeholder={hasActiveMembership ? "Selecciona un dominio" : "Membresía requerida"} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {domains?.filter(d => d.isActive).map((domain) => (
                  <SelectItem key={domain.id} value={domain.domain}>
                    {domain.domain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.domain && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.domain.message}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="userId" className="text-foreground">ID de Usuario <span className="text-xs text-muted-foreground">(Auto-generado)</span></Label>
            <Input
              id="userId"
              {...form.register("userId")}
              className="bg-input border-border text-foreground cursor-not-allowed"
              readOnly
              data-testid="input-user-id"
            />
            <p className="text-xs text-muted-foreground mt-1">ID único permanente - nunca cambia, ni al recargar la página</p>
          </div>
          
          <div>
            <Label htmlFor="templateId" className="text-foreground">Sitio</Label>
            <Select 
              onValueChange={(value) => {
                form.setValue("templateId", value);
                updatePreview();
              }}
              disabled={!hasActiveMembership}
            >
              <SelectTrigger className={`bg-input border-border text-foreground ${!hasActiveMembership ? 'opacity-50 cursor-not-allowed' : ''}`} data-testid="select-template">
                <SelectValue placeholder={hasActiveMembership ? "Selecciona un sitio" : "Membresía requerida"} />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {templates?.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.templateId && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.templateId.message}</p>
            )}
          </div>
          
          {previewUrl && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Vista previa del enlace:</p>
              <code className="text-sm text-primary bg-background px-2 py-1 rounded" data-testid="text-preview-url">
                {previewUrl}
              </code>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={generateLinkMutation.isPending || !hasActiveMembership}
              data-testid="button-generate-link"
            >
              {generateLinkMutation.isPending ? "Generando..." : hasActiveMembership ? "Generar Enlace" : "Membresía requerida"}
            </Button>
            {lastGeneratedLink && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset({
                    domain: "",
                    userId: user?.id || "",
                    templateId: "",
                  });
                  setPreviewUrl("");
                  setLastGeneratedLink("");
                }}
                data-testid="button-create-new-link"
              >
                Nuevo
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
