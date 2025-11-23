"use client";

import Link from "next/link";
import { IconBriefcase, IconTool } from "@tabler/icons-react";
import { useJobOffers } from "@/hooks/useJobOffers";
import { useServices } from "@/hooks/useServices";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SectionCards() {
  const { data: offers, isLoading: isLoadingOffers } = useJobOffers();
  const { data: services, isLoading: isLoadingServices } = useServices();

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:px-6">
      <Link href="/dashboard/job-offers">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>Offres d'emploi</CardDescription>
              {isLoadingOffers ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <CardTitle className="text-3xl font-bold">
                  {offers?.length || 0}
                </CardTitle>
              )}
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-3xl">
              <IconBriefcase className="size-6" />
            </div>
          </CardHeader>
        </Card>
      </Link>

      <Link href="/dashboard/services">
        <Card className="hover:bg-muted/50 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardDescription>Services</CardDescription>
              {isLoadingServices ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <CardTitle className="text-3xl font-bold">
                  {services?.length || 0}
                </CardTitle>
              )}
            </div>
            <div className="bg-green-100 text-green-600 p-3 rounded-3xl">
              <IconTool className="size-6" />
            </div>
          </CardHeader>
        </Card>
      </Link>
    </div>
  );
}
