"use client";

import { User, Lock, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs } from "@/components/ui/custom-tabs";
import { PersonalInfoTab } from "./personal-info-tab";
import { PasswordTab } from "./password-tab";
import { PreferencesTab } from "./preferences-tab";
import { User as UserType } from "@/types/user";

interface AccountSettingsDialogProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSettingsDialog({
  user,
  open,
  onOpenChange,
}: AccountSettingsDialogProps) {
  if (!user) return null;

  const tabItems = [
    {
      id: "personal",
      label: "Informations",
      icon: <User className="size-4" />,
      content: <PersonalInfoTab user={user} />,
    },
    {
      id: "password",
      label: "Mot de passe",
      icon: <Lock className="size-4" />,
      content: <PasswordTab />,
    },
    {
      id: "preferences",
      label: "Préférences",
      icon: <Settings className="size-4" />,
      content: <PreferencesTab user={user} />,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Mon compte</DialogTitle>
          <DialogDescription>
            Gérez vos informations personnelles et vos préférences
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6">
          <Tabs items={tabItems} defaultTab="personal" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
