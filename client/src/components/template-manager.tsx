import { useQuery } from "@tanstack/react-query";
import { MoreVertical, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Template } from "@shared/schema";

export default function TemplateManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-foreground">Sitios</h3>
            <div className="h-4 bg-muted rounded w-12"></div>
          </div>
          <div className="animate-pulse">
            <div className="h-10 bg-muted rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  const currentTemplate = selectedTemplate ? templates?.find(t => t.id === selectedTemplate) : null;

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">Sitios Disponibles</h3>
          <button 
            className="text-primary hover:text-primary/80 text-xs font-medium"
            data-testid="button-add-template"
          >
            + Agregar
          </button>
        </div>
        
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger className="w-full" data-testid="template-selector">
            <SelectValue placeholder="Selecciona un sitio para gestionar" />
          </SelectTrigger>
          <SelectContent>
            {templates?.map((template) => (
              <SelectItem key={template.id} value={template.id} data-testid={`template-option-${template.name}`}>
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded flex items-center justify-center"
                    style={{ backgroundColor: template.brandColor }}
                  >
                    <span className="text-white text-xs font-bold">{template.brandLetter}</span>
                  </div>
                  <span>{template.displayName}</span>
                  <span className={`ml-auto px-1 py-0.5 text-xs rounded ${
                    template.isActive 
                      ? "bg-green-500/10 text-green-400" 
                      : "bg-red-500/10 text-red-400"
                  }`}>
                    {template.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {currentTemplate && (
        <div className="p-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: currentTemplate.brandColor }}
              >
                <span className="text-white font-bold text-sm">{currentTemplate.brandLetter}</span>
              </div>
              <div>
                <p className="font-medium text-foreground text-sm" data-testid={`selected-template-name`}>
                  {currentTemplate.displayName}
                </p>
                <p className="text-xs text-muted-foreground">{currentTemplate.description}</p>
              </div>
            </div>
            <button 
              className="text-muted-foreground hover:text-foreground"
              data-testid={`button-template-menu-selected`}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
