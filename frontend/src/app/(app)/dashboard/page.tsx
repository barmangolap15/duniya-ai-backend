'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Star,
  CheckCircle2,
  Clock,
  ChevronRight,
  Layers,
  Compass,
  ArrowRight,
  Server,
  Smartphone,
  Layout,
  Check,
  X,
  Rocket,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showTrackModal, setShowTrackModal] = useState(false);

  // Mandatory AI Onboarding Assessment Guard for Students
  useEffect(() => {
    if (user && user.role === 'STUDENT' && user.quizCompleted === false) {
      router.replace('/quiz');
    }
  }, [user, router]);

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
      toast.success(`Switched track to ${res.track?.name || 'new track'}`);
      setShowTrackModal(false);
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to switch track');
    },
  });

  if (isLoading || !user) return <LoadingSpinner />;

  if (user.role === 'STUDENT' && user.quizCompleted === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <LoadingSpinner />
        <p className="text-xs text-primary-400 font-medium animate-pulse">
          Directing you to your AI skill & interest assessment...
        </p>
      </div>
    );
  }

  const latestCheer = data?.recentCheers?.[0];
  const activeMentorThreads = data?.mentorshipThreads || [];
  const currentTrack = data?.careerTrack;

  const getTrackIcon = (name: string) => {
    if (name?.includes('Backend')) return <Server className="w-5 h-5 text-zinc-900" />;
    if (name?.includes('Full-Stack')) return <Layers className="w-5 h-5 text-zinc-900" />;
    if (name?.includes('Mobile')) return <Smartphone className="w-5 h-5 text-zinc-900" />;
    if (name?.includes('Python') || name?.includes('AI')) return <Sparkles className="w-5 h-5 text-zinc-900" />;
    return <Layout className="w-5 h-5 text-zinc-900" />;
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Welcome back, {user.name}
          </h1>
          <p className="text-zinc-600 text-sm font-body mt-1">
            Build interactive missions, sharpen skills, and get verified mentor code reviews.
          </p>
        </div>
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <Link href="/quiz">
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              <span>{user.quizCompleted ? 'Recalibrate AI Match' : 'Personalize Path'}</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTrackModal(true)}
            className="gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-zinc-600" />
            <span>Switch Track</span>
          </Button>
          <Link href="/mentorship">
            <Button variant="default" size="sm" className="gap-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Mentor</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Active Learning Track Banner */}
      <Card className="bg-zinc-50 border-zinc-200">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white border border-zinc-200 rounded-[12px] text-zinc-900 shrink-0 shadow-sm">
              {getTrackIcon(currentTrack?.name || '')}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                  Active Learning Track
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  · {data?.totalMissions || 0} missions available
                </span>
              </div>
              <h2 className="font-heading text-xl font-bold text-zinc-950">
                {currentTrack?.name || 'Frontend Web Development'}
              </h2>
              <p className="text-xs text-zinc-600 mt-1 max-w-2xl font-body leading-relaxed">
                {currentTrack?.description ||
                  'Build modern web applications with semantic HTML5, responsive CSS layouts, and dynamic JavaScript.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTrackModal(true)}
              className="gap-1.5 text-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Change Track</span>
            </Button>
            <Link href="/roadmap">
              <Button size="sm" className="gap-1 text-xs">
                <span>View Syllabus</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level & XP */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-zinc-100 border border-zinc-200 rounded-[10px] text-zinc-900">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-body text-zinc-500">Current Level</p>
                <p className="font-heading text-xl font-bold text-zinc-950">Level {user.level}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <XPBar xp={user.xp} level={user.level} />
          </CardContent>
        </Card>

        {/* Day Streak */}
        <Card>
          <CardContent className="p-6 flex items-center gap-4 h-full">
            <div className="p-3 bg-zinc-100 border border-zinc-200 rounded-full text-zinc-900">
              <Flame className="w-7 h-7 fill-zinc-950 text-zinc-950" />
            </div>
            <div>
              <p className="text-xs font-body text-zinc-500">Daily Streak</p>
              <p className="font-mono text-3xl font-bold text-zinc-950 tabular-nums">
                {data?.stats?.streak || 0} <span className="text-sm font-sans font-normal text-zinc-500">days</span>
              </p>
              <p className="text-xs text-zinc-500 mt-1 font-body">Consistency builds mastery</p>
            </div>
          </CardContent>
        </Card>

        {/* Track Progress */}
        <Card>
          <CardContent className="p-6 flex items-center justify-between h-full">
            <div>
              <p className="text-xs font-body text-zinc-500">Track Progress</p>
              <p className="font-mono text-3xl font-bold text-zinc-950 tabular-nums">
                {data?.completionPercentage || 0}%
              </p>
              <p className="text-xs text-zinc-500 mt-1 font-mono">
                {data?.completedMissions || 0} of {data?.totalMissions || 0} missions
              </p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-zinc-200 border-t-zinc-950 flex items-center justify-center font-mono text-sm font-bold text-zinc-950">
              {data?.completionPercentage || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Parent Cheer & Mentor Q&A Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parent Cheer */}
        <Card className="border-zinc-200 bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-950 font-semibold text-xs uppercase tracking-wider">
              <Heart className="w-4 h-4 fill-zinc-950 text-zinc-950" />
              <span>Family Encouragement</span>
            </div>
            <span className="text-xs text-zinc-500 font-mono">Real-time</span>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestCheer ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar name={latestCheer.parent?.name || 'Parent'} size="md" variant="parent" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-950">
                        {latestCheer.parent?.name || 'Parent'}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 font-mono text-[11px] font-semibold text-zinc-900">
                        +{latestCheer.xpAwarded} XP Boost
                      </span>
                    </div>
                    <p className="text-xs text-zinc-700 italic mt-1 bg-zinc-50 p-3 rounded-[10px] border border-zinc-200 leading-relaxed">
                      "{latestCheer.message}"
                    </p>
                  </div>
                </div>
                <div className="text-[11px] text-zinc-500 flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Cheered {new Date(latestCheer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-500 py-3 leading-relaxed">
                Your family can track your milestone achievements and send motivational XP boosts through the Parent Portal.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mentor Consultation */}
        <Card className="border-zinc-200 bg-white">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2 text-zinc-950 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Mentor Guidance</span>
            </div>
            <Link
              href="/mentorship"
              className="text-xs text-zinc-900 hover:text-black flex items-center gap-1 font-semibold"
            >
              <span>Ask Mentor</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeMentorThreads.length > 0 ? (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-zinc-950 truncate">
                    {activeMentorThreads[0].subject}
                  </h4>
                  <Badge variant="outline" size="sm">
                    {activeMentorThreads[0].status}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {activeMentorThreads[0].messages?.[0]?.content || 'Mentorship inquiry in progress...'}
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-600 pt-1">
                  <Avatar name={activeMentorThreads[0].mentor?.name || 'Mentor'} size="sm" variant="mentor" />
                  <span>With {activeMentorThreads[0].mentor?.name || 'Staff Mentor'}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2 py-1 text-xs text-zinc-600 leading-relaxed">
                <p className="text-zinc-950 font-medium">Stuck on a tricky mission step?</p>
                <p>Senior engineering mentors are ready to review your code and guide you through blockers.</p>
                <Link href="/mentorship" className="inline-block mt-1">
                  <Button variant="outline" size="sm" className="text-xs">
                    Ask a question
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Up Next in Track */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-zinc-950">
            Up Next in {currentTrack?.name || 'Your Track'}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowTrackModal(true)}
            className="text-xs text-zinc-700 hover:text-black gap-1"
          >
            <span>Explore other subjects</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
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
          <Card className="text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-base font-bold text-zinc-950">All missions completed in this track!</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              You've completed every mission in this syllabus. Switch tracks to continue leveling up.
            </p>
            <Button size="sm" onClick={() => setShowTrackModal(true)}>
              Switch learning track
            </Button>
          </Card>
        )}
      </div>

      {/* Recent Activity & Reviews */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold text-zinc-950">Recent Activity & Reviews</h2>
        {data?.recentSubmissions?.length > 0 ? (
          <Card className="divide-y divide-zinc-200 overflow-hidden">
            {data.recentSubmissions.map((sub: any) => (
              <div key={sub.id} className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-zinc-950 font-semibold text-sm">{sub.mission.title}</span>
                    <Badge
                      variant={
                        sub.status === 'APPROVED'
                          ? 'verified'
                          : sub.status === 'SUBMITTED'
                            ? 'streak'
                            : 'secondary'
                      }
                      size="sm"
                    >
                      {sub.status}
                    </Badge>
                  </div>
                  {sub.reviews?.[0] ? (
                    <div className="flex items-start gap-2 pt-1">
                      <Star className="w-3.5 h-3.5 text-zinc-900 fill-zinc-900 mt-0.5 shrink-0" />
                      <p className="text-xs text-zinc-700 italic font-body">
                        "{sub.reviews[0].feedback}" — <span className="text-zinc-950 font-semibold">{sub.reviews[0].mentor?.name}</span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 font-mono">
                      Submitted on {new Date(sub.updatedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-bold text-zinc-950">+{sub.xpEarned} XP</span>
                  <Link href={`/mission/${sub.mission.id}/`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      View code
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </Card>
        ) : (
          <Card className="p-6 text-center text-zinc-500 text-xs font-body">
            No submissions yet. Start your first mission to earn XP and receive verified mentor reviews!
          </Card>
        )}
      </div>

      {/* Switch Track Modal */}
      {showTrackModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-[14px] max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-zinc-950">Switch Career Track</h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Select a tech stack to recalibrate your curriculum missions
                </p>
              </div>
              <button
                onClick={() => setShowTrackModal(false)}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
              {allTracks?.map((track: any) => {
                const isCurrent = track.id === currentTrack?.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => !isCurrent && switchTrackMutation.mutate(track.id)}
                    className={`p-4 rounded-[12px] border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isCurrent
                        ? 'border-zinc-950 bg-zinc-50'
                        : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-heading text-sm font-semibold text-zinc-950">{track.name}</span>
                        {isCurrent && (
                          <Badge variant="default" size="sm">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 leading-relaxed line-clamp-2">
                        {track.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs font-mono">
                      <span className="text-zinc-500">{track.missions?.length || 0} missions</span>
                      {!isCurrent && (
                        <span className="text-zinc-900 font-sans font-medium flex items-center gap-1">
                          Switch <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowTrackModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
