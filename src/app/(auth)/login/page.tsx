"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import { ROUTES, ROLE_TO_DASHBOARD } from "@/lib/constants";
import { login, setStoredToken, setStoredUser, setAuthCookie } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      const { accessToken, user } = res.data;
      setStoredToken(accessToken);
      setStoredUser(user);
      setAuthCookie();
      const redirect = user?.currentRole
        ? (ROLE_TO_DASHBOARD[user.currentRole] ?? ROUTES.member)
        : ROUTES.member;
      router.push(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-[#CCD7E2]">
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 bg-slate-900">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url("https://i.ibb.co.com/5XQGqjGJ/sec-eee.jpg")`,
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/60 via-primary/30 to-primary/20 mix-blend-multiply" />
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-y-auto bg-[#F8FAFC]">
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[var(--text-main)] font-bold text-lg">
            Department of EEE
          </span>
        </div>

        <div className="w-full max-w-[440px] flex flex-col">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-[28px] text-slate-900 font-bold leading-tight tracking-tight mb-2">
              Department of EEE Login
            </h2>
            <p className="text-slate-600 font-normal leading-normal">
              Please enter your details to access the dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-medium leading-normal">
                Email
              </label>
              <div className="flex w-full items-stretch rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-slate-900 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 bg-white text-slate-500 border-r border-slate-200">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="flex-1 w-full h-14 bg-white text-slate-900 placeholder-slate-400 px-4 focus:outline-none text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-medium leading-normal">
                Password
              </label>
              <div className="flex w-full items-stretch rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-slate-900 transition-all overflow-hidden relative">
                <div className="flex items-center justify-center px-4 bg-white text-slate-500 border-r border-slate-200">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  className="flex-1 w-full h-14 bg-white text-slate-900 px-4 focus:outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center px-4 bg-white text-slate-500 border-l border-slate-200 hover:text-slate-900 transition-colors">
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 bg-white"
                />
                <span className="text-sm font-normal text-slate-600 group-hover:text-slate-900 transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-slate-800 hover:underline transition-colors">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-slate-700 text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href={ROUTES.register}
                  className="font-medium text-slate-800 hover:underline ml-1">
                  Sign Up
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-12 text-center lg:text-left border-t border-slate-200 pt-6">
            <p className="text-xs text-slate-700 text-center">
              Copyright © EEE Department. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
