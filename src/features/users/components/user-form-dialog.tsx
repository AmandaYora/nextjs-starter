"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  createUserSchema,
  type CreateUserInput,
  type UpdateUserInput,
  updateUserSchema,
} from "@/features/users/schemas";
import {
  createUserAction,
  updateUserAction,
} from "@/features/users/server/actions";
import { DEFAULT_ROLE, USER_ROLES, type UserRole } from "@/shared/auth/roles";
import { cn } from "@/shared/lib/utils";
import { type ActionState } from "@/shared/types/actions";

type Props = {
  trigger: ReactNode;
  defaultValues?: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  mode: "create" | "edit";
};

type FormValues = {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
};

export function UserFormDialog({ trigger, defaultValues, mode }: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<ActionState>({ status: "idle" });
  const [pending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(mode === "create" ? createUserSchema : updateUserSchema),
    defaultValues:
      mode === "create"
        ? {
            name: "",
            email: "",
            password: "",
            role: DEFAULT_ROLE,
          }
        : {
            id: defaultValues?.id,
            name: defaultValues?.name,
            email: defaultValues?.email,
            role: defaultValues?.role,
            password: undefined,
          },
  });

  const onSubmit = (values: FormValues) => {
    const formatErrorMessage = (message?: string, requestId?: string, fallback = "Please check the form.") => {
      const base = message ?? fallback;
      return requestId ? `${base} (ref: ${requestId})` : base;
    };

    startTransition(async () => {
      const payload =
        mode === "create"
          ? (values as CreateUserInput)
          : ({
              ...(values as UpdateUserInput),
              password: values.password ? values.password : undefined,
            } satisfies UpdateUserInput);

      const result =
        mode === "create"
          ? await createUserAction(payload as CreateUserInput)
          : await updateUserAction(payload as UpdateUserInput);

      setState(result);

      if (result.status === "success") {
        toast.success(result.message ?? "Success");
        setOpen(false);
        form.reset();
      } else if (result.fieldErrors) {
        Object.entries(result.fieldErrors).forEach(([key, message]) => {
          form.setError(key as keyof FormValues, {
            message: message?.[0],
          });
        });
        toast.error(formatErrorMessage(result.message, result.requestId));
      } else {
        toast.error(formatErrorMessage(result.message, result.requestId, "Unable to process the form."));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Create user" : "Edit user"}</DialogTitle>
          <DialogDescription>Users must have a role and valid credentials.</DialogDescription>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && (
              <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              {...form.register("role")}
            >
              {USER_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{mode === "create" ? "Password" : "Reset password"}</Label>
            <Input
              id="password"
              type="password"
              placeholder={mode === "edit" ? "Leave blank to keep current password" : undefined}
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            )}
          </div>
          {mode === "edit" && (
            <input type="hidden" value={defaultValues?.id} {...form.register("id")} />
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending} className={cn(pending && "opacity-80")}>
              {pending ? "Saving..." : mode === "create" ? "Create user" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
        {state.status === "error" && state.message && (
          <p className="text-sm text-red-600">
            {state.requestId ? `${state.message} (ref: ${state.requestId})` : state.message}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
