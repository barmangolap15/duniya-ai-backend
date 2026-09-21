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
    const isMentorPortal = pathname === '/mentor' || pathname.startsWith('/mentor/');
    const isParentPortal = pathname === '/parent' || pathname.startsWith('/parent/');
    const isRecruiterPortal = pathname === '/recruiter' || pathname.startsWith('/recruiter/');

    // Mentors access /mentor and /mentorship
    if (role === 'MENTOR') {
      if (!isMentorPortal && !pathname.startsWith('/mentorship')) {
        router.push('/mentor');
      }
    }
    // Parents only access /parent routes
    else if (role === 'PARENT') {
      if (!isParentPortal) {
        router.push('/parent');
      }
    }
    // Recruiters only access /recruiter routes
    else if (role === 'RECRUITER') {
      if (!isRecruiterPortal) {
        router.push('/recruiter');
      }
    }
    // Students only access Student routes (cannot access /mentor portal, /parent portal, /recruiter portal)
    // Note: /mentorship is a valid student Q&A route!
    else if (role === 'STUDENT') {
      if (isMentorPortal || isParentPortal || isRecruiterPortal) {
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
