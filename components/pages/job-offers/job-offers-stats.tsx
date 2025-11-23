"use client";

import { Briefcase, CheckCircle2, XCircle, FileText, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useJobOffers } from "@/hooks/useJobOffers";
import { JobOfferStatus } from "@/types/job-offer";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

function StatCard({ title, value, icon, iconBgColor, iconColor }: StatCardProps) {
  return (
    <Card className="rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <div className={`${iconBgColor} ${iconColor} p-3 rounded-3xl`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card className="rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="size-12 rounded-3xl" />
        </div>
      </CardContent>
    </Card>
  );
}

export function JobOffersStats() {
  const { data: offers, isLoading } = useJobOffers();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const stats = {
    total: offers?.length || 0,
    open: offers?.filter((o) => o.statut === JobOfferStatus.OPEN).length || 0,
    closed: offers?.filter((o) => o.statut === JobOfferStatus.CLOSED).length || 0,
    archived: offers?.filter((o) => o.statut === JobOfferStatus.ARCHIVED).length || 0,
    totalApplications: offers?.reduce((acc, offer) => acc + (offer.nombreCandidatures || 0), 0) || 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total des offres"
        value={stats.total}
        icon={<Briefcase className="size-5" />}
        iconBgColor="bg-blue-100 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="Offres ouvertes"
        value={stats.open}
        icon={<CheckCircle2 className="size-5" />}
        iconBgColor="bg-green-100 dark:bg-green-950"
        iconColor="text-green-600 dark:text-green-400"
      />

      <StatCard
        title="Offres fermées"
        value={stats.closed}
        icon={<XCircle className="size-5" />}
        iconBgColor="bg-orange-100 dark:bg-orange-950"
        iconColor="text-orange-600 dark:text-orange-400"
      />

      <StatCard
        title="Total candidatures"
        value={stats.totalApplications}
        icon={<Users className="size-5" />}
        iconBgColor="bg-purple-100 dark:bg-purple-950"
        iconColor="text-purple-600 dark:text-purple-400"
      />
    </div>
  );
}
