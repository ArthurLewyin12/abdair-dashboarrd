"use client";

import { useState } from "react";
import { Moon, Sun, Bell, Shield, Loader2 } from "lucide-react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/lib/toast";
import { useTheme } from "next-themes";

interface PreferencesTabProps {
  user: User;
}

export function PreferencesTab({ user }: PreferencesTabProps) {
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  // Préférences de notification (simulées pour le moment)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [jobApplications, setJobApplications] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // TODO: Implémenter l'API de sauvegarde des préférences
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "default",
        title: "Préférences enregistrées",
        message: "Vos préférences ont été mises à jour avec succès.",
      });
    } catch (error) {
      toast({
        variant: "error",
        title: "Erreur",
        message: "Une erreur est survenue lors de l'enregistrement.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Apparence */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            {theme === "dark" ? (
              <Moon className="size-5 text-primary" />
            ) : (
              <Sun className="size-5 text-primary" />
            )}
            <div className="flex-1">
              <h3 className="text-base font-semibold">Apparence</h3>
              <p className="text-sm text-muted-foreground">
                Personnalisez l'apparence de l'interface
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme("light")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                theme === "light"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Sun className="size-5 mx-auto mb-2" />
              <p className="text-sm font-medium">Clair</p>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                theme === "dark"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Moon className="size-5 mx-auto mb-2" />
              <p className="text-sm font-medium">Sombre</p>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`p-4 rounded-2xl border-2 transition-all ${
                theme === "system"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <Shield className="size-5 mx-auto mb-2" />
              <p className="text-sm font-medium">Système</p>
            </button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Notifications */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="size-5 text-primary" />
            <div className="flex-1">
              <h3 className="text-base font-semibold">Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Gérez vos préférences de notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Notifications par email */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email-notifications" className="text-sm font-medium">
                  Notifications par email
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications par email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>

            <Separator className="my-4" />

            {/* Nouveaux messages */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="new-messages" className="text-sm font-medium">
                  Nouveaux messages de contact
                </Label>
                <p className="text-sm text-muted-foreground">
                  Être notifié des nouveaux messages
                </p>
              </div>
              <Switch
                id="new-messages"
                checked={newMessages}
                onCheckedChange={setNewMessages}
                disabled={!emailNotifications}
              />
            </div>

            {/* Candidatures */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="job-applications" className="text-sm font-medium">
                  Nouvelles candidatures
                </Label>
                <p className="text-sm text-muted-foreground">
                  Être notifié des nouvelles candidatures
                </p>
              </div>
              <Switch
                id="job-applications"
                checked={jobApplications}
                onCheckedChange={setJobApplications}
                disabled={!emailNotifications}
              />
            </div>

            {/* Rapport hebdomadaire */}
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="weekly-report" className="text-sm font-medium">
                  Rapport hebdomadaire
                </Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un résumé hebdomadaire par email
                </p>
              </div>
              <Switch
                id="weekly-report"
                checked={weeklyReport}
                onCheckedChange={setWeeklyReport}
                disabled={!emailNotifications}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          className="rounded-3xl"
          onClick={() => {
            setEmailNotifications(true);
            setNewMessages(true);
            setJobApplications(true);
            setWeeklyReport(false);
          }}
          disabled={isSaving}
        >
          Réinitialiser
        </Button>
        <Button
          className="rounded-3xl gap-2"
          onClick={handleSavePreferences}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les préférences"
          )}
        </Button>
      </div>
    </div>
  );
}
