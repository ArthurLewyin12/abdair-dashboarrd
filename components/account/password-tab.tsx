"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/toast";

export function PasswordTab() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setIsUpdating(true);
      try {
        // TODO: Implémenter l'API de changement de mot de passe
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast({
          variant: "default",
          title: "Mot de passe modifié",
          message: "Votre mot de passe a été mis à jour avec succès.",
        });

        form.reset();
      } catch (error) {
        toast({
          variant: "error",
          title: "Erreur",
          message: "Une erreur est survenue lors du changement de mot de passe.",
        });
      } finally {
        setIsUpdating(false);
      }
    },
  });

  return (
    <div className="space-y-6">
      {/* Info Card */}
      <Card className="rounded-3xl border-dashed bg-muted/50">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Lock className="size-5 text-muted-foreground mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold">Sécurité du mot de passe</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Assurez-vous que votre mot de passe contient au moins 8 caractères,
                avec des lettres majuscules, minuscules et des chiffres.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        {/* Mot de passe actuel */}
        <form.Field
          name="currentPassword"
          validators={{
            onChange: ({ value }) =>
              !value || value.length < 8
                ? "Le mot de passe actuel est requis"
                : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Mot de passe actuel <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  type={showCurrentPassword ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="••••••••"
                  className="rounded-2xl pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Nouveau mot de passe */}
        <form.Field
          name="newPassword"
          validators={{
            onChange: ({ value }) => {
              if (!value || value.length < 8) {
                return "Le mot de passe doit contenir au moins 8 caractères";
              }
              if (!/[A-Z]/.test(value)) {
                return "Le mot de passe doit contenir au moins une majuscule";
              }
              if (!/[a-z]/.test(value)) {
                return "Le mot de passe doit contenir au moins une minuscule";
              }
              if (!/[0-9]/.test(value)) {
                return "Le mot de passe doit contenir au moins un chiffre";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Nouveau mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  type={showNewPassword ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="••••••••"
                  className="rounded-2xl pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Confirmer le mot de passe */}
        <form.Field
          name="confirmPassword"
          validators={{
            onChangeListenTo: ["newPassword"],
            onChange: ({ value, fieldApi }) => {
              const newPassword = fieldApi.form.getFieldValue("newPassword");
              if (!value) {
                return "Veuillez confirmer votre mot de passe";
              }
              if (value !== newPassword) {
                return "Les mots de passe ne correspondent pas";
              }
              return undefined;
            },
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Confirmer le mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  type={showConfirmPassword ? "text" : "password"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="••••••••"
                  className="rounded-2xl pl-10 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 size-8 rounded-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </Button>
              </div>
              {field.state.meta.errors && (
                <span className="text-sm text-destructive">
                  {field.state.meta.errors.join(", ")}
                </span>
              )}
            </div>
          )}
        </form.Field>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="rounded-3xl"
            onClick={() => form.reset()}
            disabled={isUpdating}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            className="rounded-3xl gap-2"
            disabled={isUpdating || !form.state.canSubmit}
          >
            {isUpdating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Changer le mot de passe"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
