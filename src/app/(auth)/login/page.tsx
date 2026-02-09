'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
      {/* Left: Branding (Desktop) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-end p-12 bg-slate-900">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200")`,
          }}
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-primary/90 via-primary/50 to-primary/20 mix-blend-multiply" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-black/60" />
        <div className="relative z-20 max-w-lg mb-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white">
              <Zap className="w-8 h-8" />
            </div>
            <span className="text-white font-bold text-xl tracking-wide">EEE DEPT</span>
          </div>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4 tracking-tight">
            Empowering EEE Innovation
          </h1>
          <p className="text-white/90 text-lg font-light leading-relaxed max-w-md">
            Departmental Management System for streamlined administration, resource allocation, and
            student collaboration.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative bg-[var(--background)] overflow-y-auto">
        <div className="lg:hidden mb-8 flex items-center gap-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-white">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[var(--text-main)] font-bold text-lg">EEE DEPT</span>
        </div>

        <div className="w-full max-w-[440px] flex flex-col">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-[var(--text-main)] text-[28px] font-bold leading-tight tracking-tight mb-2">
              EEE Dept. Login
            </h2>
            <p className="text-[var(--text-sub)] dark:text-slate-400 text-base font-normal leading-normal">
              Please enter your details to access the dashboard.
            </p>
          </div>

          <form className="flex flex-col gap-5 w-full" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-[var(--text-main)] dark:text-slate-200 text-base font-medium leading-normal">
                Username or Email
              </label>
              <div className="flex w-full items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 transition-all">
                <div className="flex items-center justify-center pl-4 bg-[var(--input-bg)] dark:bg-slate-800 border border-[var(--input-border)] dark:border-slate-700 border-r-0 rounded-l-lg text-[var(--text-sub)]">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  required
                  className="flex-1 w-full h-14 bg-[var(--input-bg)] dark:bg-slate-800 text-[var(--text-main)] dark:text-white placeholder-[var(--text-sub)] border border-[var(--input-border)] dark:border-slate-700 border-l-0 rounded-r-lg px-4 focus:outline-none focus:border-[var(--input-border)] text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[var(--text-main)] dark:text-slate-200 text-base font-medium leading-normal">
                Password
              </label>
              <div className="flex w-full items-stretch rounded-lg group focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-1 transition-all relative">
                <div className="flex items-center justify-center pl-4 bg-[var(--input-bg)] dark:bg-slate-800 border border-[var(--input-border)] dark:border-slate-700 border-r-0 rounded-l-lg text-[var(--text-sub)]">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  className="flex-1 w-full h-14 bg-[var(--input-bg)] dark:bg-slate-800 text-[var(--text-main)] dark:text-white placeholder-[var(--text-sub)] border border-[var(--input-border)] dark:border-slate-700 border-l-0 border-r-0 px-4 focus:outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center pr-4 bg-[var(--input-bg)] dark:bg-slate-800 border border-[var(--input-border)] dark:border-slate-700 border-l-0 rounded-r-lg text-[var(--text-sub)] hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--input-border)] text-primary focus:ring-primary bg-[var(--input-bg)] dark:bg-slate-800"
                />
                <span className="text-sm font-normal text-[var(--text-sub)] group-hover:text-[var(--text-main)] transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="#"
                className="text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 mt-2">
              Sign In
            </Button>

            <div className="mt-4 text-center">
              <p className="text-[var(--text-sub)] dark:text-slate-400 text-sm">
                Don&apos;t have an account?{' '}
                <Link href="#" className="font-medium text-primary hover:underline ml-1">
                  Contact Admin
                </Link>
              </p>
            </div>
          </form>

          <div className="mt-12 text-center lg:text-left border-t border-slate-200 dark:border-slate-800 pt-6">
            <p className="text-xs text-[var(--text-sub)]/70 dark:text-slate-600">
              Copyright © 2023 EEE Department. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
