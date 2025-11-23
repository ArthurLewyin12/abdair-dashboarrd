"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Calendar,
  Users,
  X,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabItem } from "@/components/ui/custom-tabs";
import { Spinner } from "@/components/ui/spinner";
import { JobOffer, JobOfferStatus } from "@/types/job-offer";
import { useApplicationsByJobOffer } from "@/hooks/useJobApplications";
import { JobApplicationsList } from "./job-applications-list";

interface JobOfferDetailsDialogProps {
  offer: JobOffer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobOfferDetailsDialog({
  offer,
  open,
  onOpenChange,
}: JobOfferDetailsDialogProps) {
  const { data: applications, isLoading } = useApplicationsByJobOffer(offer.id);

  const getStatusBadge = (status: JobOfferStatus) => {
    const variants: Record<
      JobOfferStatus,
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      [JobOfferStatus.OPEN]: { label: "Ouverte", variant: "default" },
      [JobOfferStatus.CLOSED]: { label: "Fermée", variant: "secondary" },
      [JobOfferStatus.ARCHIVED]: {
        label: "Archivée",
        variant: "destructive",
      },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className="rounded-2xl">
        {config.label}
      </Badge>
    );
  };

  const pendingCount =
    applications?.filter((a) => a.statut === "PENDING").length || 0;
  const reviewedCount =
    applications?.filter((a) => a.statut === "REVIEWED").length || 0;
  const acceptedCount =
    applications?.filter((a) => a.statut === "ACCEPTED").length || 0;
  const rejectedCount =
    applications?.filter((a) => a.statut === "REJECTED").length || 0;

  const tabItems: TabItem[] = useMemo(
    () => [
      {
        id: "details",
        label: "Détails",
        icon: <FileText className="size-4" />,
        content: (
          <div className="space-y-6">
            {/* Informations principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Statut</div>
                <div>{getStatusBadge(offer.statut)}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="size-4" />
                  Candidatures
                </div>
                <div className="text-xl font-semibold">
                  {offer.nombreCandidatures}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="size-4" />
                  Date de création
                </div>
                <div>
                  {format(new Date(offer.dateCreation), "dd MMMM yyyy", {
                    locale: fr,
                  })}
                </div>
              </div>

              {offer.dateLimite && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="size-4" />
                    Date limite
                  </div>
                  <div>
                    {format(new Date(offer.dateLimite), "dd MMMM yyyy", {
                      locale: fr,
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-muted-foreground">
                Description
              </div>
              <div className="bg-muted/30 rounded-2xl p-6">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {offer.description}
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "applications",
        label: "Candidatures",
        icon: <Users className="size-4" />,
        badge: offer.nombreCandidatures,
        content: isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner className="size-8" />
          </div>
        ) : applications && applications.length > 0 ? (
          <JobApplicationsList applications={applications} />
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="size-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Aucune candidature pour cette offre
            </p>
          </div>
        ),
      },
      {
        id: "stats",
        label: "Statistiques",
        icon: <Eye className="size-4" />,
        content: (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-3xl p-6 text-center">
              <Clock className="size-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {pendingCount}
              </div>
              <div className="text-sm text-blue-600/80 mt-1">En attente</div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-3xl p-6 text-center">
              <Eye className="size-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {reviewedCount}
              </div>
              <div className="text-sm text-purple-600/80 mt-1">Examinées</div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-3xl p-6 text-center">
              <CheckCircle className="size-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {acceptedCount}
              </div>
              <div className="text-sm text-green-600/80 mt-1">Acceptées</div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
              <XCircle className="size-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">
                {rejectedCount}
              </div>
              <div className="text-sm text-red-600/80 mt-1">Refusées</div>
            </div>
          </div>
        ),
      },
    ],
    [
      offer,
      applications,
      isLoading,
      pendingCount,
      reviewedCount,
      acceptedCount,
      rejectedCount,
    ],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl font-bold pr-8">
                {offer.titre}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Créée par {offer.utilisateurNom}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6">
          <Tabs items={tabItems} defaultTab="details" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
