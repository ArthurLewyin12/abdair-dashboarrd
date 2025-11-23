"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobOffersTable } from "@/components/pages/job-offers/job-offers-table";
import { JobOffersStats } from "@/components/pages/job-offers/job-offers-stats";
import { CreateJobOfferDialog } from "@/components/pages/job-offers/create-job-offer-dialog";
import { JobOfferDetailsDialog } from "@/components/pages/job-offers/job-offer-details-dialog";
import { JobOffer } from "@/types/job-offer";

export default function JobOffersPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<JobOffer | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Offres d'emploi</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos offres d'emploi et consultez les candidatures reçues
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="rounded-3xl gap-2"
          size="lg"
        >
          <Plus className="size-4" />
          Nouvelle offre
        </Button>
      </div>

      {/* Stats Cards */}
      <JobOffersStats />

      {/* Table */}
      <div className="">
        <JobOffersTable onSelectOffer={setSelectedOffer} />
      </div>

      {/* Dialogs */}
      <CreateJobOfferDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedOffer && (
        <JobOfferDetailsDialog
          offer={selectedOffer}
          open={!!selectedOffer}
          onOpenChange={(open) => !open && setSelectedOffer(null)}
        />
      )}
    </div>
  );
}
