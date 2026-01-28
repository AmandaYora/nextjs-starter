"use client";

import { useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { logger } from "@/shared/lib/logger";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function UsersError({ error, reset }: Props) {
  useEffect(() => {
    logger.error("users-route-error", { digest: error.digest, message: error.message });
  }, [error]);

  return (
    <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
      <h1 className="text-xl font-semibold">Unable to load users</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong while loading the table. Please try again.
      </p>
      <div className="mt-4 flex justify-center">
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
