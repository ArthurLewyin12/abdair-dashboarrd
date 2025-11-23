"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Service } from "@/types/service";
import ENVIRONNEMENTS from "@/constants/environnements";

interface ServiceDetailsDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServiceDetailsDialog({
  service,
  open,
  onOpenChange,
}: ServiceDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">
            {service.titre}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {service.imageUrl && (
            <div className="relative h-60 w-full rounded-2xl overflow-hidden">
              <Image
                src={service.imageUrl}
                alt={service.titre}
                layout="fill"
                objectFit="cover"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Statut</div>
              <div>
                {service.actif ? (
                  <Badge variant="default" className="gap-1.5">
                    <CheckCircle className="size-3" />
                    Actif
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="gap-1.5">
                    <XCircle className="size-3" />
                    Inactif
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="size-4" />
                Date de création
              </div>
              <div>
                {format(new Date(service.dateCreation), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium text-muted-foreground">
              Description
            </div>
            <div className="bg-muted/30 rounded-2xl p-6">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
