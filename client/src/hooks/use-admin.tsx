import { usePermanentAuth } from "./use-permanent-auth";

export function useAdmin() {
  const { user, isLoading } = usePermanentAuth();
  
  return { 
    isAdmin: user?.role === "admin" || false, 
    loading: isLoading 
  };
}