'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Compass,
  Check,
  Layout,
  Server,
  Layers,
  Smartphone,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function RoadmapPage() {
  const queryClient = useQueryClient();
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => api.auth.me(),
  });

  const { data: allTracks, isLoading: loadingTracks } = useQuery({
    queryKey: ['all-tracks'],
    queryFn: () => api.missions.getTracks(),
  });

  const switchTrackMutation = useMutation({
    mutationFn: (trackId: string) => api.missions.switchTrack(trackId),
    onSuccess: (res) => {
      toast.success(`Active track updated to ${res.track?.name || 'new track'}`);
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to switch track');
    },
  });

  if (loadingUser || loadingTracks || !user) return <LoadingSpinner />;

  const activeEnrolledTrackId = user?.roadmap?.careerTrackId || user?.track?.id;
  const currentViewTrack =
    allTracks?.find((t: any) => t.id === (selectedTrackId || activeEnrolledTrackId)) ||
    allTracks?.[0] ||
    user?.track;

  const isCurrentEnrolled = currentViewTrack?.id === activeEnrolledTrackId;

  const getTrackIcon = (name: string) => {
    if (name?.includes('Backend')) return <Server className="w-4 h-4 text-accent-400" />;
    if (name?.includes('Full-Stack')) return <Layers className="w-4 h-4 text-primary-400" />;
    if (name?.includes('Mobile')) return <Smartphone className="w-4 h-4 text-gold-400" />;
    if (name?.includes('Python') || name?.includes('AI')) return <Sparkles className="w-4 h-4 text-danger-400" />;
    return <Layout className="w-4 h-4 text-primary-400" />;
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-6 sm:p-10 py-10 space-y-8">
      {/* Top Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5" />
          <span>Curriculum & Career Roadmaps</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Explore Learning Tracks & <span className="text-primary-400">Syllabus</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto font-body leading-relaxed">
          Select any career track to inspect its full course roadmap and interactive coding missions. Switch your enrolled path anytime with 1 click.
        </p>
      </div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {allTracks?.map((track: any) => {
          const isSelected = track.id === (selectedTrackId || activeEnrolledTrackId);
          const isEnrolled = track.id === activeEnrolledTrackId;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`px-4 py-2.5 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-primary-600/15 text-white border-primary-500 shadow-sm'
                  : 'bg-surface-dark text-slate-400 border-border-dark hover:border-slate-700 hover:text-white'
              }`}
            >
              {getTrackIcon(track.name)}
              <span>{track.name}</span>
              {isEnrolled && (
                <Badge variant="verified" size="sm">
                  Active
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Track Overview Card */}
      {currentViewTrack && (
        <Card className="border-primary-500/30 bg-gradient-to-r from-surface-dark via-surface-dark to-night">
          <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono font-semibold text-primary-400 tracking-wider">
                  {currentViewTrack.name}
                </span>
                {isCurrentEnrolled && (
                  <Badge variant="verified" size="sm">
                    <Check className="w-3 h-3" /> Enrolled Track
                  </Badge>
                )}
              </div>
              <h2 className="font-heading text-2xl font-bold text-white">{currentViewTrack.name}</h2>
              <p className="text-xs text-slate-400 max-w-2xl leading-relaxed font-body">
                {currentViewTrack.description}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400 pt-1 font-mono">
                <span>{currentViewTrack.courses?.length || 0} courses</span>
                <span>·</span>
                <span className="text-accent-400 font-semibold">
                  {currentViewTrack.totalMissionsCount ||
                    currentViewTrack.courses?.flatMap((c: any) => c.missions || []).length ||
                    0}{' '}
                  missions
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {!isCurrentEnrolled ? (
                <Button
                  size="sm"
                  onClick={() => switchTrackMutation.mutate(currentViewTrack.id)}
                  isLoading={switchTrackMutation.isPending}
                  className="gap-2 text-xs"
                >
                  <Compass className="w-4 h-4" />
                  <span>Switch to this track</span>
                </Button>
              ) : (
                <Link href="/dashboard">
                  <Button variant="secondary" size="sm" className="gap-2 text-xs">
                    <span>Go to dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Course Tree */}
      <div className="relative pt-4">
        <div className="absolute left-[31px] top-6 bottom-4 w-0.5 bg-border-dark hidden sm:block" />

        <div className="space-y-6 relative z-10">
          {(currentViewTrack?.courses || []).map((course: any, index: number) => {
            const missions = course.missions || [];
            return (
              <div key={course.id || index} className="flex flex-col sm:flex-row gap-5">
                {/* Node number */}
                <div className="w-14 h-14 shrink-0 rounded-[14px] flex items-center justify-center border-2 border-primary-500/40 bg-surface-dark text-white font-heading font-bold text-base shadow-sm">
                  {index + 1}
                </div>

                <Card className="flex-1">
                  <CardContent className="p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-dark pb-3">
                      <div>
                        <h3 className="font-heading text-base font-bold text-white">
                          {course.name || course.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-body">{course.description}</p>
                      </div>
                      <Badge variant="secondary" size="sm" className="self-start sm:self-auto font-mono">
                        {missions.length} missions
                      </Badge>
                    </div>

                    {/* Missions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {missions.map((m: any) => (
                        <Link
                          key={m.id}
                          href={`/mission/${m.id}/`}
                          className="p-3.5 bg-night rounded-[10px] border border-border-dark hover:border-primary-500/50 hover:bg-surface-raised transition-all flex items-center justify-between gap-2 group"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-200 group-hover:text-primary-300 transition-colors truncate">
                              {m.title}
                            </h4>
                            <span className="text-[11px] font-mono font-medium text-accent-400">
                              +{m.xpReward} XP
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-4">
        <Link href="/dashboard">
          <Button size="default" className="gap-2">
            <span>Return to dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
