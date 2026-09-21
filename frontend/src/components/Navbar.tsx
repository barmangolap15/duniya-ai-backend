'use client';
import Link from 'next/link';
import { useAuth, getRoleHomeRoute } from '@/lib/auth-context';
import { LogOut, User, ArrowRight } from 'lucide-react';
import Logo from '@/components/Logo';

export default function Navbar() {
  const { user, logout } = useAuth();
  const homeRoute = getRoleHomeRoute(user?.role);

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Logo size="md" href={user ? homeRoute : '/'} />
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={homeRoute}
                  className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white"
                >
                  <User className="w-3.5 h-3.5 text-primary-400" />
                  <span>{user.name}</span>
                  <span className="text-[10px] px-1.5 rounded bg-gray-800 text-primary-300 font-mono">
                    {user.role}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-900 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login" className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-2">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-xl text-white text-xs font-bold transition-all shadow-md shadow-primary-600/20 flex items-center gap-1.5"
                >
                  Get Started <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
