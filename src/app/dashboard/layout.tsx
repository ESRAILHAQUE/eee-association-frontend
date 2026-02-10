"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { getStoredToken, getStoredUser } from "@/lib/api";
import { ROUTES, ROLE_TO_DASHBOARD } from "@/lib/constants";

type Role = "admin" | "superAdmin" | "cr" | "moderator" | "member";

function getRoleFromPath(pathname: string): Role {
  if (pathname.startsWith("/dashboard/super-admin")) return "superAdmin";
  if (pathname.startsWith("/dashboard/cr")) return "cr";
  if (pathname.startsWith("/dashboard/moderator")) return "moderator";
  if (pathname.startsWith("/dashboard/member")) return "member";
  return "admin";
}

/** User's currentRole from backend -> layout role key */
function pathRoleMatchesUser(pathRole: Role, userRole: string | undefined): boolean {
  if (!userRole) return false;
  const map: Record<Role, string> = {
    superAdmin: "super_admin",
    admin: "admin",
    cr: "cr",
    moderator: "moderator",
    member: "student",
  };
  return map[pathRole] === userRole;
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const pathRole = getRoleFromPath(pathname);
  const token = getStoredToken();
  const user = getStoredUser();

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReady(false);
    if (!token || !user) {
      router.replace(ROUTES.login);
      return;
    }
    if (!pathRoleMatchesUser(pathRole, user.currentRole)) {
      const dashboardPath = ROLE_TO_DASHBOARD[user.currentRole ?? "student"] ?? ROUTES.member;
      router.replace(dashboardPath);
      return;
    }
    setReady(true);
  }, [pathname, pathRole, token, user, router]);

  if (!ready || !token || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  const isPending = pathRole === "member" && user?.isVerified === false;

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

  return <DashboardLayout role={pathRole} user={user}>{children}</DashboardLayout>;
}
