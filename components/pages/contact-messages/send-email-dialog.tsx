"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { Send, Loader2 } from "lucide-react";

import { ContactMessage } from "@/types/contact-message";
import { useSendEmail } from "@/hooks/useEmail";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface SendEmailDialogProps {
  message: ContactMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SendEmailDialog({
  message,
  open,
  onOpenChange,
}: SendEmailDialogProps) {
  const sendEmailMutation = useSendEmail();

  const form = useForm({
    defaultValues: {
      to: message?.email || "",
      subject: message?.sujet ? `Re: ${message.sujet}` : "",
      body: "",
    },
    onSubmit: async ({ value }) => {
      if (!message) return;

      try {
        await sendEmailMutation.mutateAsync({
          to: value.to,
          subject: value.subject,
          body: value.body,
          contactMessageId: message.id,
        });

        onOpenChange(false);
        form.reset();
      } catch (error) {
        // L'erreur est gérée par le hook useSendEmail
        console.error("Erreur lors de l'envoi:", error);
      }
    },
  });

  // Réinitialiser le formulaire quand le dialog s'ouvre
  useEffect(() => {
    if (open && message) {
      form.setFieldValue("to", message.email);
      form.setFieldValue(
        "subject",
        message.sujet ? `Re: ${message.sujet}` : "",
      );
      form.setFieldValue("body", "");
    }
  }, [open, message]);

  // Réinitialiser le formulaire quand le dialog se ferme
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Envoyer un email</DialogTitle>
          <DialogDescription>
            Répondre au message de <strong>{message.nom}</strong>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Destinataire */}
          <form.Field
            name="to"
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
                  Destinataire <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="email@example.com"
                  className="rounded-2xl"
                  disabled
                />
                {field.state.meta.errors && (
                  <span className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Sujet */}
          <form.Field
            name="subject"
            validators={{
              onChange: ({ value }) =>
                !value || value.length < 3
                  ? "Le sujet doit contenir au moins 3 caractères"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Sujet <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Objet de l'email"
                  className="rounded-2xl"
                />
                {field.state.meta.errors && (
                  <span className="text-sm text-destructive">
                    {field.state.meta.errors.join(", ")}
                  </span>
                )}
              </div>
            )}
          </form.Field>

          {/* Corps du message */}
          <form.Field
            name="body"
            validators={{
              onChange: ({ value }) =>
                !value || value.length < 10
                  ? "Le message doit contenir au moins 10 caractères"
                  : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Écrivez votre message ici..."
                  className="rounded-2xl min-h-[200px]"
                />
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
              onClick={() => onOpenChange(false)}
              className="rounded-3xl"
              disabled={sendEmailMutation.isPending}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="rounded-3xl gap-2"
              disabled={sendEmailMutation.isPending || !form.state.canSubmit}
            >
              {sendEmailMutation.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="size-4" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
