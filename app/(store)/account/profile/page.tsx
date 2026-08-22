"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { useToast } from "@/components/providers/toast-provider";
import { useAuthStore, type AuthUser } from "@/store/auth-store";
import { apiGet, apiPatch, apiPost } from "@/lib/api/client";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

type ProfileForm = z.infer<typeof profileSchema>;
type LoginForm = z.infer<typeof loginSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, token, setAuth, setUser, isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", email: "", phone: "" },
  });

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "priya.mehta@email.com", password: "customer123" },
  });

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiGet<{
          id: string;
          name: string;
          email: string;
          phone?: string;
          role: string;
        }>("/users/me");

        profileForm.reset({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone ?? "",
        });
        setUser(res.data);
      } catch {
        toast("Session expired. Please sign in again.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onLogin = async (data: LoginForm) => {
    try {
      const res = await apiPost<{ user: AuthUser; token: string }>(
        "/auth/login",
        data
      );
      setAuth(res.data.user, res.data.token);
      profileForm.reset({
        name: res.data.user.name,
        email: res.data.user.email,
        phone: res.data.user.phone ?? "",
      });
      toast("Signed in successfully");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Login failed", "error");
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    if (!token) {
      toast("Please sign in to update your profile", "error");
      return;
    }

    try {
      const res = await apiPatch<{
        id: string;
        name: string;
        email: string;
        phone?: string;
      }>("/users/me", data);

      if (user) {
        setUser({ ...user, ...res.data });
      }
      profileForm.reset({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone ?? "",
      });
      toast("Profile saved to database");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to save profile", "error");
    }
  };

  if (loading && token) {
    return (
      <div>
        <PageHeader title="Profile" description="Loading your profile..." />
        <div className="h-48 animate-pulse rounded-2xl bg-border/40" />
      </div>
    );
  }

  if (!isAuthenticated()) {
    return (
      <div>
        <PageHeader
          title="Profile"
          description="Sign in to view and update your profile."
        />
        <form
          onSubmit={loginForm.handleSubmit(onLogin)}
          className="max-w-lg space-y-5 rounded-2xl border border-border bg-surface p-6"
        >
          <p className="text-sm text-muted">
            Use your VALA account credentials. Demo:{" "}
            <span className="font-medium text-foreground">priya.mehta@email.com</span> /{" "}
            <span className="font-medium text-foreground">customer123</span>
          </p>
          <div>
            <label htmlFor="login-email" className="mb-2 block text-xs font-medium text-muted">
              Email
            </label>
            <Input id="login-email" type="email" {...loginForm.register("email")} />
            {loginForm.formState.errors.email && (
              <p className="mt-1 text-xs text-error">{loginForm.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="login-password" className="mb-2 block text-xs font-medium text-muted">
              Password
            </label>
            <Input id="login-password" type="password" {...loginForm.register("password")} />
            {loginForm.formState.errors.password && (
              <p className="mt-1 text-xs text-error">{loginForm.formState.errors.password.message}</p>
            )}
          </div>
          <Button type="submit" variant="primary" disabled={loginForm.formState.isSubmitting}>
            {loginForm.formState.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description={user ? `Signed in as ${user.email}` : "Update your personal information."}
      />

      <form
        onSubmit={profileForm.handleSubmit(onSubmit)}
        className="max-w-lg space-y-5 rounded-2xl border border-border bg-surface p-6"
      >
        <div>
          <label htmlFor="name" className="mb-2 block text-xs font-medium text-muted">
            Full Name
          </label>
          <Input id="name" {...profileForm.register("name")} />
          {profileForm.formState.errors.name && (
            <p className="mt-1 text-xs text-error">{profileForm.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-xs font-medium text-muted">
            Email
          </label>
          <Input id="email" type="email" {...profileForm.register("email")} />
          {profileForm.formState.errors.email && (
            <p className="mt-1 text-xs text-error">{profileForm.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block text-xs font-medium text-muted">
            Phone
          </label>
          <Input id="phone" type="tel" {...profileForm.register("phone")} />
          {profileForm.formState.errors.phone && (
            <p className="mt-1 text-xs text-error">{profileForm.formState.errors.phone.message}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="primary" disabled={profileForm.formState.isSubmitting}>
            {profileForm.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          <Link href="/account">
            <Button type="button" variant="outline">
              Back to Account
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
