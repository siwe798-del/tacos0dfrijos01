import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface WebSocketContextType {
  isConnected: boolean;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastMessage: null,
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    socket.onclose = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(event.data); // Pass the raw string, templates will parse it

        // Handle different message types
        switch (data.type) {
          case "session_created":
            toast({
              title: "New session created",
              description: `A user accessed a template link`,
            });
            // Invalidar tanto endpoints globales como específicos por usuario
            queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
            queryClient.invalidateQueries({ predicate: (query) => {
              const key = query.queryKey[0]?.toString();
              return key ? key.includes("/api/users/") && key.includes("/sessions") : false;
            }});
            queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
            queryClient.invalidateQueries({ predicate: (query) => {
              const key = query.queryKey[0]?.toString();
              return key ? key.includes("/api/users/") && key.includes("/dashboard/stats") : false;
            }});
            break;
          
          case "session_updated":
            // Don't show toast for screen changes, but refresh data
            queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
            queryClient.invalidateQueries({ predicate: (query) => {
              const key = query.queryKey[0]?.toString();
              return key ? key.includes("/api/users/") && key.includes("/sessions") : false;
            }});
            break;
          
          case "submission_created":
            // Silently update data without showing toast to avoid user distraction
            queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
            queryClient.invalidateQueries({ predicate: (query) => {
              const key = query.queryKey[0]?.toString();
              return key ? key.includes("/api/users/") && key.includes("/sessions") : false;
            }});
            queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
            queryClient.invalidateQueries({ predicate: (query) => {
              const key = query.queryKey[0]?.toString();
              return key ? key.includes("/api/users/") && key.includes("/dashboard/stats") : false;
            }});
            break;
          
          case "link_created":
            toast({
              title: "Link generated",
              description: "A new template link has been created",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/links"] });
            break;
          
          case "link_deleted":
            queryClient.invalidateQueries({ queryKey: ["/api/links"] });
            break;
          
          case "domain_created":
            toast({
              title: "Nuevo dominio agregado",
              description: `Dominio ${data.data?.domain} agregado al sistema`,
            });
            queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
            break;
          
          case "domain_updated":
            queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
            break;
          
          case "domain_deleted":
            toast({
              title: "Dominio eliminado",
              description: "Un dominio ha sido removido del sistema",
            });
            queryClient.invalidateQueries({ queryKey: ["/api/domains"] });
            break;
        }

        // Invalidate activities to show real-time updates (global y por usuario)
        queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
        queryClient.invalidateQueries({ predicate: (query) => {
          const key = query.queryKey[0]?.toString();
          return key ? key.includes("/api/users/") && key.includes("/activities") : false;
        }});
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      socket.close();
    };
  }, [toast]);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
