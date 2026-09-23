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
  FileText,
  Printer,
  Compass,
  Layers,
  Award,
  Send,
  X,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 font-body">
              <Heart className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
              <span>Family Oversight Hub</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 font-body">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>Verified Reports & Progress</span>
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Family Learning Dashboard
          </h1>
          <p className="text-zinc-600 text-sm font-body mt-1">
            Track learning velocity, review verified code evaluations, and send encouragement boosts.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLinkModal(true)}
          className="gap-2 self-start md:self-auto text-xs"
        >
          <UserPlus className="w-4 h-4 text-zinc-700" />
          <span>Link another student</span>
        </Button>
      </div>

      {/* If No Children Linked */}
      {!children || children.length === 0 ? (
        <Card className="max-w-xl mx-auto p-8 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mx-auto">
            <Heart className="w-7 h-7 fill-zinc-900 text-zinc-900" />
          </div>
          <h2 className="font-heading text-xl font-bold text-zinc-950">No Student Accounts Linked</h2>
          <p className="text-zinc-600 text-xs leading-relaxed font-body">
            Enter your child's student email address below to monitor their daily study streak, view official progress reports, and cheer their milestones.
          </p>
          <div className="flex gap-2.5 pt-2">
            <Input
              type="email"
              placeholder="student@example.com"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
              className="flex-1 text-xs"
            />
            <Button
              variant="default"
              size="default"
              onClick={() => linkMutation.mutate(linkEmail)}
              disabled={!linkEmail || linkMutation.isPending}
              isLoading={linkMutation.isPending}
            >
              Link student
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* Child Switcher Tabs (if multiple) */}
          {children.length > 1 && (
            <div className="flex gap-2 border-b border-zinc-200 pb-2">
              {children.map((child: any, idx: number) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildIndex(idx)}
                  className={`px-3.5 py-2 rounded-[10px] text-xs font-medium transition-all flex items-center gap-2 ${
                    idx === selectedChildIndex
                      ? 'bg-black text-white border border-black'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200'
                  }`}
                >
                  <Avatar name={child.name} size="sm" variant="student" />
                  <span>{child.name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Child Hero Card */}
          {currentChild && (
            <Card className="border-zinc-200 bg-white">
              <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4 sm:gap-5">
                  <Avatar name={currentChild.name} size="xl" variant="student" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="font-heading text-2xl font-bold text-zinc-950">{currentChild.name}</h2>
                      <Badge variant="streak">
                        Level {currentChild.level}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-700 font-semibold">{currentChild.trackName}</p>
                    <p className="text-xs text-zinc-500 max-w-md">{currentChild.headline}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-auto flex-wrap">
                  <Link href={`/portfolio/${currentChild.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Portfolio</span>
                    </Button>
                  </Link>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => setActiveParentTab('CHEERS')}
                    className="gap-1.5 text-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Send cheer (+15 XP)</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-3 overflow-x-auto">
            <button
              onClick={() => setActiveParentTab('OVERVIEW')}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeParentTab === 'OVERVIEW'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Velocity & Milestones</span>
            </button>

            <button
              onClick={() => setActiveParentTab('REPORTS')}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeParentTab === 'REPORTS'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Progress & Assessment Reports</span>
              {reportData?.mentorEvaluations?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-white font-mono text-[10px] font-bold">
                  {reportData.mentorEvaluations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveParentTab('CHEERS')}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
                activeParentTab === 'CHEERS'
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Encouragement & Cheers</span>
              {currentChild?.cheers?.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-white font-mono text-[10px] font-bold">
                  {currentChild.cheers.length}
                </span>
              )}
            </button>
          </div>

          {/* TAB 1: LEARNING VELOCITY */}
          {activeParentTab === 'OVERVIEW' && currentChild && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-3">
                      <Flame className="w-5 h-5 fill-zinc-900 text-zinc-900" />
                    </div>
                    <p className="text-xs text-zinc-500">Daily Streak</p>
                    <p className="font-mono text-2xl font-bold text-zinc-950 mt-1">{currentChild.streak} Days</p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Consistent daily habit</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-zinc-500">Study Velocity</p>
                    <p className="font-mono text-2xl font-bold text-zinc-950 mt-1">
                      ~{currentChild.estimatedHours || 1} Hours
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Focused code execution</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-3">
                      <Trophy className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-zinc-500">Total Experience</p>
                    <p className="font-mono text-2xl font-bold text-zinc-950 mt-1">{currentChild.xp} XP</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Verified points earned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-3">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-zinc-500">Missions Completed</p>
                    <p className="font-mono text-2xl font-bold text-zinc-950 mt-1">
                      {currentChild.completedMissionsCount}
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5">Passes automated tests</p>
                  </CardContent>
                </Card>
              </div>

              {/* Progress Summary Card */}
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle>Curriculum Progression</CardTitle>
                      <CardDescription>
                        Enrolled track: <strong className="text-zinc-900">{currentChild.trackName}</strong>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-2xl font-bold text-zinc-950">
                        {currentChild.completionRate}%
                      </span>
                      <span className="text-xs text-zinc-500 block font-mono">Milestone completion rate</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-2.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black transition-all duration-500 rounded-full"
                      style={{ width: `${Math.max(5, currentChild.completionRate)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Project Submissions */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Project Submissions</CardTitle>
                  <CardDescription>Latest challenges attempted and reviewed</CardDescription>
                </CardHeader>
                <CardContent>
                  {!currentChild.recentActivity || currentChild.recentActivity.length === 0 ? (
                    <p className="text-xs text-zinc-500">No project submissions logged yet.</p>
                  ) : (
                    <div className="divide-y divide-zinc-200">
                      {currentChild.recentActivity.map((act: any, idx: number) => (
                        <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                          <div className="space-y-0.5">
                            <div className="font-semibold text-zinc-950 text-sm">{act.missionTitle}</div>
                            <div className="text-zinc-500 font-mono text-[11px]">
                              {act.courseName} · {new Date(act.date).toLocaleDateString()}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="xp">+{act.xp} XP</Badge>
                            <Badge variant="secondary">{act.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: PROGRESS REPORTS & EVALUATION RESULTS */}
          {activeParentTab === 'REPORTS' && currentChild && (
            <div className="space-y-6">
              {/* Report Header Card */}
              <Card className="border-zinc-200 bg-white">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Academic Progress Report</span>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-zinc-950 pt-1">
                      {currentChild.name}’s Certified Report Card
                    </h2>
                    <p className="text-xs text-zinc-600 max-w-xl font-body">
                      Curriculum mastery status, diagnostic assessment evaluation, and certified mentor reviews.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="gap-2 self-start sm:self-auto text-xs"
                  >
                    <Printer className="w-4 h-4 text-zinc-700" />
                    <span>Print / Save Report</span>
                  </Button>
                </CardContent>
              </Card>

              {loadingReport ? (
                <LoadingSpinner />
              ) : (
                <div className="space-y-6">
                  {/* AI Placement & Skill Assessment */}
                  <Card>
                    <CardHeader className="border-b border-zinc-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded-[10px] text-zinc-900">
                            <Compass className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Skill Assessment & Diagnostic Results</CardTitle>
                            <CardDescription>Onboarding diagnostic evaluation</CardDescription>
                          </div>
                        </div>

                        <Badge variant="verified">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {reportData?.assessmentResult?.completed ? 'Verified Assessment' : 'Diagnostic Completed'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 rounded-[10px] border border-zinc-200 space-y-1">
                          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 font-semibold">
                            Assigned Career Track
                          </span>
                          <p className="font-heading text-base font-bold text-zinc-950">
                            {reportData?.assessmentResult?.trackName || currentChild.trackName}
                          </p>
                          <p className="text-xs text-zinc-600 leading-relaxed font-body">
                            {reportData?.assessmentResult?.trackDescription ||
                              'Curriculum tailored to build modern interactive projects with industry code standards.'}
                          </p>
                        </div>

                        <div className="p-4 bg-zinc-50 rounded-[10px] border border-zinc-200 space-y-2 font-mono">
                          <span className="text-[11px] uppercase tracking-wider text-zinc-600 font-semibold">
                            Competency Summary
                          </span>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 bg-white rounded-md border border-zinc-200">
                              <span className="text-zinc-500 block text-[10px]">Total Missions</span>
                              <span className="text-sm font-bold text-zinc-950">
                                {reportData?.track?.totalMissions || 0}
                              </span>
                            </div>
                            <div className="p-2.5 bg-white rounded-md border border-zinc-200">
                              <span className="text-zinc-500 block text-[10px]">Passed</span>
                              <span className="text-sm font-bold text-zinc-950">
                                {reportData?.track?.completedMissions || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Course-by-Course Curriculum Mastery Breakdown */}
                  <Card>
                    <CardHeader className="border-b border-zinc-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded-[10px] text-zinc-900">
                            <Layers className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Curriculum Mastery Breakdown</CardTitle>
                            <CardDescription>Step-by-step progress through enrolled courses</CardDescription>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-zinc-950">
                          Overall: {reportData?.track?.overallPercentage || 0}%
                        </span>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-3">
                      {reportData?.coursesProgress?.map((course: any, idx: number) => (
                        <div key={course.id || idx} className="p-4 bg-zinc-50 rounded-[10px] border border-zinc-200 space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-zinc-950">{course.name}</span>
                                {course.isCompleted ? (
                                  <Badge variant="verified" size="sm">Mastered</Badge>
                                ) : course.completedMissions > 0 ? (
                                  <Badge variant="default" size="sm">In progress</Badge>
                                ) : (
                                  <Badge variant="secondary" size="sm">Upcoming</Badge>
                                )}
                              </div>
                              <p className="text-xs text-zinc-600 mt-0.5">{course.description}</p>
                            </div>

                            <div className="font-mono text-xs text-right shrink-0">
                              <span className="text-zinc-950 font-medium">
                                {course.completedMissions} / {course.totalMissions} missions
                              </span>
                              <span className="text-zinc-500 ml-1.5 font-bold">({course.percentage}%)</span>
                            </div>
                          </div>

                          <div className="w-full h-2 bg-zinc-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black rounded-full transition-all duration-300"
                              style={{ width: `${course.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Certified Mentor Evaluation Reports */}
                  <Card>
                    <CardHeader className="border-b border-zinc-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-zinc-100 border border-zinc-200 rounded-[10px] text-zinc-900">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">Mentor Evaluations & Code Reviews</CardTitle>
                            <CardDescription>Qualitative grading from verified senior developers</CardDescription>
                          </div>
                        </div>

                        <Badge variant="verified">100% Industry Verified</Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                      {!reportData?.mentorEvaluations || reportData.mentorEvaluations.length === 0 ? (
                        <div className="text-center py-8 text-zinc-500 text-xs font-body">
                          No mentor evaluations yet. When {currentChild.name} completes coding challenges, certified mentors review and grade their code here.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {reportData.mentorEvaluations.map((item: any) => (
                            <div
                              key={item.submissionId}
                              className="p-4 bg-zinc-50 rounded-[10px] border border-zinc-200 space-y-2.5"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 pb-2.5">
                                <div>
                                  <h4 className="font-semibold text-sm text-zinc-950">{item.missionTitle}</h4>
                                  <p className="text-xs text-zinc-500 font-mono">
                                    {item.courseName} · Evaluated {new Date(item.date).toLocaleDateString()}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="inline-flex items-center gap-1 bg-zinc-200 border border-zinc-300 px-2.5 py-0.5 rounded-full font-mono text-xs font-bold text-zinc-950">
                                    <Star className="w-3.5 h-3.5 fill-black text-black" />
                                    <span>{item.review?.rating || 5} / 5</span>
                                  </span>
                                  <Badge variant="verified">Approved</Badge>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="font-semibold text-zinc-950">
                                    {item.review?.mentorName || 'Certified Mentor'}
                                  </span>
                                  <span className="text-zinc-400">·</span>
                                  <span className="text-zinc-500 text-[11px]">
                                    {item.review?.mentorHeadline || 'Staff Software Engineer'}
                                  </span>
                                </div>
                                <p className="text-xs text-zinc-800 italic bg-white p-3 rounded-[8px] border border-zinc-200 leading-relaxed font-body">
                                  "{item.review?.feedback}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CHEERS & ENCOURAGEMENT */}
          {activeParentTab === 'CHEERS' && currentChild && (
            <div className="space-y-6">
              <Card className="border-zinc-200">
                <CardHeader>
                  <CardTitle>Send Encouragement Boost</CardTitle>
                  <CardDescription>
                    Your cheers appear on {currentChild.name}’s dashboard and reward them with{' '}
                    <strong className="text-zinc-950 font-mono">+15 XP</strong> to boost their streak!
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preset Cheer Chips */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">Quick templates</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cheerTemplates.map((template, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCheerNote(template)}
                          className={`p-3 rounded-[10px] text-left text-xs border transition-all ${
                            cheerNote === template
                              ? 'bg-black text-white border-black'
                              : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
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
                      placeholder="Write a warm note of encouragement..."
                      className="w-full bg-white border border-zinc-300 rounded-[10px] p-3.5 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black transition-colors font-body"
                    />

                    <Button
                      variant="default"
                      size="default"
                      onClick={() =>
                        cheerMutation.mutate({
                          childId: currentChild.id,
                          message: cheerNote,
                        })
                      }
                      disabled={!cheerNote.trim() || cheerMutation.isPending}
                      isLoading={cheerMutation.isPending}
                      className="gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send Cheer (+15 XP to {currentChild.name})</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Past Cheers List */}
              <Card>
                <CardHeader>
                  <CardTitle>Cheer History</CardTitle>
                  <CardDescription>Motivational boosts sent to {currentChild.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  {!currentChild.cheers || currentChild.cheers.length === 0 ? (
                    <p className="text-xs text-zinc-500 py-2">No encouragement cheers sent yet.</p>
                  ) : (
                    <div className="divide-y divide-zinc-200">
                      {currentChild.cheers.map((cheer: any) => (
                        <div key={cheer.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                          <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-zinc-100 border border-zinc-200 rounded-full text-zinc-900 mt-0.5">
                              <Heart className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
                            </div>
                            <div>
                              <p className="text-zinc-800 font-body">{cheer.message}</p>
                              <span className="text-[11px] text-zinc-500 mt-0.5 block font-mono">
                                Sent {new Date(cheer.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <Badge variant="streak">+15 XP</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Link Child Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-2xl animate-slide-up border-zinc-300">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Link a Student Account</CardTitle>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CardDescription>
              Enter the student email address registered on DuniyaAI to link their profile and track verified reports.
            </CardDescription>

            <Input
              type="email"
              placeholder="student@example.com"
              value={linkEmail}
              onChange={(e) => setLinkEmail(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowLinkModal(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => linkMutation.mutate(linkEmail)}
                disabled={!linkEmail || linkMutation.isPending}
                isLoading={linkMutation.isPending}
              >
                Confirm link
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
