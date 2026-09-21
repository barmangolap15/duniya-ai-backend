'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Layers,
  Compass,
  ArrowRight,
  BookOpen,
  Code2,
  Server,
  Smartphone,
  Layout,
  Check,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showTrackModal, setShowTrackModal] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard.get(),
  });

  const { data: allTracks } = useQuery({
    queryKey: ['all-tracks'],
    queryFn: () => api.missions.getTracks(),
  });

  const switchTrackMutation = useMutation({
    mutationFn: (trackId: string) => api.missions.switchTrack(trackId),
    onSuccess: (res) => {
      toast.success(`Switched path to ${res.track?.name || 'new track'}!`);
      setShowTrackModal(false);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to switch track');
    },
  });

  if (isLoading || !user) return <LoadingSpinner />;

  const latestCheer = data?.recentCheers?.[0];
  const activeMentorThreads = data?.mentorshipThreads || [];
  const currentTrack = data?.careerTrack;

  const getTrackIcon = (name: string) => {
    if (name?.includes('Backend')) return <Server className="w-5 h-5 text-emerald-400" />;
    if (name?.includes('Full-Stack')) return <Layers className="w-5 h-5 text-purple-400" />;
    if (name?.includes('Mobile')) return <Smartphone className="w-5 h-5 text-amber-400" />;
    if (name?.includes('Python') || name?.includes('AI')) return <Sparkles className="w-5 h-5 text-rose-400" />;
    return <Layout className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user.name}! 👋</h1>
          <p className="text-gray-400 text-sm mt-1">
            Choose your learning track, solve interactive missions, and get mentor code reviews.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setShowTrackModal(true)}
            className="px-4 py-2.5 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:scale-105"
          >
            <Compass className="w-4 h-4 text-primary-400" />
            <span>Switch Subject / Track</span>
          </button>
          <Link
            href="/mentorship"
            className="px-4 py-2.5 bg-accent-600/20 hover:bg-accent-600/30 text-accent-300 border border-accent-500/30 rounded-xl text-xs font-bold transition-all flex items-center gap-2 hover:scale-105"
          >
            <MessageSquare className="w-4 h-4 text-accent-400" />
            <span>Ask Mentor For Help</span>
          </Link>
        </div>
      </div>

      {/* Active Subject / Track Banner */}
      <div className="bg-gradient-to-r from-primary-950/40 via-gray-900 to-gray-900 border border-primary-500/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-primary-500/10 border border-primary-500/30 rounded-2xl shrink-0 mt-1">
            {getTrackIcon(currentTrack?.name || '')}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-primary-500/20 text-primary-300 border border-primary-500/30">
                Active Learning Track
              </span>
              <span className="text-xs text-gray-500">
                {data?.totalMissions || 0} Missions Available
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">
              {currentTrack?.name || 'Frontend Web Development'}
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-2xl leading-relaxed">
              {currentTrack?.description || 'Build modern web applications with semantic HTML5, CSS layouts, and dynamic JavaScript.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowTrackModal(true)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-gray-700"
          >
            <Layers className="w-3.5 h-3.5 text-gray-400" />
            <span>Change Subject ({allTracks?.length || 5} Available)</span>
          </button>
          <Link
            href="/roadmap"
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-primary-600/30"
          >
            <span>View Syllabus</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
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
            <span className="text-xs text-gray-500">Live Feedback</span>
          </div>

          {latestCheer ? (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <img
                  src={latestCheer.parent?.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'}
                  alt="Parent avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-500/40"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {latestCheer.parent?.name || 'Your Parent'}
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
                      +{latestCheer.xpAwarded} XP Boost
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 italic mt-1 bg-gray-950/60 p-3 rounded-xl border border-gray-800/80">
                    "{latestCheer.message}"
                  </p>
                </div>
              </div>
              <div className="text-[11px] text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Cheered {new Date(latestCheer.createdAt).toLocaleDateString()}</span>
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
                  src={activeMentorThreads[0].mentor?.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'}
                  alt={activeMentorThreads[0].mentor?.name}
                  className="w-5 h-5 rounded-full object-cover border border-accent-500/40"
                />
                <span>With {activeMentorThreads[0].mentor?.name || 'Staff Mentor'}</span>
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
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Up Next in {currentTrack?.name || 'Your Track'}</h2>
          <button
            onClick={() => setShowTrackModal(true)}
            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 font-semibold"
          >
            <span>Explore Other Subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center text-primary-400 mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">All missions completed in this subject! 🎉</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              You've solved every mission in this track. Switch to another technology (Backend, Full-Stack, Mobile, or Python) to keep leveling up!
            </p>
            <button
              onClick={() => setShowTrackModal(true)}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Switch to Another Subject
            </button>
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
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500 text-sm">
            No submissions yet. Start your first mission to earn XP and receive mentor feedback!
          </div>
        )}
      </div>

      {/* Modal: Switch Career Track / Subject */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-white">Choose Your Learning Path</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Switch between technology tracks anytime. Your XP and completed missions are always saved!
                </p>
              </div>
              <button
                onClick={() => setShowTrackModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {allTracks?.map((track: any) => {
                const isCurrent = currentTrack?.id === track.id || currentTrack?.name === track.name;
                return (
                  <div
                    key={track.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrent
                        ? 'bg-primary-950/30 border-primary-500/50 shadow-lg shadow-primary-950/50'
                        : 'bg-gray-950 border-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gray-900 border border-gray-800 rounded-xl shrink-0 mt-1">
                        {getTrackIcon(track.name)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-white">{track.name}</h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-primary-500/20 text-primary-300 font-bold px-2 py-0.5 rounded-full border border-primary-500/30 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          {track.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-500">
                          <span>{track.courses?.length || 0} Courses</span>
                          <span>•</span>
                          <span>{track.totalMissionsCount || 0} Missions</span>
                          <span>•</span>
                          <span className="text-amber-400 font-semibold">+{track.totalXp || 0} Max XP</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => switchTrackMutation.mutate(track.id)}
                      disabled={isCurrent || switchTrackMutation.isPending}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        isCurrent
                          ? 'bg-gray-800 text-gray-500 cursor-default'
                          : 'bg-primary-600 hover:bg-primary-500 text-white shadow-md'
                      }`}
                    >
                      {isCurrent ? 'Current Path' : 'Switch Path'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
