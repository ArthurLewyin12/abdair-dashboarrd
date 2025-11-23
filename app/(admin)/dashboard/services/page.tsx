"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicesTable } from "@/components/pages/services/services-table";
import { ServicesStats } from "@/components/pages/services/services-stats";
import { CreateServiceDialog } from "@/components/pages/services/create-service-dialog";
import { ServiceDetailsDialog } from "@/components/pages/services/service-details-dialog";
import { Service } from "@/types/service";

export default function ServicesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les services proposés
          </p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="rounded-3xl gap-2"
          size="lg"
        >
          <Plus className="size-4" />
          Nouveau service
        </Button>
      </div>

      {/* Stats Cards */}
      <ServicesStats />

      {/* Table */}
      <div className="">
        <ServicesTable onSelectService={setSelectedService} />
      </div>

      {/* Dialogs */}
      <CreateServiceDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {selectedService && (
        <ServiceDetailsDialog
          service={selectedService}
          open={!!selectedService}
          onOpenChange={(open) => !open && setSelectedService(null)}
        />
      )}
    </div>
  );
}
