"use client";

import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Mail,
  Phone,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Trash2,
} from "lucide-react";

import { JobApplication, JobApplicationStatus } from "@/types/job-application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useUpdateApplicationStatus,
  useDeleteApplication,
} from "@/hooks/useJobApplications";
import ENVIRONNEMENTS from "@/constants/environnements";

interface JobApplicationsListProps {
  applications: JobApplication[];
}

export function JobApplicationsList({
  applications,
}: JobApplicationsListProps) {
  const updateStatusMutation = useUpdateApplicationStatus();
  const deleteMutation = useDeleteApplication();

  const getStatusBadge = (status: JobApplicationStatus) => {
    const variants: Record<
      JobApplicationStatus,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
      }
    > = {
      [JobApplicationStatus.PENDING]: {
        label: "En attente",
        variant: "outline",
        icon: <Clock className="size-3" />,
      },
      [JobApplicationStatus.REVIEWED]: {
        label: "Examinée",
        variant: "secondary",
        icon: <Eye className="size-3" />,
      },
      [JobApplicationStatus.ACCEPTED]: {
        label: "Acceptée",
        variant: "default",
        icon: <CheckCircle className="size-3" />,
      },
      [JobApplicationStatus.REJECTED]: {
        label: "Refusée",
        variant: "destructive",
        icon: <XCircle className="size-3" />,
      },
    };

    const config = variants[status];
    return (
      <Badge variant={config.variant} className="rounded-2xl gap-1.5">
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const handleStatusChange = (id: number, status: JobApplicationStatus) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id: number, candidateName: string) => {
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer la candidature de ${candidateName} ?`
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application.id}
          className="border rounded-3xl p-6 hover:shadow-md transition-shadow bg-white"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold">
                {application.prenom} {application.nom}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Candidature soumise le{" "}
                {format(new Date(application.dateCreation), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
            {getStatusBadge(application.statut)}
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="size-4 text-muted-foreground" />
              <a
                href={`mailto:${application.email}`}
                className="text-blue-600 hover:underline"
              >
                {application.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="size-4 text-muted-foreground" />
              <a
                href={`tel:${application.numeroTelephone}`}
                className="hover:underline"
              >
                {application.numeroTelephone}
              </a>
            </div>
          </div>

          {/* Message */}
          {application.message && (
            <div className="bg-muted/30 rounded-2xl p-4 mb-4">
              <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                <FileText className="size-4" />
                Message de motivation
              </div>
              <p className="text-sm leading-relaxed">{application.message}</p>
            </div>
          )}

          {/* CV Download */}
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl gap-2"
              asChild
            >
              <a
                href={`${ENVIRONNEMENTS.API_URL}${application.cvUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="size-4" />
                Télécharger le CV ({application.nomFichierCv})
              </a>
            </Button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t">
            {application.statut !== JobApplicationStatus.REVIEWED && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-2xl gap-2"
                onClick={() =>
                  handleStatusChange(
                    application.id,
                    JobApplicationStatus.REVIEWED
                  )
                }
                disabled={updateStatusMutation.isPending}
              >
                <Eye className="size-4" />
                Marquer comme examinée
              </Button>
            )}

            {application.statut !== JobApplicationStatus.ACCEPTED && (
              <Button
                size="sm"
                variant="default"
                className="rounded-2xl gap-2 bg-green-600 hover:bg-green-700"
                onClick={() =>
                  handleStatusChange(
                    application.id,
                    JobApplicationStatus.ACCEPTED
                  )
                }
                disabled={updateStatusMutation.isPending}
              >
                <CheckCircle className="size-4" />
                Accepter
              </Button>
            )}

            {application.statut !== JobApplicationStatus.REJECTED && (
              <Button
                size="sm"
                variant="destructive"
                className="rounded-2xl gap-2"
                onClick={() =>
                  handleStatusChange(
                    application.id,
                    JobApplicationStatus.REJECTED
                  )
                }
                disabled={updateStatusMutation.isPending}
              >
                <XCircle className="size-4" />
                Refuser
              </Button>
            )}

            <div className="flex-1" />

            <Button
              size="sm"
              variant="ghost"
              className="rounded-2xl gap-2 text-destructive hover:text-destructive"
              onClick={() =>
                handleDelete(
                  application.id,
                  `${application.prenom} ${application.nom}`
                )
              }
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="size-4" />
              Supprimer
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
