import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import SantanderTemplate from "@/components/templates/santander-template";
import AppleTemplate from "@/components/templates/apple-template";
import LiverpoolTemplate from "@/components/templates/liverpool-template";
import FacebookTemplate from "@/components/templates/facebook-template";

export default function TemplateView() {
  const [, params] = useRoute("/template/:templateName");
  const templateName = params?.templateName;
  
  const { data: template, isLoading } = useQuery({
    queryKey: ["/api/templates", templateName],
    enabled: !!templateName,
  });

  if (isLoading) {
    return (
      <div className="template-container min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading template...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="template-container min-h-screen bg-white flex items-center justify-center">
        <div className="text-red-600">Template not found</div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (templateName) {
      case "santander":
        return <SantanderTemplate />;
      case "apple":
        return <AppleTemplate />;
      case "liverpool":
        return <LiverpoolTemplate />;
      case "facebook":
        return <FacebookTemplate />;
      default:
        return <div className="text-destructive">Unknown template</div>;
    }
  };

  return <div className="template-container">{renderTemplate()}</div>;
}
