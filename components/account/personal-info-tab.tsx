"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Loader2, Mail, User as UserIcon } from "lucide-react";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/lib/toast";

interface PersonalInfoTabProps {
  user: User;
}

function getInitials(prenom: string, nom: string): string {
  const prenomInitial = prenom?.charAt(0)?.toUpperCase() || "";
  const nomInitial = nom?.charAt(0)?.toUpperCase() || "";
  return `${prenomInitial}${nomInitial}`;
}

export function PersonalInfoTab({ user }: PersonalInfoTabProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const form = useForm({
    defaultValues: {
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
    },
    onSubmit: async ({ value }) => {
      setIsUpdating(true);
      try {
        // TODO: Implémenter l'API de mise à jour du profil
        await new Promise((resolve) => setTimeout(resolve, 1500));

        toast({
          variant: "default",
          title: "Profil mis à jour",
          message: "Vos informations ont été mises à jour avec succès.",
        });
      } catch (error) {
        toast({
          variant: "error",
          title: "Erreur",
          message: "Une erreur est survenue lors de la mise à jour.",
        });
      } finally {
        setIsUpdating(false);
      }
    },
  });

  const initials = getInitials(user.prenom, user.nom);

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card className="rounded-3xl border-dashed">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 rounded-2xl">
              <AvatarFallback className="rounded-2xl bg-primary text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">Photo de profil</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Cette image sera affichée dans votre profil
              </p>
            </div>
            <Button variant="outline" className="rounded-3xl" disabled>
              Changer
            </Button>
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
        <div className="grid gap-4 md:grid-cols-2">
          {/* Prénom */}
          <form.Field
            name="prenom"
            validators={{
              onChange: ({ value }) =>
                !value || value.length < 2
                  ? "Le prénom doit contenir au moins 2 caractères"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Prénom <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Votre prénom"
                    className="rounded-2xl pl-10"
                  />
                </div>
                {field.state.meta.errors && (
                  <span className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Nom */}
          <form.Field
            name="nom"
            validators={{
              onChange: ({ value }) =>
                !value || value.length < 2
                  ? "Le nom doit contenir au moins 2 caractères"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Nom <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Votre nom"
                    className="rounded-2xl pl-10"
                  />
                </div>
                {field.state.meta.errors && (
                  <span className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            )}
          </form.Field>
        </div>

        {/* Email */}
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                ? "L'email doit être valide"
                : undefined,
          }}
        >
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id={field.name}
                  type="email"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="votre.email@example.com"
                  className="rounded-2xl pl-10"
                />
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
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
