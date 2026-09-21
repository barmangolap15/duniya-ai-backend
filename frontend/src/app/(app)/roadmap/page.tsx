'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  Compass,
  Check,
  Layout,
  Server,
  Layers,
  Smartphone,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.success(`Active path updated to ${res.track?.name || 'new track'}!`);
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
    if (name?.includes('Backend')) return <Server className="w-4 h-4 text-emerald-400" />;
    if (name?.includes('Full-Stack')) return <Layers className="w-4 h-4 text-purple-400" />;
    if (name?.includes('Mobile')) return <Smartphone className="w-4 h-4 text-amber-400" />;
    if (name?.includes('Python') || name?.includes('AI')) return <Sparkles className="w-4 h-4 text-rose-400" />;
    return <Layout className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-6 sm:p-10 py-12 space-y-10">
      {/* Top Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4">
        <span className="px-4 py-1.5 bg-primary-900/50 text-primary-400 rounded-full text-xs font-bold tracking-wider uppercase border border-primary-500/20 inline-block">
          Curriculum & Career Roadmaps
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">
          Explore Subjects & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">Learning Tracks</span>
        </h1>
        <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
          Choose any subject to view its syllabus and interactive coding missions. Switch your enrolled path anytime with 1 click!
        </p>
      </motion.div>

      {/* Track Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {allTracks?.map((track: any) => {
          const isSelected = track.id === (selectedTrackId || activeEnrolledTrackId);
          const isEnrolled = track.id === activeEnrolledTrackId;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-primary-600/20 text-white border-primary-500/60 shadow-lg shadow-primary-950/50'
                  : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-white'
              }`}
            >
              {getTrackIcon(track.name)}
              <span>{track.name}</span>
              {isEnrolled && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
                  Enrolled
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Track Overview & Switch Trigger */}
      {currentViewTrack && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-primary-950/30 border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-primary-400 tracking-wider">
                {currentViewTrack.name}
              </span>
              {isCurrentEnrolled && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Active Track
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white">{currentViewTrack.name}</h2>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
              {currentViewTrack.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 pt-2">
              <span>{currentViewTrack.courses?.length || 0} Comprehensive Courses</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">
                {currentViewTrack.totalMissionsCount || currentViewTrack.courses?.flatMap((c: any) => c.missions || []).length || 0} Interactive Missions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {!isCurrentEnrolled ? (
              <button
                onClick={() => switchTrackMutation.mutate(currentViewTrack.id)}
                disabled={switchTrackMutation.isPending}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary-600/30 flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>Switch to this Track</span>
              </button>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all border border-gray-700 flex items-center gap-2"
              >
                <span>Continue on Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Course Tree */}
      <div className="relative pt-6">
        <div className="absolute left-[39px] top-8 bottom-4 w-0.5 bg-gray-800 hidden sm:block" />

        <div className="space-y-8 relative z-10">
          {(currentViewTrack?.courses || []).map((course: any, index: number) => {
            const missions = course.missions || [];
            return (
              <motion.div
                key={course.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col sm:flex-row gap-6"
              >
                <div className="w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center border-4 border-gray-950 bg-primary-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                  <span className="font-extrabold text-lg">{index + 1}</span>
                </div>

                <div className="flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-white">{course.name || course.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{course.description}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-400 bg-gray-950 px-3 py-1 rounded-full border border-gray-800 self-start sm:self-auto">
                      {missions.length} Missions
                    </span>
                  </div>

                  {/* Missions under this course */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {missions.map((m: any) => (
                      <Link
                        key={m.id}
                        href={`/mission/${m.id}`}
                        className="p-3.5 bg-gray-950/80 hover:bg-gray-800/60 border border-gray-800 rounded-xl transition-all flex items-center justify-between gap-2 group"
                      >
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-200 group-hover:text-primary-300 transition-colors">
                            {m.title}
                          </h4>
                          <span className="text-[10px] text-amber-400 font-medium">+{m.xpReward} XP</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="text-center pt-8">
        <Link
          href="/dashboard"
          className="inline-flex px-8 py-3.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-primary-600/30"
        >
          Return to Mission Workspace
        </Link>
      </div>
    </div>
  );
}
