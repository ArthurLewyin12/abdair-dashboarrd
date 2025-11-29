"use client";

import { useState } from "react";
import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSession } from "@/hooks/useSession";
import { Spinner } from "@/components/ui/spinner";
import { AccountSettingsDialog } from "@/components/account/account-settings-dialog";

/**
 * Génère les initiales à partir du prénom et du nom
 */
function getInitials(prenom: string, nom: string): string {
  const prenomInitial = prenom?.charAt(0)?.toUpperCase() || "";
  const nomInitial = nom?.charAt(0)?.toUpperCase() || "";
  return `${prenomInitial}${nomInitial}`;
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const { user, logout, isLoading } = useSession();
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);

  // Si l'utilisateur n'est pas connecté, ne rien afficher
  if (!user && !isLoading) {
    return null;
  }

  // Afficher un spinner pendant le chargement
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Spinner className="h-8 w-8" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-muted-foreground">
                Chargement...
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const fullName = `${user!.prenom} ${user!.nom}`;
  const initials = getInitials(user!.prenom, user!.nom);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{fullName}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user!.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{fullName}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user!.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsAccountDialogOpen(true)}>
                <IconUserCircle />
                Mon compte
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive focus:text-destructive"
            >
              <IconLogout />
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Settings Dialog */}
        <AccountSettingsDialog
          user={user ?? null}
          open={isAccountDialogOpen}
          onOpenChange={setIsAccountDialogOpen}
        />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
