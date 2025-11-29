"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Mail, Phone, Calendar, Tag, MessageSquare } from "lucide-react";

import {
  ContactMessage,
  MessageStatus,
  MessageType,
} from "@/types/contact-message";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ContactDetailsDialogProps {
  message: ContactMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusBadge = (status: MessageStatus) => {
  switch (status) {
    case MessageStatus.NEW:
      return <Badge variant="default">Nouveau</Badge>;
    case MessageStatus.READ:
      return <Badge variant="secondary">Lu</Badge>;
    case MessageStatus.REPLIED:
      return (
        <Badge className="bg-green-500 text-white hover:bg-green-600">
          Répondu
        </Badge>
      );
    case MessageStatus.ARCHIVED:
      return <Badge variant="outline">Archivé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getTypeLabel = (type: MessageType) => {
  switch (type) {
    case MessageType.QUOTE:
      return "Demande de devis";
    case MessageType.INFO:
      return "Demande d'information";
    case MessageType.OTHER:
      return "Autre";
    default:
      return type;
  }
};

export function ContactDetailsDialog({
  message,
  open,
  onOpenChange,
}: ContactDetailsDialogProps) {
  if (!message) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Détails du message</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations de contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations de contact</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  <span className="font-medium">Nom</span>
                </div>
                <p className="text-base font-medium">{message.nom}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  <span className="font-medium">Email</span>
                </div>
                <a
                  href={`mailto:${message.email}`}
                  className="text-base text-blue-600 hover:underline dark:text-blue-400"
                >
                  {message.email}
                </a>
              </div>

              {message.numeroTelephone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="size-4" />
                    <span className="font-medium">Téléphone</span>
                  </div>
                  <a
                    href={`tel:${message.numeroTelephone}`}
                    className="text-base hover:underline"
                  >
                    {message.numeroTelephone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Détails du message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Message</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="size-4" />
                  <span className="font-medium">Sujet</span>
                </div>
                <p className="text-base font-medium">{message.sujet}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="size-4" />
                  <span className="font-medium">Contenu</span>
                </div>
                <div className="bg-muted/50 p-4 rounded-2xl">
                  <p className="text-base whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Métadonnées */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Informations</h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="size-4" />
                  <span className="font-medium">Type</span>
                </div>
                <p className="text-base">{getTypeLabel(message.type)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="size-4" />
                  <span className="font-medium">Statut</span>
                </div>
                <div>{getStatusBadge(message.statut)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span className="font-medium">Date de création</span>
                </div>
                <p className="text-base">
                  {format(new Date(message.dateCreation), "PPPp", {
                    locale: fr,
                  })}
                </p>
              </div>

              {message.dateLecture && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span className="font-medium">Date de lecture</span>
                  </div>
                  <p className="text-base">
                    {format(new Date(message.dateLecture), "PPPp", {
                      locale: fr,
                    })}
                  </p>
                </div>
              )}

              {message.dateReponse && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    <span className="font-medium">Date de réponse</span>
                  </div>
                  <p className="text-base">
                    {format(new Date(message.dateReponse), "PPPp", {
                      locale: fr,
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
