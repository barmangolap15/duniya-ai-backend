'use client';
import Link from 'next/link';
import { useAuth, getRoleHomeRoute, UserRole } from '@/lib/auth-context';
import { LogOut, Flame, Sparkles, ArrowRight, User as UserIcon } from 'lucide-react';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export default function Navbar() {
  const { user, logout } = useAuth();
  const homeRoute = getRoleHomeRoute(user?.role);
  const role: UserRole = user?.role || 'STUDENT';

  const roleBadgeStyles: Record<string, string> = {
    STUDENT: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
    PARENT: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
    MENTOR: 'bg-accent-500/15 text-accent-300 border-accent-500/30',
    RECRUITER: 'bg-danger-500/15 text-danger-300 border-danger-500/30',
    ADMIN: 'bg-slate-700/30 text-slate-300 border-slate-600',
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-dark bg-night/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="md" href={user ? homeRoute : '/'} />
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Gamified stats for student */}
                {role === 'STUDENT' && (
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-500/10 border border-accent-500/25 px-2.5 py-1 font-mono text-xs font-medium text-accent-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{user.xp || 0} XP</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500/10 border border-gold-500/25 px-2.5 py-1 font-mono text-xs font-medium text-gold-400">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{user.streak || 0}d</span>
                    </span>
                  </div>
                )}

                {/* Profile link */}
                <Link
                  href={homeRoute}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] border border-border-dark bg-surface-dark/80 hover:bg-surface-raised transition-colors group"
                >
                  <Avatar
                    name={user.name}
                    size="sm"
                    variant={
                      role === 'STUDENT'
                        ? 'student'
                        : role === 'PARENT'
                          ? 'parent'
                          : role === 'MENTOR'
                            ? 'mentor'
                            : 'recruiter'
                    }
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white max-w-[120px] truncate leading-tight">
                      {user.name}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-medium leading-none mt-0.5 ${
                        role === 'PARENT'
                          ? 'text-gold-400'
                          : role === 'MENTOR'
                            ? 'text-accent-400'
                            : role === 'RECRUITER'
                              ? 'text-danger-400'
                              : 'text-primary-400'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-white hover:bg-surface-raised border border-transparent hover:border-border-dark rounded-[10px] transition-colors"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm" className="gap-1.5">
                    Start learning <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
