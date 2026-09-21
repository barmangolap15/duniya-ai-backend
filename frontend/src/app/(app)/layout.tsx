'use client';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isQuiz = pathname?.startsWith('/quiz');
  const isMission = pathname?.startsWith('/mission');
  const hideSidebar = isQuiz || isMission;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-night text-slate-100">
        {!hideSidebar && <Sidebar />}

        {/* Mobile Navbar */}
        {!hideSidebar && (
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-surface-dark border-b border-border-dark z-50 flex items-center justify-between px-4">
            <Logo size="sm" href="/dashboard" />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        )}

        {/* Mobile Drawer Menu */}
        {!hideSidebar && mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 z-40 bg-night/95 backdrop-blur-md p-4 overflow-y-auto">
            <Sidebar />
          </div>
        )}

        <div
          className={`flex-1 flex flex-col min-w-0 ${
            hideSidebar ? 'w-full' : 'w-full md:ml-0 mt-16 md:mt-0'
          } overflow-y-auto`}
        >
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
