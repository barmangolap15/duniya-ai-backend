'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, UserRole } from '@/lib/auth-context';
import {
  LayoutDashboard,
  Target,
  Briefcase,
  LogOut,
  Flame,
  Heart,
  Sparkles,
  ExternalLink,
  Users2,
  Share2,
  MessageSquare,
  Eye,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const role: UserRole = user?.role || 'STUDENT';

  // Role-specific navigation links
  const studentLinks = [
    { href: '/dashboard', label: 'Student Dashboard', icon: LayoutDashboard },
    { href: '/mentorship', label: 'Mentorship & Q&A', icon: MessageSquare, badge: 'Help' },
    { href: '/portfolio', label: 'My Portfolio', icon: Briefcase },
    { href: '/roadmap', label: 'Career Roadmap', icon: Compass },
  ];

  const mentorLinks = [
    { href: '/mentor', label: 'Code Review Queue', icon: Eye, tag: 'Reviews' },
    { href: '/mentor', label: 'Student Q&A Hub', icon: MessageSquare, tag: 'Inquiries' },
    { href: '/mentor', label: 'Active Mentee Roster', icon: Users2, tag: 'Mentees' },
  ];

  const parentLinks = [
    { href: '/parent', label: 'Family Dashboard', icon: Heart, tag: 'Milestones' },
    { href: '/parent', label: 'Mentor Communications', icon: ShieldCheck, tag: 'Oversight' },
    { href: '/parent', label: 'Encouragement & Cheers', icon: Sparkles, tag: '+15 XP' },
  ];

  const recruiterLinks = [
    { href: '/recruiter', label: 'Candidate Pipeline', icon: Users2, tag: 'Talent' },
  ];

  const getActiveLinks = () => {
    switch (role) {
      case 'MENTOR':
        return { title: 'Mentor Workbench', links: mentorLinks };
      case 'PARENT':
        return { title: 'Family Oversight', links: parentLinks };
      case 'RECRUITER':
        return { title: 'Recruiter Space', links: recruiterLinks };
      case 'STUDENT':
      default:
        return { title: 'Student Learning Space', links: studentLinks };
    }
  };

  const navSection = getActiveLinks();

  const getRoleHome = () => {
    if (role === 'MENTOR') return '/mentor';
    if (role === 'PARENT') return '/parent';
    if (role === 'RECRUITER') return '/recruiter';
    return '/dashboard';
  };

  return (
    <div className="w-64 border-r border-gray-800 bg-gray-950 min-h-screen flex flex-col hidden md:flex shrink-0">
      {/* Brand */}
      <div className="p-5 border-b border-gray-800 flex items-center justify-between">
        <Link
          href={getRoleHome()}
          className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500"
        >
          LevelUp
        </Link>
        {user?.role && (
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
              role === 'MENTOR'
                ? 'bg-accent-500/20 text-accent-300 border-accent-500/30'
                : role === 'PARENT'
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  : role === 'RECRUITER'
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                    : 'bg-primary-500/20 text-primary-300 border-primary-500/30'
            }`}
          >
            {user.role}
          </span>
        )}
      </div>

      {/* User Identity Card */}
      {user && (
        <div className="p-4 border-b border-gray-800 bg-gray-900/40">
          <div className="flex items-center gap-3">
            <img
              src={
                user.avatarUrl ||
                (role === 'MENTOR'
                  ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
                  : role === 'PARENT'
                    ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
                    : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')
              }
              alt={user.name}
              className={`w-11 h-11 rounded-xl object-cover border ${
                role === 'MENTOR'
                  ? 'border-accent-500/50'
                  : role === 'PARENT'
                    ? 'border-rose-500/50'
                    : 'border-primary-500/50'
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm text-white truncate">{user.name}</div>
              {role === 'STUDENT' ? (
                <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                  <span>{user.streak}d streak</span>
                  <span>•</span>
                  <span className="text-amber-400 font-semibold">{user.xp} XP</span>
                </div>
              ) : (
                <div className="text-[11px] text-gray-400 truncate mt-0.5">
                  {user.headline || `${role.charAt(0) + role.slice(1).toLowerCase()} Account`}
                </div>
              )}
            </div>
          </div>

          {/* Student public portfolio shortcut */}
          {role === 'STUDENT' && user.id && (
            <Link
              href={`/portfolio/${user.id}`}
              target="_blank"
              className="mt-3 w-full py-1.5 px-3 bg-gray-950 hover:bg-gray-800 border border-gray-800 rounded-lg text-xs text-primary-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 font-medium"
            >
              <Share2 className="w-3 h-3" />
              View Public Portfolio
            </Link>
          )}
        </div>
      )}

      {/* Role-Specific Navigation */}
      <div className="flex-1 py-4 flex flex-col gap-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
            {navSection.title}
          </div>
          {navSection.links.map((link, idx) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={idx}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-semibold ${
                  isActive
                    ? role === 'MENTOR'
                      ? 'bg-accent-600 text-white shadow-md shadow-accent-600/20'
                      : role === 'PARENT'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                        : 'bg-primary-600 text-white shadow-md shadow-primary-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>

                {'badge' in link && (link as any).badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-mono border border-accent-500/30">
                    {(link as any).badge}
                  </span>
                )}

                {'tag' in link && (link as any).tag && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-950 border border-gray-800 text-gray-400 font-mono">
                    {(link as any).tag}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
