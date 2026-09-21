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
  MessageSquare,
  Code2,
  Lock,
  ChevronDown,
  ChevronRight,
  Award,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ParentPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedChildIndex, setSelectedChildIndex] = useState(0);
  const [activeParentTab, setActiveParentTab] = useState<'OVERVIEW' | 'COMMUNICATIONS' | 'CHEERS'>('OVERVIEW');
  const [linkEmail, setLinkEmail] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [cheerNote, setCheerNote] = useState('Super proud of your consistency! Keep building! 🚀');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>(null);

  // Fetch parent's linked children
  const { data: children, isLoading: loadingChildren } = useQuery({
    queryKey: ['parent-children'],
    queryFn: () => api.parent.getChildren(),
  });

  const currentChild = children?.[selectedChildIndex] || null;

  // Fetch full child communications when on COMMUNICATIONS tab
  const { data: communicationsData, isLoading: loadingComms } = useQuery({
    queryKey: ['child-communications', currentChild?.id],
    queryFn: () => (currentChild?.id ? api.parent.getChildCommunications(currentChild.id) : null),
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
      queryClient.invalidateQueries({ queryKey: ['child-communications', currentChild?.id] });
      setCheerNote('');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Could not send cheer');
    },
  });

  // Cheer preset templates
  const cheerTemplates = [
    'Super proud of your consistency! Keep crushing your streak! 🚀',
    "Loved seeing Elena's feedback on your code! You're making real progress! 👏",
    'Take a well-deserved break! Proud of your hard work today! ☕',
    'Every line of code brings you closer to your dream role! Keep it up! 🌟',
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
              Verified Safe Mentoring
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Family Learning Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time transparency into your student's learning velocity, mentor interactions, and portfolio milestones.
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
      {(!children || children.length === 0) ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">No Children Linked Yet</h2>
          <p className="text-gray-400 text-sm">
            Enter your child's student email address below to monitor their progress, verify their projects, and send encouragement.
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
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <button
              onClick={() => setActiveParentTab('OVERVIEW')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeParentTab === 'OVERVIEW'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Learning Velocity & Milestones</span>
            </button>

            <button
              onClick={() => setActiveParentTab('COMMUNICATIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeParentTab === 'COMMUNICATIONS'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Mentor Communications & Safety Oversight</span>
              {currentChild?.mentorCommunications?.waitingOnMentorCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-gray-950 font-mono text-[10px] font-bold">
                  {currentChild.mentorCommunications.waitingOnMentorCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveParentTab('CHEERS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
                  <div className="text-xs text-gray-400">Estimated Practice</div>
                  <div className="text-2xl font-bold text-white mt-1">~{currentChild.estimatedHours} Hours</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Based on earned XP</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-400">Verified Projects</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">
                    {currentChild.completedMissionsCount} Missions
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Reviewed by mentors</div>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="text-xs text-gray-400">Total Accumulated XP</div>
                  <div className="text-2xl font-bold text-amber-400 mt-1">{currentChild.xp} XP</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Curriculum velocity</div>
                </div>
              </div>

              {/* Recent Activity & Mentor Reviews Feed */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Recent Project Milestones & Mentor Reviews</h3>
                  <span className="text-xs text-gray-500">Live verified updates</span>
                </div>

                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                  {currentChild.recentActivity?.map((activity: any, idx: number) => (
                    <div key={idx} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-accent-400">{activity.courseName}</span>
                          <span className="text-gray-600">•</span>
                          <h4 className="font-bold text-white text-sm">{activity.missionTitle}</h4>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              activity.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>

                        {activity.review && (
                          <div className="p-3 bg-gray-950/70 border border-gray-800 rounded-xl text-xs text-gray-300 flex items-start gap-2.5">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="italic">"{activity.review}"</p>
                              <span className="text-[11px] text-accent-400 font-semibold mt-1 block">
                                — Evaluated by {activity.mentorName || 'Elena Rostova (Staff Mentor)'}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-amber-400">+{activity.xp} XP</span>
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          {new Date(activity.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TAB 2: MENTOR COMMUNICATIONS & SAFETY OVERSIGHT
              ───────────────────────────────────────────────────────────── */}
          {activeParentTab === 'COMMUNICATIONS' && currentChild && (
            <div className="space-y-6">
              {/* Safety & Compliance Card */}
              <div className="bg-gradient-to-r from-emerald-950/30 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Full Parental Transparency Guarantee</h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      All technical questions and mentor guidance are logged here in full. Mentors are certified industry professionals adhering to strict educational conduct policies.
                    </p>
                  </div>
                </div>

                <div className="text-xs text-emerald-400 font-mono font-semibold px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl self-start sm:self-auto shrink-0">
                  100% Monitored & Safe
                </div>
              </div>

              {/* Discussions Accordion */}
              {loadingComms ? (
                <LoadingSpinner />
              ) : !communicationsData?.threads || communicationsData.threads.length === 0 ? (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center text-gray-500 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto text-gray-600" />
                  <h3 className="text-base font-bold text-white">No mentor inquiries yet</h3>
                  <p className="text-xs max-w-md mx-auto">
                    When {currentChild.name} asks a question or gets code guidance from mentors, every conversation and code snippet will appear here for your review.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {communicationsData.threads.map((thread: any) => {
                    const isExpanded = expandedThreadId === thread.id;
                    const mentor = thread.mentor;

                    return (
                      <div
                        key={thread.id}
                        className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-accent-500/40 transition-all"
                      >
                        {/* Summary Bar */}
                        <button
                          onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                          className="w-full p-5 text-left flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/60"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-accent-400">
                                {thread.mission?.title || 'General Code Consultation'}
                              </span>
                              <span className="text-gray-600">•</span>
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  thread.status === 'RESOLVED'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-accent-500/10 text-accent-300 border border-accent-500/30'
                                }`}
                              >
                                {thread.status === 'RESOLVED' ? 'Resolved' : 'Active Guidance'}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-white">{thread.subject}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-400 pt-0.5">
                              <span>Mentor: <strong className="text-gray-200">{mentor?.name || 'Elena Rostova'}</strong></span>
                              <span>•</span>
                              <span>{thread.messages?.length || 0} messages exchanged</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-end md:self-auto">
                            <span className="text-xs text-gray-500">
                              {new Date(thread.updatedAt).toLocaleDateString()}
                            </span>
                            <div className="p-1.5 bg-gray-800 rounded-lg text-gray-400">
                              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                            </div>
                          </div>
                        </button>

                        {/* Expanded Conversation Log */}
                        {isExpanded && (
                          <div className="p-5 border-t border-gray-800 bg-gray-950/60 space-y-4">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                              Full Conversation Transcript
                            </div>

                            <div className="space-y-3">
                              {thread.messages?.map((msg: any) => {
                                const isChild = msg.senderRole === 'STUDENT';
                                return (
                                  <div
                                    key={msg.id}
                                    className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                                      isChild
                                        ? 'bg-primary-950/40 border border-primary-500/30'
                                        : 'bg-gray-850 border border-accent-500/30'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between text-xs mb-2">
                                      <div className="flex items-center gap-2">
                                        <strong className={isChild ? 'text-primary-300' : 'text-accent-300'}>
                                          {isChild ? `${currentChild.name} (Student)` : `${mentor?.name || 'Staff Mentor'} (Certified)`}
                                        </strong>
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-950 text-gray-400 font-mono">
                                          {msg.senderRole}
                                        </span>
                                      </div>
                                      <span className="text-gray-500 text-[11px]">
                                        {new Date(msg.createdAt).toLocaleString()}
                                      </span>
                                    </div>

                                    <p className="text-gray-200 whitespace-pre-wrap">{msg.content}</p>

                                    {msg.codeSnippet && (
                                      <div className="mt-3 p-3 bg-gray-950 rounded-xl border border-gray-800">
                                        <div className="text-[10px] font-mono text-accent-400 mb-1 flex items-center gap-1 font-semibold">
                                          <Code2 className="w-3 h-3" />
                                          Code Excerpt {msg.stepNumber ? `(Step ${msg.stepNumber})` : ''}
                                        </div>
                                        <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre">
                                          <code>{msg.codeSnippet}</code>
                                        </pre>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
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
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Heart className="w-6 h-6 fill-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Send Encouragement to {currentChild.name}</h3>
                    <p className="text-xs text-gray-400">
                      Sending a cheer awards a <strong className="text-rose-400">+15 XP motivation boost</strong> directly to their account.
                    </p>
                  </div>
                </div>

                {/* Quick Cheer Templates */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">Quick Encouragement Templates</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cheerTemplates.map((template, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCheerNote(template)}
                        className="p-3 bg-gray-950 hover:bg-gray-800 border border-gray-800 hover:border-rose-500/40 rounded-xl text-left text-xs text-gray-300 transition-colors"
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Note */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-300">Personalized Note</label>
                  <textarea
                    rows={3}
                    value={cheerNote}
                    onChange={(e) => setCheerNote(e.target.value)}
                    placeholder="Write a custom cheer or motivational message..."
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!cheerNote.trim()) {
                      toast.error('Please write an encouragement note');
                      return;
                    }
                    cheerMutation.mutate({
                      childId: currentChild.id,
                      message: cheerNote.trim(),
                    });
                  }}
                  disabled={!cheerNote.trim() || cheerMutation.isPending}
                  className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-rose-600/20 hover:scale-[1.02] active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Cheer (+15 XP Boost)</span>
                </button>
              </div>

              {/* Past Cheers Timeline */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white">Cheer & Motivation History</h3>
                {communicationsData?.cheers?.length === 0 ? (
                  <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl text-center text-gray-500 text-xs">
                    No cheers sent yet. Use the form above to send your first encouragement boost!
                  </div>
                ) : (
                  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-800">
                    {communicationsData?.cheers?.map((cheer: any) => (
                      <div key={cheer.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                            <Heart className="w-4 h-4 fill-rose-400" />
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-200 font-medium">"{cheer.message}"</p>
                            <span className="text-[11px] text-gray-500">
                              Sent on {new Date(cheer.createdAt).toLocaleDateString()} at {new Date(cheer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold shrink-0">
                          +{cheer.xpAwarded} XP
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

      {/* Modal: Link Another Child */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary-400" />
                <h3 className="text-lg font-bold text-white">Link Student Account</h3>
              </div>
              <button
                onClick={() => setShowLinkModal(false)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Enter your child's registered email address on DuniyaAI. You will immediately gain access to their progress, study velocity, and mentor guidance.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Child's Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. student@duniyaai.com"
                  value={linkEmail}
                  onChange={(e) => setLinkEmail(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLinkModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => linkMutation.mutate(linkEmail)}
                  disabled={!linkEmail || linkMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  Link Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
