'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Hash, Lock, Eye, EyeOff, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';
import { ROUTES } from '@/lib/constants';
import { register } from '@/lib/api';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    registrationNumber: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        registrationNumber: form.registrationNumber.trim(),
        password: form.password,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#CCD7E2] p-6">
        <div className="w-full max-w-[440px] rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-center text-xl font-bold text-slate-900">Registration successful</h2>
          <p className="mt-2 text-center text-slate-600">
            Your account is pending admin approval. You will be able to sign in once an admin verifies your account.
          </p>
          <Link
            href={ROUTES.login}
            className="mt-6 block w-full"
          >
            <Button type="button" className="w-full" variant="primary">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="text-[var(--text-main)] font-bold text-lg">Department of EEE</span>
        </div>

        <div className="w-full max-w-[440px] flex flex-col">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-[28px] text-slate-900 font-bold leading-tight tracking-tight mb-2">
              Create Account
            </h2>
            <p className="text-slate-600 font-normal leading-normal">
              Sign up with your details. You can sign in after admin approval.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-medium leading-normal">Full Name</label>
              <div className="flex w-full items-stretch rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-slate-900 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 bg-white text-slate-500 border-r border-slate-200">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Your full name"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="flex-1 w-full h-14 bg-white text-slate-900 placeholder-slate-400 px-4 focus:outline-none text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-medium leading-normal">Email</label>
              <div className="flex w-full items-stretch rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-slate-900 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 bg-white text-slate-500 border-r border-slate-200">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  placeholder="student@university.edu"
                  required
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="flex-1 w-full h-14 bg-white text-slate-900 placeholder-slate-400 px-4 focus:outline-none text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-medium leading-normal">Registration Number</label>
              <div className="flex w-full items-stretch rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-slate-900 transition-all overflow-hidden">
                <div className="flex items-center justify-center px-4 bg-white text-slate-500 border-r border-slate-200">
                  <Hash className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. 2020338501"
                  required
                  value={form.registrationNumber}
                  onChange={(e) => setForm((f) => ({ ...f, registrationNumber: e.target.value }))}
                  className="flex-1 w-full h-14 bg-white text-slate-900 px-4 focus:outline-none text-base"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-slate-900 font-medium leading-normal">Password</label>
              <div className="flex w-full items-stretch rounded-lg border border-slate-300 bg-white focus-within:ring-1 focus-within:ring-slate-900 transition-all overflow-hidden relative">
                <div className="flex items-center justify-center px-4 bg-white text-slate-500 border-r border-slate-200">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="flex-1 w-full h-14 bg-white text-slate-900 px-4 focus:outline-none text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center px-4 bg-white text-slate-500 border-l border-slate-200 hover:text-slate-900 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 mt-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>

            <div className="mt-4 text-center">
              <p className="text-slate-700 text-sm">
                Already have an account?{' '}
                <Link href={ROUTES.login} className="font-medium text-slate-800 hover:underline ml-1">
                  Sign In
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
