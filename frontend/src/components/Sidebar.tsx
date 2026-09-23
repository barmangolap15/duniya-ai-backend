'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth-context';
import Logo from '@/components/Logo';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Compass,
  Briefcase,
  LogOut,
  Flame,
  Heart,
  Sparkles,
  Users2,
  MessageSquare,
  Eye,
  FileText,
  Search,
} from 'lucide-react';

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export default function Sidebar({ onNavigate, className }: SidebarProps = {}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const role: UserRole = user?.role || 'STUDENT';

  // Role-specific navigation links
  const studentLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/roadmap', label: 'Career Roadmap', icon: Compass },
    { href: '/mentorship', label: 'Ask Mentor', icon: MessageSquare },
    { href: '/portfolio', label: 'My Portfolio', icon: Briefcase },
  ];

  const parentLinks = [
    { href: '/parent', label: 'Overview', icon: Heart },
    { href: '/parent?tab=reports', label: 'Academic Reports', icon: FileText },
    { href: '/parent?tab=cheers', label: 'Send Cheer Boost', icon: Sparkles },
  ];

  const mentorLinks = [
    { href: '/mentor', label: 'Review Queue', icon: Eye },
    { href: '/mentor?tab=roster', label: 'Mentee Roster', icon: Users2 },
    { href: '/mentorship', label: 'Student Inquiries', icon: MessageSquare },
  ];

  const recruiterLinks = [
    { href: '/recruiter', label: 'Candidate Directory', icon: Search },
  ];

  const getSectionConfig = () => {
    switch (role) {
      case 'MENTOR':
        return {
          title: 'Mentor Workbench',
          links: mentorLinks,
          accentClass: 'bg-black text-white',
          badgeVariant: 'mentor' as const,
        };
      case 'PARENT':
        return {
          title: 'Family Oversight',
          links: parentLinks,
          accentClass: 'bg-black text-white',
          badgeVariant: 'parent' as const,
        };
      case 'RECRUITER':
        return {
          title: 'Talent Scout',
          links: recruiterLinks,
          accentClass: 'bg-black text-white',
          badgeVariant: 'recruiter' as const,
        };
      case 'STUDENT':
      default:
        return {
          title: 'Learning Space',
          links: studentLinks,
          accentClass: 'bg-black text-white',
          badgeVariant: 'student' as const,
        };
    }
  };

  const config = getSectionConfig();

  const getRoleHome = () => {
    if (role === 'MENTOR') return '/mentor';
    if (role === 'PARENT') return '/parent';
    if (role === 'RECRUITER') return '/recruiter';
    return '/dashboard';
  };

  return (
    <aside
      className={cn(
        'w-64 h-full flex flex-col border-r border-zinc-200 bg-white select-none',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-zinc-200 flex items-center justify-between shrink-0">
        <Logo size="sm" href={getRoleHome()} />
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider border bg-zinc-100 text-zinc-900 border-zinc-300">
          {role}
        </span>
      </div>

      {/* Navigation Group (Middle, scrolls internally if height is constrained) */}
      <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[11px] font-body font-semibold uppercase tracking-wider text-zinc-400">
            {config.title}
          </p>
        </div>

        <nav className="space-y-1">
          {config.links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href.includes('?') && pathname === link.href.split('?')[0]);

            return (
              <Link
                key={link.label}
                href={link.href}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-body font-medium transition-all ${
                  isActive
                    ? `${config.accentClass} font-semibold shadow-sm`
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Pinned Bottom Container (Always fixed at bottom of screen) */}
      <div className="shrink-0 mt-auto">
        {/* Gamification Summary (Students) */}
        {role === 'STUDENT' && user && (
          <div className="mx-3 mb-3 p-3.5 rounded-[12px] bg-zinc-50 border border-zinc-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Total XP</span>
              <span className="text-zinc-950 font-bold tabular-nums">{user.xp || 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500">Day Streak</span>
              <span className="inline-flex items-center gap-1 text-zinc-950 font-bold tabular-nums">
                <Flame className="w-3 h-3 fill-zinc-950 text-zinc-950" />
                {user.streak || 0}d
              </span>
            </div>
          </div>
        )}

        {/* User Footer Card */}
        {user && (
          <div className="p-3 border-t border-zinc-200 bg-white">
            <div className="flex items-center justify-between p-2 rounded-[10px] bg-zinc-50 border border-zinc-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={user.name} size="sm" variant={config.badgeVariant} />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-900 truncate">{user.name}</p>
                  <p className="text-[11px] text-zinc-500 truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  onNavigate?.();
                  logout();
                }}
                className="p-1.5 text-zinc-500 hover:text-black hover:bg-zinc-200 rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
