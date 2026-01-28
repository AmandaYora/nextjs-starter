"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { logger } from "@/shared/lib/logger";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: Props) {
  useEffect(() => {
    logger.error("dashboard-route-error", { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
      <h1 className="text-xl font-semibold">Unable to load the dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while rendering this page. Please try again.
      </p>
      <div className="mt-4 flex justify-center">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
