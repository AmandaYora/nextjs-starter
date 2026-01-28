"use client";

import { ReactNode, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { deleteUserAction } from "@/features/users/server/actions";

type Props = {
  trigger: ReactNode;
  userId: string;
};

export function UserDeleteDialog({ trigger, userId }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteUserAction({ id: userId });
      if (result.status === "success") {
        toast.success(result.message ?? "User deleted.");
        setOpen(false);
      } else {
        const base = result.message ?? "Unable to delete user.";
        const formatted = result.requestId ? `${base} (ref: ${result.requestId})` : base;
        toast.error(formatted);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete user?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. The user will permanently lose access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={pending}>
            {pending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
