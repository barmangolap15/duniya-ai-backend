'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import LoadingSpinner from '@/components/LoadingSpinner';
import { soundManager } from '@/lib/sounds';
import Link from 'next/link';
import {
  Heart,
  Flame,
  Trophy,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  UserPlus,
  Star,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  ShieldCheck,
  Send,
  Code2,
  Lock,
  ChevronDown,
  ChevronRight,
  Award,
  AlertCircle,
  HelpCircle,
  FileText,
  Printer,
  Compass,
  Layers,
  Check,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParentPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [activeParentTab, setActiveParentTab] = useState<'OVERVIEW' | 'REPORTS' | 'CHEERS'>('OVERVIEW');
  const [linkEmail, setLinkEmail] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [cheerNote, setCheerNote] = useState('Super proud of your consistency! Keep building! 🚀');

  // Fetch parent's linked children
  const { data: children, isLoading: loadingChildren } = useQuery({
    queryKey: ['parent-children'],
    queryFn: () => api.parent.getChildren(),
  });

  const currentChild = children?.[selectedChildIndex] || null;

  // Fetch child report (curriculum progress, mentor evaluations, assessment results)
  const { data: reportData, isLoading: loadingReport } = useQuery({
    queryKey: ['child-report', currentChild?.id],
    queryFn: () => (currentChild?.id ? api.parent.getChildReport(currentChild.id) : null),
    enabled: !!currentChild?.id,
  });

  // Link child mutation
  const linkMutation = useMutation({
    mutationFn: (email: string) => api.parent.link(email),
    onSuccess: (data) => {
      toast.success(`Linked ${data.student?.name || 'child'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['parent-children'] });
      setShowLinkModal(false);
      setLinkEmail('');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to link child');
    },
  });

  // Send cheer mutation
  const cheerMutation = useMutation({
    mutationFn: ({ childId, message }: { childId: string; message: string }) =>
      api.parent.cheer(childId, message),
    onSuccess: (data) => {
      soundManager.playXP();
      toast.success(data.message || 'Cheer sent! +15 XP rewarded!');
      queryClient.invalidateQueries({ queryKey: ['parent-children'] });
      queryClient.invalidateQueries({ queryKey: ['child-report', currentChild?.id] });
      setCheerNote('');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Could not send cheer');
    },
  });

  const cheerTemplates = [
    'Super proud of your consistency! Keep crushing your streak! 🚀',
    "Great work on your latest coding milestone! You're making real progress! 👏",
    'Take a well-deserved break! Proud of your dedication today! ☕',
    'Every mission completed brings you closer to your dream role! Keep it up! 🌟',
  ];

  if (loadingChildren) return <LoadingSpinner />;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-400" />
              Parent Oversight & Progress Hub
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Verified Educational Reports
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Family Learning Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Track your student's curriculum mastery, milestone reports, and mentor evaluation results.
          </p>
        </div>

        <button
          onClick={() => setShowLinkModal(true)}
          className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <UserPlus className="w-4 h-4 text-primary-400" />
          Link Another Child
        </button>
      </div>

      {/* If No Children Linked */}
      {!children || children.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Children Linked Yet</h2>
          <p className="text-gray-400 text-sm">
            Enter your child's student email address below to monitor their progress, verify their projects, and review official evaluation reports.
          </p>
          <div className="flex gap-3 pt-2">
            <input
              type="email"
              placeholder="e.g. student@duniyaai.com"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
            />
            <button
              onClick={() => linkMutation.mutate(linkEmail)}
              disabled={!linkEmail || linkMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Link Child
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Child Switcher Tabs (if multiple) */}
          {children.length > 1 && (
            <div className="flex gap-3 border-b border-gray-800 pb-2">
              {children.map((child: any, idx: number) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                    idx === selectedChildIndex
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-gray-900 text-gray-400 hover:text-white'
                  }`}
                >
                  <img
                    src={
                      child.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                    }
                    alt={child.name}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  {child.name}
                </button>
              ))}
            </div>
          )}

          {/* Child Hero Card */}
          {currentChild && (
            <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-rose-950/20 border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={
                    currentChild.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                  }
                  alt={currentChild.name}
                  className="w-18 h-18 rounded-2xl object-cover border-2 border-rose-500/40"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-extrabold text-white">{currentChild.name}</h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Level {currentChild.level}
                    </span>
                  </div>
                  <p className="text-xs text-primary-400 font-semibold">{currentChild.trackName}</p>
                  <p className="text-xs text-gray-400 max-w-md">{currentChild.headline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <Link
                  href={`/portfolio/${currentChild.id}`}
                  target="_blank"
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-gray-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-primary-400" />
                  <span>Public Portfolio</span>
                </Link>

                <button
                  onClick={() => setActiveParentTab('CHEERS')}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/20 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                  <span>Send Cheer (+15 XP)</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto scrollbar-thin">
            <button
              onClick={() => setActiveParentTab('OVERVIEW')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeParentTab === 'OVERVIEW'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Learning Velocity & Milestones</span>
            </button>

            <button
              onClick={() => setActiveParentTab('REPORTS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeParentTab === 'REPORTS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Progress & Assessment Reports</span>
              {reportData?.mentorEvaluations?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-gray-950 font-mono text-[10px] font-bold">
                  {reportData.mentorEvaluations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveParentTab('CHEERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                activeParentTab === 'CHEERS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Encouragement & Cheers</span>
              {currentChild?.cheers?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px]">
                  {currentChild.cheers.length}
                </span>
              )}
            </button>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              TAB 1: LEARNING VELOCITY & MILESTONES
              ───────────────────────────────────────────────────────────── */}
          {activeParentTab === 'OVERVIEW' && currentChild && (
            <div className="space-y-8">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                    <Flame className="w-5 h-5 fill-orange-400" />
                  </div>
                  <div className="text-xs text-gray-400">Learning Streak</div>
                  <div className="text-2xl font-bold text-white mt-1">{currentChild.streak} Days</div>
                  <div className="text-[11px] text-orange-400 mt-0.5 font-medium">Consistent daily habit</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center text-primary-400 mb-3">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-400">Estimated Effort</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    ~{currentChild.estimatedHours || 1} Hours
                  </div>
                  <div className="text-[11px] text-primary-400 mt-0.5 font-medium">Focused code execution</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center text-accent-400 mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-400">Total Experience</div>
                  <div className="text-2xl font-bold text-white mt-1">{currentChild.xp} XP</div>
                  <div className="text-[11px] text-accent-400 mt-0.5 font-medium">Gamified progress points</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-400">Missions Completed</div>
                  <div className="text-2xl font-bold text-white mt-1">
                    {currentChild.completedMissionsCount} Projects
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-0.5 font-medium">Interactive challenges</div>
                </div>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Curriculum Track Progression</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Enrolled in <strong className="text-primary-400">{currentChild.trackName}</strong>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">
                      {currentChild.completionRate}%
                    </span>
                    <span className="text-xs text-gray-400 block">Relative milestone rate</span>
                  </div>
                </div>

                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 via-primary-500 to-accent-500 transition-all duration-500"
                    style={{ width: `${Math.max(5, currentChild.completionRate)}%` }}
                  />
                </div>
              </div>

              {/* Recent Verified Activities */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white">Recent Project Submissions</h3>
                {!currentChild.recentActivity || currentChild.recentActivity.length === 0 ? (
                  <p className="text-xs text-gray-500">No project submissions logged yet.</p>
                ) : (
                  <div className="space-y-3">
                    {currentChild.recentActivity.map((act: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-gray-950/60 rounded-2xl border border-gray-800/80 flex items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-bold text-white text-sm">{act.missionTitle}</div>
                          <div className="text-gray-400">
                            Course: <span className="text-gray-200">{act.courseName}</span> •{' '}
                            <span>{new Date(act.date).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
                            +{act.xp} XP
                          </span>
                          <span className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-300 font-medium">
                            {act.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: PROGRESS REPORTS & EVALUATION RESULTS (REPLACED CHAT)
              ───────────────────────────────────────────────────────────── */}
          {activeParentTab === 'REPORTS' && currentChild && (
            <div className="space-y-8">
              {/* Report Header Card */}
              <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-primary-950/20 border border-gray-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-bold uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Official Academic & Progress Report</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white pt-1">
                    {currentChild.name}’s Learning Report Card
                  </h2>
                  <p className="text-xs text-gray-400 max-w-xl">
                    Comprehensive skill evaluation, curriculum mastery status, and certified mentor evaluations.
                  </p>
                </div>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold transition-all border border-gray-700 flex items-center gap-2 self-start sm:self-auto shadow-sm"
                >
                  <Printer className="w-4 h-4 text-primary-400" />
                  <span>Print / Save Report</span>
                </button>
              </div>

              {loadingReport ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-8">
                  {/* 1. AI Placement & Skill Assessment Results */}
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-400">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">AI Skill Assessment & Placement Results</h3>
                          <p className="text-xs text-gray-400">
                            Diagnostic evaluation performed upon student onboarding
                          </p>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {reportData?.assessmentResult?.completed ? 'Verified Assessment' : 'Pending Diagnostic'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-950/80 rounded-2xl border border-gray-800/80 space-y-1.5">
                        <span className="text-[11px] font-bold text-primary-400 uppercase tracking-wider">
                          Assigned Career Subject Path
                        </span>
                        <div className="text-lg font-bold text-white">
                          {reportData?.assessmentResult?.trackName || currentChild.trackName}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          {reportData?.assessmentResult?.trackDescription ||
                            'Curriculum tailored to build modern interactive projects with industry code standards.'}
                        </p>
                      </div>

                      <div className="p-4 bg-gray-950/80 rounded-2xl border border-gray-800/80 space-y-2">
                        <span className="text-[11px] font-bold text-accent-400 uppercase tracking-wider">
                          Competency Milestones
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 bg-gray-900 rounded-xl border border-gray-800">
                            <span className="text-gray-400 block text-[10px]">Total Missions</span>
                            <span className="text-sm font-bold text-white">
                              {reportData?.track?.totalMissions || 0} Missions
                            </span>
                          </div>
                          <div className="p-2 bg-gray-900 rounded-xl border border-gray-800">
                            <span className="text-gray-400 block text-[10px]">Completed</span>
                            <span className="text-sm font-bold text-emerald-400">
                              {reportData?.track?.completedMissions || 0} Passed
                            </span>
                          </div>
                          <div className="p-2 bg-gray-900 rounded-xl border border-gray-800">
                            <span className="text-gray-400 block text-[10px]">Academic Level</span>
                            <span className="text-sm font-bold text-white">Level {currentChild.level}</span>
                          </div>
                          <div className="p-2 bg-gray-900 rounded-xl border border-gray-800">
                            <span className="text-gray-400 block text-[10px]">Active Habit</span>
                            <span className="text-sm font-bold text-orange-400">{currentChild.streak} Day Streak</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Course-by-Course Curriculum Mastery Breakdown */}
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-accent-500/10 border border-accent-500/30 rounded-xl text-accent-400">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">Curriculum Progress Breakdown</h3>
                          <p className="text-xs text-gray-400">
                            Step-by-step course completion and unit mastery
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          Overall: {reportData?.track?.overallPercentage || 0}%
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reportData?.coursesProgress?.map((course: any, idx: number) => (
                        <div
                          key={course.id || idx}
                          className="p-5 bg-gray-950/80 rounded-2xl border border-gray-800/80 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-white">{course.name}</h4>
                                {course.isCompleted ? (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                                    Mastered ✅
                                  </span>
                                ) : course.completedMissions > 0 ? (
                                  <span className="px-2 py-0.5 rounded-md bg-primary-500/20 text-primary-300 border border-primary-500/30 text-[10px] font-bold">
                                    In Progress ⚡
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md bg-gray-800 text-gray-400 text-[10px] font-medium">
                                    Upcoming
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 mt-0.5">{course.description}</p>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="text-xs font-mono font-bold text-gray-200">
                                {course.completedMissions} / {course.totalMissions} Missions
                              </span>
                              <span className="text-[11px] text-gray-500 ml-2 font-bold">
                                ({course.percentage}%)
                              </span>
                            </div>
                          </div>

                          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                            <div
                              className={`h-full transition-all duration-500 ${
                                course.isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-gradient-to-r from-primary-500 to-accent-500'
                              }`}
                              style={{ width: `${course.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. Certified Mentor Evaluation Reports (Grades & Written Feedback) */}
                  <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            Certified Mentor Evaluations & Code Reviews
                          </h3>
                          <p className="text-xs text-gray-400">
                            Official grading and qualitative feedback on completed project code
                          </p>
                        </div>
                      </div>

                      <span className="text-xs text-emerald-400 font-semibold px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                        100% Industry Verified
                      </span>
                    </div>

                    {!reportData?.mentorEvaluations || reportData.mentorEvaluations.length === 0 ? (
                      <div className="text-center py-10 p-6 bg-gray-950/60 border border-gray-800/80 rounded-2xl space-y-2">
                        <Award className="w-10 h-10 mx-auto text-gray-600" />
                        <h4 className="text-sm font-bold text-white">No Mentor Evaluations Yet</h4>
                        <p className="text-xs text-gray-400 max-w-md mx-auto">
                          When {currentChild.name} completes coding challenges, industry mentors review and grade their code here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reportData.mentorEvaluations.map((item: any) => (
                          <div
                            key={item.submissionId}
                            className="p-5 bg-gray-950/80 rounded-2xl border border-gray-800/80 space-y-3 hover:border-emerald-500/30 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/60 pb-3">
                              <div>
                                <h4 className="text-sm font-bold text-white">{item.missionTitle}</h4>
                                <div className="text-xs text-gray-400">
                                  Course: <strong className="text-gray-300">{item.courseName}</strong> • Evaluated on{' '}
                                  {new Date(item.date).toLocaleDateString()}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                {/* Star Rating */}
                                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-xl text-xs font-bold text-amber-300">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span>{item.review?.rating || 5} / 5</span>
                                </div>

                                <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                                  Approved ✅
                                </span>
                              </div>
                            </div>

                            {/* Written Mentor Feedback */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-bold text-accent-400">
                                  {item.review?.mentorName || 'Certified Mentor'}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-400 text-[11px]">
                                  {item.review?.mentorHeadline || 'Staff Software Engineer'}
                                </span>
                              </div>
                              <p className="text-xs text-gray-300 bg-gray-900/60 p-3.5 rounded-xl border border-gray-800 leading-relaxed italic">
                                "{item.review?.feedback}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 3: FAMILY ENCOURAGEMENT & CHEERS
              ───────────────────────────────────────────────────────────── */}
          {activeParentTab === 'CHEERS' && currentChild && (
            <div className="space-y-8">
              {/* Send Cheer Form */}
              <div className="bg-gradient-to-r from-rose-950/30 via-gray-900 to-gray-900 border border-rose-500/30 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">Send Encouragement to {currentChild.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Your cheers appear on {currentChild.name}’s dashboard and reward them with{' '}
                    <strong className="text-rose-400">+15 XP</strong> to boost their streak!
                  </p>
                </div>

                {/* Preset Cheer Chips */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">Quick Templates</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cheerTemplates.map((template, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCheerNote(template)}
                        className={`p-3 rounded-xl text-left text-xs border transition-all ${
                          cheerNote === template
                            ? 'bg-rose-600/20 border-rose-500 text-rose-200'
                            : 'bg-gray-950/60 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={cheerNote}
                    onChange={(e) => setCheerNote(e.target.value)}
                    placeholder="Write a personal encouragement note..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />

                  <button
                    onClick={() =>
                      cheerMutation.mutate({
                        childId: currentChild.id,
                        message: cheerNote,
                      })
                    }
                    disabled={!cheerNote.trim() || cheerMutation.isPending}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Cheer (+15 XP to {currentChild.name})</span>
                  </button>
                </div>
              </div>

              {/* Past Cheers List */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold text-white">Recent Cheers Sent</h3>
                {!currentChild.cheers || currentChild.cheers.length === 0 ? (
                  <p className="text-xs text-gray-500">No encouragement cheers sent yet.</p>
                ) : (
                  <div className="space-y-3">
                    {currentChild.cheers.map((cheer: any) => (
                      <div
                        key={cheer.id}
                        className="p-4 bg-gray-950/60 rounded-2xl border border-gray-800/80 flex items-start justify-between gap-4 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 mt-0.5">
                            <Heart className="w-4 h-4 fill-rose-400" />
                          </div>
                          <div>
                            <p className="text-gray-200">{cheer.message}</p>
                            <span className="text-[11px] text-gray-500 mt-1 block">
                              Sent on {new Date(cheer.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 font-bold font-mono shrink-0">
                          +15 XP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Link Child Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Link a Student Account</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enter the email address registered by your child on DuniyaAI. You'll gain access to their progress reports and milestone reviews.
            </p>

            <input
              type="email"
              placeholder="student@levelup.com"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => linkMutation.mutate(linkEmail)}
                disabled={!linkEmail || linkMutation.isPending}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 shadow-lg shadow-primary-600/30"
              >
                {linkMutation.isPending ? 'Linking...' : 'Confirm Link'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
