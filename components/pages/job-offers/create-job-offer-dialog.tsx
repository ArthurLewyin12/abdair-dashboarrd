"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateJobOffer } from "@/hooks/useJobOffers";
import { cn } from "@/lib/utils";

interface CreateJobOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJobOfferDialog({
  open,
  onOpenChange,
}: CreateJobOfferDialogProps) {
  const createMutation = useCreateJobOffer();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("23:59");

  const form = useForm({
    defaultValues: {
      titre: "",
      description: "",
      dateLimite: "",
    },
    onSubmitInvalid: ({ value, formApi }) => {
      console.log("Form invalid", formApi.state.errors);
    },
    onSubmit: async ({ value }) => {
      try {
        await createMutation.mutateAsync({
          titre: value.titre,
          description: value.description,
          dateLimite: value.dateLimite || null,
        });
        onOpenChange(false);
        form.reset();
      } catch (error) {
        // Error handled by mutation
      }
    },
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedDate(undefined);
      setSelectedTime("23:59");
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Créer une nouvelle offre d'emploi
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
            {/* Titre */}
            <form.Field
              name="titre"
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 5) {
                    return "Le titre doit contenir au moins 5 caractères";
                  }
                  if (value.length > 200) {
                    return "Le titre ne peut pas dépasser 200 caractères";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="titre">
                    Titre de l'offre <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Input
                    id="titre"
                    type="text"
                    placeholder="Ex: Développeur Full Stack Senior"
                    className="rounded-2xl"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Description */}
            <form.Field
              name="description"
              validators={{
                onChange: ({ value }) => {
                  if (value.length < 20) {
                    return "La description doit contenir au moins 20 caractères";
                  }
                  if (value.length > 5000) {
                    return "La description ne peut pas dépasser 5000 caractères";
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </FieldLabel>
                  <Textarea
                    id="description"
                    placeholder="Décrivez les missions, compétences requises, conditions..."
                    className="rounded-2xl min-h-[200px] resize-none"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      {field.state.meta.errors.length > 0 && (
                        <span className="text-destructive text-sm">
                          {field.state.meta.errors.join(", ")}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {field.state.value.length} / 5000
                    </span>
                  </div>
                </Field>
              )}
            </form.Field>

            {/* Date limite */}
            <form.Field name="dateLimite">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor="dateLimite">
                    Date limite de candidature (optionnel)
                  </FieldLabel>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal rounded-2xl",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {selectedDate ? (
                            format(selectedDate, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            // Combine date and time for backend
                            if (date) {
                              const [hours, minutes] = selectedTime.split(":");
                              const combinedDate = new Date(date);
                              combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                              field.handleChange(combinedDate.toISOString());
                            } else {
                              field.handleChange("");
                            }
                          }}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={selectedTime}
                        onChange={(e) => {
                          setSelectedTime(e.target.value);
                          // Update the combined date-time when time changes
                          if (selectedDate) {
                            const [hours, minutes] = e.target.value.split(":");
                            const combinedDate = new Date(selectedDate);
                            combinedDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                            field.handleChange(combinedDate.toISOString());
                          }
                        }}
                        className="rounded-2xl pl-10 w-[140px]"
                      />
                    </div>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <span className="text-destructive text-sm">
                      {field.state.meta.errors.join(", ")}
                    </span>
                  )}
                </Field>
              )}
            </form.Field>
          </FieldGroup>

          {/* Actions */}
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
              disabled={
                form.state.isSubmitting ||
                createMutation.isPending ||
                !form.state.canSubmit ||
                form.state.fieldMeta.titre?.errors.length > 0 ||
                form.state.fieldMeta.description?.errors.length > 0
              }
            >
              {form.state.isSubmitting || createMutation.isPending ? (
                <>
                  <Spinner className="mr-2" />
                  Création en cours...
                </>
              ) : (
                "Créer l'offre"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
