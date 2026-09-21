'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import LoadingSpinner from '@/components/LoadingSpinner';
import MissionCard from '@/components/MissionCard';
import XPBar from '@/components/XPBar';
import Link from 'next/link';
import {
  Flame,
  Trophy,
  Heart,
  Sparkles,
  MessageSquare,
  ExternalLink,
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard.get(),
  });

  if (isLoading || !user) return <LoadingSpinner />;

  const latestCheer = data?.recentCheers?.[0];
  const activeMentorThreads = data?.mentorshipThreads || [];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your streak, tackle today's interactive missions, and collaborate with your mentors.
          </p>
        </div>
        <Link
          href="/mentorship"
          className="px-4 py-2.5 bg-accent-600/20 hover:bg-accent-600/30 text-accent-300 border border-accent-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto hover:scale-105"
        >
          <MessageSquare className="w-4 h-4 text-accent-400" />
          <span>Ask Mentor For Help</span>
        </Link>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-900/50 rounded-xl text-primary-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Current Level</div>
              <div className="text-2xl font-bold text-white">Level {user.level}</div>
            </div>
          </div>
          <XPBar xp={user.xp} level={user.level} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center gap-4">
          <div className="p-4 bg-orange-900/30 rounded-full text-orange-500">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="text-sm text-gray-400">Learning Streak</div>
            <div className="text-3xl font-bold text-white">{data?.stats?.streak || 0} Days</div>
            <div className="text-xs text-orange-400 mt-1">Consistency is key! 🔥</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Track Progress</div>
            <div className="text-3xl font-bold text-white mb-2">{data?.completionPercentage || 0}%</div>
            <div className="text-xs text-gray-500">
              {data?.completedMissions || 0} of {data?.totalMissions || 0} missions
            </div>
          </div>
          <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-primary-500 flex items-center justify-center">
            <span className="text-primary-400 font-bold">{data?.completionPercentage || 0}%</span>
          </div>
        </div>
      </div>

      {/* Ecosystem Highlights: Parent Cheer & Mentor Q&A */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent Cheer Highlight */}
        <div className="bg-gradient-to-br from-rose-950/20 via-gray-900 to-gray-900 border border-rose-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-rose-400" />
              Family Encouragement Boost
            </div>
            {latestCheer && (
              <span className="text-[11px] text-gray-500">
                {new Date(latestCheer.createdAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {latestCheer ? (
            <div className="space-y-3">
              <p className="text-base text-gray-200 font-medium italic">
                "{latestCheer.message}"
              </p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <img
                    src={
                      latestCheer.parent?.avatarUrl ||
                      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'
                    }
                    alt={latestCheer.parent?.name || 'Parent'}
                    className="w-6 h-6 rounded-full object-cover border border-rose-500/40"
                  />
                  <span className="text-xs text-gray-400">
                    From {latestCheer.parent?.name || 'Dad'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold">
                  +{latestCheer.xpAwarded} XP Awarded
                </span>
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400 py-2">
              Your parents can follow your progress and send motivational boosts from the Parent Portal.
            </div>
          )}
        </div>

        {/* Mentor Guidance & Q&A Preview */}
        <div className="bg-gradient-to-br from-accent-950/20 via-gray-900 to-gray-900 border border-accent-500/30 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent-400" />
              Staff Mentor Guidance
            </div>
            <Link
              href="/mentorship"
              className="text-xs text-primary-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              Open Hub
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {activeMentorThreads.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white line-clamp-1">
                  {activeMentorThreads[0].subject}
                </h4>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    activeMentorThreads[0].status === 'RESOLVED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-accent-500/10 text-accent-300 border border-accent-500/30'
                  }`}
                >
                  {activeMentorThreads[0].status === 'RESOLVED' ? 'Resolved' : 'Active Discussion'}
                </span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {activeMentorThreads[0].messages?.[0]?.content || 'Mentorship consultation in progress...'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                <img
                  src={activeMentorThreads[0].mentor?.avatarUrl}
                  alt={activeMentorThreads[0].mentor?.name}
                  className="w-5 h-5 rounded-full object-cover border border-accent-500/40"
                />
                <span>With {activeMentorThreads[0].mentor?.name}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-1 text-xs text-gray-400">
              <p className="text-white font-medium">Stuck on a tricky mission step?</p>
              <p>Elena Rostova and staff engineering mentors are here to review your code and answer questions.</p>
              <Link
                href="/mentorship"
                className="inline-block mt-2 text-primary-400 hover:underline font-semibold"
              >
                Start a Question &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Active Missions */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Up Next</h2>
        {data?.activeMissions?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.activeMissions.map((mission: any) => (
              <MissionCard
                key={mission.id}
                id={mission.id}
                title={mission.title}
                courseName={mission.courseName}
                xpReward={mission.xpReward}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-400">
            No active missions right now. Check back later!
          </div>
        )}
      </div>

      {/* Recent Activity & Mentor Reviews */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Recent Activity & Reviews</h2>
        {data?.recentSubmissions?.length > 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
            {data.recentSubmissions.map((sub: any) => (
              <div key={sub.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm">{sub.mission.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sub.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : sub.status === 'SUBMITTED'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  {sub.reviews?.[0] ? (
                    <div className="flex items-start gap-2 pt-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mt-0.5 shrink-0" />
                      <p className="text-xs text-gray-300 italic">
                        "{sub.reviews[0].feedback}" — <span className="text-accent-400 font-semibold">{sub.reviews[0].mentor?.name}</span>
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500">
                      Submitted on {new Date(sub.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-amber-400">+{sub.xpEarned} XP</span>
                  <Link
                    href={`/mission/${sub.mission.id}`}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    View Code
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500">No recent activity.</div>
        )}
      </div>
    </div>
  );
}
