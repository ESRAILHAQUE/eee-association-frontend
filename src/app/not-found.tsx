"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Home, Zap, Cpu, Cable } from "lucide-react";
import { ROUTES, ROLE_TO_DASHBOARD } from "@/lib/constants";
import { getStoredUser } from "@/lib/api";

export default function NotFound() {
  const [dashboardHref, setDashboardHref] = useState("/dashboard");

  useEffect(() => {
    const user = getStoredUser();
    const href = user?.currentRole
      ? (ROLE_TO_DASHBOARD[user.currentRole] ?? ROUTES.member)
      : "/dashboard";
    setDashboardHref(href);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-[var(--background)] flex flex-col">
      {/* Background blurs */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full" aria-hidden />
      <div className="fixed bottom-0 left-0 -z-10 w-1/4 h-1/4 bg-primary/5 blur-[100px] rounded-full" aria-hidden />

      {/* Main content - centered, no header */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-6 text-center min-h-0">
        <div className="max-w-2xl w-full">
          {/* Circuit illustration */}
          <div className="relative mb-4 md:mb-6 flex justify-center shrink-0">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 relative">
              {/* Abstract electrical background */}
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" aria-hidden />
              {/* Broken circuit SVG - matches HTML structure */}
              <svg
                className="w-full h-full relative z-10 drop-shadow-xl text-primary"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Left connector: rect terminal + path line */}
                <rect x="15" y="92" width="12" height="16" rx="2" fill="currentColor" />
                <path
                  d="M20 100 L70 100"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                {/* Right connector: path line + rect terminal */}
                <path
                  d="M130 100 L180 100"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="8"
                />
                <rect x="173" y="92" width="12" height="16" rx="2" fill="currentColor" />
                {/* Broken ends with circles */}
                <circle cx="75" cy="100" r="6" fill="currentColor" />
                <circle cx="125" cy="100" r="6" fill="currentColor" />
                {/* Electrical arcs / sparks (chevrons) */}
                <path
                  d="M85 85 L100 70 L115 85"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                  opacity="0.6"
                />
                <path
                  d="M90 115 L100 130 L110 115"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="3"
                  opacity="0.4"
                />
                {/* Central 404 */}
                <text
                  x="100"
                  y="155"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-primary font-extrabold"
                  style={{
                    fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                    fontSize: 28,
                    fontWeight: 900,
                  }}
                >
                  404
                </text>
              </svg>
              {/* Floating nodes decor */}
              <div className="absolute top-10 right-10 w-3 h-3 bg-primary rounded-full opacity-40" aria-hidden />
              <div className="absolute bottom-12 left-8 w-4 h-4 bg-primary rounded-full opacity-20" aria-hidden />
            </div>
          </div>

          {/* Error messaging */}
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Short Circuit! <span className="text-primary">Error 404</span>
            </h1>
            <p className="text-base md:text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
              The page you are looking for has been{" "}
              <span className="font-semibold text-slate-800">disconnected</span> or moved. It seems our
              circuits are down for this specific path.
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={dashboardHref}
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-5 h-5" />
              Return to Dashboard
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
          </div>

          {/* Decorative icons */}
          <div className="mt-6 md:mt-8 grid grid-cols-3 gap-6 opacity-20 grayscale pointer-events-none" aria-hidden>
            <div className="flex flex-col items-center">
              <Cpu className="w-10 h-10 text-primary" />
            </div>
            <div className="flex flex-col items-center">
              <Cable className="w-10 h-10 text-primary" />
            </div>
            <div className="flex flex-col items-center">
              <Zap className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 text-center text-sm text-slate-500 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2024 EEE Departmental Association. All systems operational.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-primary transition-colors">
              Report Technical Issue
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Support Desk
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
