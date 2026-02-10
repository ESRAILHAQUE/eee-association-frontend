"use client";

import { usePathname } from "next/navigation";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getStoredUser } from "@/lib/api";

type Role = "admin" | "superAdmin" | "cr" | "moderator" | "member";

function getRoleFromPath(pathname: string): Role {
  if (pathname.startsWith("/dashboard/super-admin")) return "superAdmin";
  if (pathname.startsWith("/dashboard/cr")) return "cr";
  if (pathname.startsWith("/dashboard/moderator")) return "moderator";
  if (pathname.startsWith("/dashboard/member")) return "member";
  return "admin";
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const role = getRoleFromPath(pathname);
  const user = getStoredUser();
  const isPending = role === "member" && user?.isVerified === false;

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--background)] p-6">
        <div className="w-full max-w-md rounded-xl border border-amber-200 bg-amber-50/80 p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <span className="text-2xl">⏳</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Account Pending</h1>
          <p className="mt-2 text-slate-600">
            Your account is pending admin verification. After approval you will
            get full access to the dashboard, profile, and all features.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            You can sign out and sign in again once your account is verified.
          </p>
        </div>
      </div>
    );
  }

  return <DashboardLayout role={role}>{children}</DashboardLayout>;
}
