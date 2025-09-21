import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User as UserIcon, Settings, Plus, ArrowLeft } from "lucide-react";
import type { User } from "@shared/schema";

const membershipSchema = z.object({
  userId: z.string().min(1, "ID de usuario requerido"),
  membershipType: z.enum(["7_days", "15_days", "30_days"]),
});

type MembershipForm = z.infer<typeof membershipSchema>;

export default function UsersPage() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const form = useForm<MembershipForm>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      userId: "",
      membershipType: "7_days",
    },
  });

  const addMembershipMutation = useMutation({
    mutationFn: async (data: MembershipForm) => {
      const response = await apiRequest("PATCH", `/api/admin/users/${data.userId}/membership`, {
        membershipType: data.membershipType,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Membresía agregada",
        description: "La membresía se ha asignado correctamente al usuario.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo asignar la membresía.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MembershipForm) => {
    addMembershipMutation.mutate(data);
  };

  const getMembershipStatus = (user: User) => {
    if (!user.membershipEndDate) {
      return { status: "sin_membresia", text: "Sin membresía", variant: "secondary" as const };
    }
    
    const endDate = new Date(user.membershipEndDate);
    const now = new Date();
    const isActive = endDate > now;
    
    if (isActive) {
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return { 
        status: "activa", 
        text: `Activa (${daysRemaining} días)`, 
        variant: "default" as const 
      };
    } else {
      return { status: "expirada", text: "Expirada", variant: "destructive" as const };
    }
  };

  const getMembershipTypeText = (type: string | null) => {
    switch (type) {
      case "7_days": return "7 días";
      case "15_days": return "15 días";
      case "30_days": return "30 días";
      default: return "N/A";
    }
  };

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit", 
      year: "numeric"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-4 mb-2">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Regresar al Dashboard</span>
              </Button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra las membresías de los usuarios registrados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90" data-testid="button-add-membership">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Membresía
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Asignar Membresía</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="userId">ID de Usuario</Label>
                <Input
                  id="userId"
                  {...form.register("userId")}
                  placeholder="Ingresa el ID del usuario"
                  className="bg-input border-border text-foreground"
                  data-testid="input-user-id"
                />
                {form.formState.errors.userId && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.userId.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="membershipType">Tipo de Membresía</Label>
                <Select 
                  onValueChange={(value) => form.setValue("membershipType", value as any)}
                  defaultValue="7_days"
                >
                  <SelectTrigger className="bg-input border-border text-foreground" data-testid="select-membership-type">
                    <SelectValue placeholder="Selecciona el tipo de membresía" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7_days">7 días</SelectItem>
                    <SelectItem value="15_days">15 días</SelectItem>
                    <SelectItem value="30_days">30 días</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.membershipType && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.membershipType.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={addMembershipMutation.isPending}
                data-testid="button-submit-membership"
              >
                {addMembershipMutation.isPending ? "Asignando..." : "Asignar Membresía"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card border border-border rounded-lg">
        <div className="p-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Usuarios Registrados</h3>
        </div>
        <div className="p-4">
          {users.length === 0 ? (
            <div className="text-center py-8">
              <UserIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No hay usuarios registrados</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Usuario</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Membresía</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Estado</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Fecha Fin</th>
                    <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(user => user.role !== "admin").map((user) => {
                    const membershipStatus = getMembershipStatus(user);
                    return (
                      <tr key={user.id} className="border-b border-border/50" data-testid={`row-user-${user.id}`}>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{user.username}</p>
                              {user.email && <p className="text-xs text-muted-foreground">{user.email}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded text-foreground" data-testid={`text-user-id-${user.id}`}>
                            {user.id}
                          </code>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-foreground">
                            {getMembershipTypeText(user.membershipType)}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={membershipStatus.variant} data-testid={`status-membership-${user.id}`}>
                            {membershipStatus.text}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {formatDate(user.membershipEndDate)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              form.setValue("userId", user.id);
                              setSelectedUser(user);
                              setIsDialogOpen(true);
                            }}
                            className="text-xs"
                            data-testid={`button-manage-${user.id}`}
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Gestionar
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-foreground">Membresías Activas</h4>
          </div>
          <p className="text-2xl font-bold text-foreground" data-testid="text-active-count">
            {users.filter(u => u.role !== "admin" && u.membershipEndDate && new Date(u.membershipEndDate) > new Date()).length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-foreground">Membresías Expiradas</h4>
          </div>
          <p className="text-2xl font-bold text-foreground" data-testid="text-expired-count">
            {users.filter(u => u.role !== "admin" && u.membershipEndDate && new Date(u.membershipEndDate) <= new Date()).length}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-foreground">Sin Membresía</h4>
          </div>
          <p className="text-2xl font-bold text-foreground" data-testid="text-no-membership-count">
            {users.filter(u => u.role !== "admin" && !u.membershipEndDate).length}
          </p>
        </div>
      </div>
    </div>
  );
}