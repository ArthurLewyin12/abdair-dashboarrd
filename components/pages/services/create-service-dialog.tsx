"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useCreateService } from "@/hooks/useServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateServiceDialog({
  open,
  onOpenChange,
}: CreateServiceDialogProps) {
  const createMutation = useCreateService();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm({
    defaultValues: {
      titre: "",
      description: "",
      actif: true,
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          titre: value.titre,
          description: value.description,
          actif: value.actif,
          image: imageFile || undefined,
        });
        onOpenChange(false);
        form.reset();
      } catch (error) {
        // Error handled by mutation
      }
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
      setImageFile(null);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Créer un nouveau service
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-6 mt-4"
        >
          <FieldGroup>
            <form.Field
              name="titre"
              validators={{
                onChange: ({ value }) =>
                  !value || value.length < 3
                    ? "Le titre doit contenir au moins 3 caractères"
                    : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="titre">
                    Titre du service <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="titre"
                    type="text"
                    placeholder="Ex: Conception de logo"
                    className="rounded-2xl"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) =>
                  !value || value.length < 10
                    ? "La description doit contenir au moins 10 caractères"
                    : undefined,
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Décrivez le service en détail..."
                    className="rounded-2xl min-h-[150px]"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                   {field.state.meta.errors && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="actif">
              {(field) => (
                <Field>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="actif"
                      checked={field.state.value}
                      onCheckedChange={field.handleChange}
                    />
                    <Label htmlFor="actif">Activer le service</Label>
                  </div>
                </Field>
              )}
            </form.Field>

            <Field>
              <FieldLabel htmlFor="image">Image (optionnel)</FieldLabel>
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="rounded-2xl"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />
            </Field>
          </FieldGroup>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-3xl"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="rounded-3xl"
              disabled={form.state.isSubmitting || createMutation.isPending || !form.state.canSubmit}
            >
              {form.state.isSubmitting || createMutation.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Création en cours...
                </>
              ) : (
                "Créer le service"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
