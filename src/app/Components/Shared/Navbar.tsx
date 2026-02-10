'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import { getStoredToken, getStoredUser, clearStoredAuth } from '@/lib/api';
import { ROUTES, ROLE_TO_DASHBOARD } from '@/lib/constants';

interface NavbarProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function Navbar({ isMenuOpen, toggleMenu }: NavbarProps) {
  const router = useRouter();
  const token = getStoredToken();
  const user = getStoredUser();
  const isLoggedIn = Boolean(token && user);
  const dashboardHref = user?.currentRole
    ? (ROLE_TO_DASHBOARD[user.currentRole] ?? ROUTES.member)
    : ROUTES.member;

  const handleLogout = () => {
    clearStoredAuth();
    toggleMenu();
    router.push(ROUTES.home);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden">
              <Image
                src="/images/SEC-Logo.png"
                alt="SEC Logo"
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="block">
              <span className="text-lg sm:text-xl font-bold text-slate-800">Department of EEE</span>
              <p className="text-[10px] sm:text-xs font-medium text-slate-600 -mt-1">
                Sylhet Engineering College
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <a href="#home" className="text-slate-700 hover:text-slate-800 hover:underline underline-offset-4 transition-colors font-medium">Home</a>
            <a href="#events" className="text-slate-700 hover:text-slate-800 hover:underline underline-offset-4 transition-colors font-medium">Events</a>
            <a href="#achievements" className="text-slate-700 hover:text-slate-800 hover:underline underline-offset-4 transition-colors font-medium">Achievements</a>
            <a href="#contact" className="text-slate-700 hover:text-slate-800 hover:underline underline-offset-4 transition-colors font-medium">Contact</a>
            {isLoggedIn ? (
              <>
                <Link
                  href={dashboardHref}
                  className="px-3 py-2 text-sm text-[#FFFFFF] border border-slate-300 rounded-lg bg-[#151F33] hover:bg-[#151F33]/80 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-3 py-2 text-sm text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href={ROUTES.login} className="px-3 py-2 text-sm text-[#FFFFFF] border border-slate-300 rounded-lg bg-[#151F33] hover:bg-[#151F33]/80 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 transition-colors px-2 py-1">Home</a>
              <a href="#events" className="text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 transition-colors px-2 py-1">Events</a>
              <a href="#achievements" className="text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 transition-colors px-2 py-1">Achievements</a>
              <a href="#contact" className="text-slate-700 hover:text-slate-900 hover:underline underline-offset-4 transition-colors px-2 py-1">Contact</a>
              <div className="flex flex-col gap-2 pt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      href={dashboardHref}
                      onClick={() => toggleMenu()}
                      className="px-4 py-2 border border-slate-300 rounded-lg transition-colors text-center bg-[#151F33] text-white"
                    >
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg transition-colors text-center"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link href={ROUTES.login} className="px-4 py-2 text-slate-700 border border-slate-300 rounded-lg transition-colors text-center">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
