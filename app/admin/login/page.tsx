"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/providers/toast-provider";
import { useAuthStore, type AuthUser } from "@/store/auth-store";
import { apiPost } from "@/lib/api/client";
import { isAdminRole, useAdminAuth } from "@/hooks/use-admin-auth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { isAuthenticated, isReady } = useAdminAuth();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace("/admin");
    }
  }, [isReady, isAuthenticated, router]);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@vala.com",
      password: "admin123",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      const res = await apiPost<{ user: AuthUser; token: string }>("/auth/login", data);

      if (!isAdminRole(res.data.user.role)) {
        toast("This account does not have admin access.", "error");
        return;
      }

      setAuth(res.data.user, res.data.token);
      toast("Welcome back, Admin");
      router.replace("/admin");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Login failed", "error");
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-primary">VALA Admin</h1>
            <p className="text-sm text-muted">Sign in to manage the store</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-xs font-medium text-muted">
              Email
            </label>
            <Input id="admin-email" type="email" {...form.register("email")} />
            {form.formState.errors.email && (
              <p className="mt-1 text-xs text-error">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-2 block text-xs font-medium text-muted">
              Password
            </label>
            <Input id="admin-password" type="password" {...form.register("password")} />
            {form.formState.errors.password && (
              <p className="mt-1 text-xs text-error">{form.formState.errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Demo: admin@vala.com / admin123
        </p>
      </div>
    </div>
  );
}
