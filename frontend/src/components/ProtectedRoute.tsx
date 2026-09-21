'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // Not logged in -> redirect to login immediately
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    const role = user.role;

    // Strict role isolation:
    // Mentors only access /mentor routes
    if (role === 'MENTOR') {
      if (!pathname.startsWith('/mentor')) {
        router.push('/mentor');
      }
    }
    // Parents only access /parent routes
    else if (role === 'PARENT') {
      if (!pathname.startsWith('/parent')) {
        router.push('/parent');
      }
    }
    // Recruiters only access /recruiter routes
    else if (role === 'RECRUITER') {
      if (!pathname.startsWith('/recruiter')) {
        router.push('/recruiter');
      }
    }
    // Students only access Student routes (cannot access /mentor, /parent, /recruiter)
    else if (role === 'STUDENT') {
      if (
        pathname.startsWith('/mentor') ||
        pathname.startsWith('/parent') ||
        pathname.startsWith('/recruiter')
      ) {
        router.push('/dashboard');
      }
    }
  }, [loading, isAuthenticated, user, pathname, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
