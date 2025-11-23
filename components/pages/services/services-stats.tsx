"use client";

import { CheckCircle2, XCircle, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/useServices";

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

export function ServicesStats() {
  const { data: services, isLoading } = useServices();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    );
  }

  const stats = {
    total: services?.length || 0,
    active: services?.filter((s) => s.actif).length || 0,
    inactive: services?.filter((s) => !s.actif).length || 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total des services"
        value={stats.total}
        icon={<Briefcase className="size-5" />}
        iconBgColor="bg-blue-100 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="Services actifs"
        value={stats.active}
        icon={<CheckCircle2 className="size-5" />}
        iconBgColor="bg-green-100 dark:bg-green-950"
        iconColor="text-green-600 dark:text-green-400"
      />

      <StatCard
        title="Services inactifs"
        value={stats.inactive}
        icon={<XCircle className="size-5" />}
        iconBgColor="bg-orange-100 dark:bg-orange-950"
        iconColor="text-orange-600 dark:text-orange-400"
      />
    </div>
  );
}