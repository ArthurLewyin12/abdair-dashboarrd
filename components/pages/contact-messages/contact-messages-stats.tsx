"use client";

import { Mail, CheckCircle2, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useContactMessages } from "@/hooks/useContactMessages";
import { MessageStatus } from "@/types/contact-message";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

function StatCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
}: StatCardProps) {
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

export function ContactMessagesStats() {
  const { data: messages, isLoading } = useContactMessages();

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
    total: messages?.length || 0,
    new: messages?.filter((m) => m.statut === MessageStatus.NEW).length || 0,
    read: messages?.filter((m) => m.statut === MessageStatus.READ).length || 0,
    replied:
      messages?.filter((m) => m.statut === MessageStatus.REPLIED).length || 0,
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total des messages"
        value={stats.total}
        icon={<Mail className="size-5" />}
        iconBgColor="bg-blue-100 dark:bg-blue-950"
        iconColor="text-blue-600 dark:text-blue-400"
      />

      <StatCard
        title="Nouveaux"
        value={stats.new}
        icon={<Clock className="size-5" />}
        iconBgColor="bg-orange-100 dark:bg-orange-950"
        iconColor="text-orange-600 dark:text-orange-400"
      />

      <StatCard
        title="Lus"
        value={stats.read}
        icon={<MessageSquare className="size-5" />}
        iconBgColor="bg-purple-100 dark:bg-purple-950"
        iconColor="text-purple-600 dark:text-purple-400"
      />

      <StatCard
        title="Répondus"
        value={stats.replied}
        icon={<CheckCircle2 className="size-5" />}
        iconBgColor="bg-green-100 dark:bg-green-950"
        iconColor="text-green-600 dark:text-green-400"
      />
    </div>
  );
}
