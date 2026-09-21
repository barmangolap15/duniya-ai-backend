'use client';
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isQuiz = pathname?.startsWith('/quiz');

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-950">
        {!isQuiz && <Sidebar />}
        
        {/* Mobile Navbar */}
        {!isQuiz && (
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-950 border-b border-gray-800 z-50 flex items-center justify-between px-4">
            <Logo size="sm" href="/dashboard" />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-400">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        )}

        <div className={`flex-1 flex flex-col ${isQuiz ? 'w-full' : 'md:ml-0 mt-16 md:mt-0'} max-h-screen overflow-y-auto`}>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}
