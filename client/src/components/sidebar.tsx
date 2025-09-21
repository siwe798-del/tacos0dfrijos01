import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  FileText, 
  ExternalLink, 
  BarChart3, 
  Settings,
  Shield,
  Monitor,
  LogOut,
  User,
  UserCircle,
  X
} from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import { usePermanentAuth } from "@/hooks/use-permanent-auth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const [location] = useLocation();
  const { isAdmin } = useAdmin();
  const { user, logout } = usePermanentAuth();

  const baseNavigation = [
    { name: "Panel de Control", href: "/dashboard", icon: LayoutDashboard, current: location === "/dashboard" },
    { name: "Sesiones en Vivo", href: "/sessions", icon: Monitor, current: location === "/sessions" },
    { name: "Sitios Disponibles", href: "/templates", icon: FileText, current: location === "/templates" },
    { name: "Enlaces Generados", href: "/links", icon: ExternalLink, current: location === "/links" },
    { name: "Mi Perfil", href: "/profile", icon: UserCircle, current: location === "/profile" },
  ];

  const adminOnlyNavigation = [
    { name: "Usuarios", href: "/users", icon: User, current: location === "/users" },
    { name: "Analíticas", href: "/analytics", icon: BarChart3, current: location === "/analytics" },
    { name: "Configuración", href: "/settings", icon: Settings, current: location === "/settings" },
  ];

  const navigation = isAdmin ? [...baseNavigation, ...adminOnlyNavigation] : baseNavigation;

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 lg:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">Portal</h1>
          </div>
          
          {/* Close button for mobile */}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden"
              data-testid="button-close-sidebar"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    item.current
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={onClose}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm lg:text-base">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{user?.username || 'Usuario'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full flex items-center justify-center space-x-2"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
