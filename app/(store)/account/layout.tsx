import { AccountNav } from "@/components/account/AccountNav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-4">
            <p className="mb-4 px-4 text-xs font-semibold tracking-wider text-muted uppercase">
              My Account
            </p>
            <AccountNav />
          </div>
        </aside>
        <div className="min-w-0 lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
