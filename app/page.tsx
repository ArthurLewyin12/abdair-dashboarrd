"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/useSession";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, isLoading } = useSession();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isLoading, isLoggedIn, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <Spinner className="size-8" />
    </div>
  );
}
