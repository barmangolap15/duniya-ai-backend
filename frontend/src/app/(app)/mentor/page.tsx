'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { soundManager } from '@/lib/sounds';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Code2,
  Eye,
  Star,
  Sparkles,
  Award,
  Users,
  AlertCircle,
  ThumbsUp,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Send,
  HelpCircle,
  Copy,
  ChevronRight,
  Flame,
  MessageCircle,
  PlusCircle,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MentorPage() {
  const queryClient = useQueryClient();

  // Primary Workbench Tab
  const [workbenchTab, setWorkbenchTab] = useState<'QUEUE' | 'INQUIRIES' | 'MENTEES'>('QUEUE');

  // Review Queue state
  const [selectedQueueFilter, setSelectedQueueFilter] = useState<'ALL' | 'SUBMITTED' | 'APPROVED'>('SUBMITTED');
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html');
  const [reviewRating, setReviewRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('Great semantic HTML structure! Clean container styling and proper tag hierarchy.');

  // Quick feedback templates
  const feedbackTemplates = [
    'Great semantic HTML structure! Clean container styling and proper tag hierarchy.',
    'Excellent responsive layout! Consider using flexbox gap instead of margins for cleaner spacing.',
    'Clean separation of DOM manipulation and JS event handlers. Great code architecture.',
    'Good foundation! Watch out for color contrast on the button text for better accessibility.',
  ];

  // Inquiries / Q&A state
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [inquiryFilter, setInquiryFilter] = useState<'ALL' | 'NEEDS_REPLY' | 'RESOLVED'>('ALL');
  const [mentorReplyText, setMentorReplyText] = useState('');
  const [mentorReplyCode, setMentorReplyCode] = useState('');
  const [showReplyCodeInput, setShowReplyCodeInput] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Direct message modal state
  const [dmStudent, setDmStudent] = useState<any>(null);
  const [dmSubject, setDmSubject] = useState('');
  const [dmMessage, setDmMessage] = useState('');
  const [dmCode, setDmCode] = useState('');

  // Mentor stats
  const { data: stats } = useQuery({
    queryKey: ['mentor-stats'],
    queryFn: () => api.mentor.getStats(),
  });

  // Review queue
  const { data: queue, isLoading: loadingQueue } = useQuery({
    queryKey: ['mentor-queue', selectedQueueFilter],
    queryFn: () => api.mentor.getQueue(selectedQueueFilter),
  });

  // Student inquiries / threads
  const { data: threads, isLoading: loadingThreads } = useQuery({
    queryKey: ['mentorship-threads'],
    queryFn: () => api.mentorship.getThreads(),
  });

  // Mentees roster
  const { data: mentees, isLoading: loadingMentees } = useQuery({
    queryKey: ['mentor-mentees'],
    queryFn: () => api.mentor.getMentees(),
  });

  // Submit review mutation
  const reviewMutation = useMutation({
    mutationFn: (data: { submissionId: string; status: 'APPROVED' | 'REJECTED'; feedback: string; rating: number }) =>
      api.mentor.review(data.submissionId, {
        status: data.status,
        feedback: data.feedback,
        rating: data.rating,
      }),
    onSuccess: (data, variables) => {
      if (variables.status === 'APPROVED') {
        soundManager.playStepComplete();
        toast.success('Submission approved! Student awarded +35 bonus XP.');
      } else {
        toast.success('Feedback submitted and changes requested.');
      }
      queryClient.invalidateQueries({ queryKey: ['mentor-queue'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-stats'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-mentees'] });
      setActiveSubmission(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to submit review');
    },
  });

  // Mentor add reply mutation
  const addReplyMutation = useMutation({
    mutationFn: ({ threadId, content, codeSnippet }: { threadId: string; content: string; codeSnippet?: string }) =>
      api.mentorship.addMessage(threadId, { content, codeSnippet }),
    onSuccess: () => {
      soundManager.playTap();
      setMentorReplyText('');
      setMentorReplyCode('');
      setShowReplyCodeInput(false);
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-stats'] });
      toast.success('Reply sent to student!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send reply');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ threadId, status }: { threadId: string; status: string }) =>
      api.mentorship.updateStatus(threadId, status),
    onSuccess: (res, vars) => {
      toast.success(`Inquiry marked as ${vars.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
      queryClient.invalidateQueries({ queryKey: ['mentor-stats'] });
    },
  });

  // Direct Message initiate mutation
  const initiateDmMutation = useMutation({
    mutationFn: (data: any) => api.mentorship.createThread(data),
    onSuccess: () => {
      soundManager.playStepComplete();
      toast.success(`Guidance message dispatched to ${dmStudent?.name}!`);
      setDmStudent(null);
      setDmSubject('');
      setDmMessage('');
      setDmCode('');
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
      setWorkbenchTab('INQUIRIES');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send guidance note');
    },
  });

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  if (loadingQueue && loadingThreads && loadingMentees) return <LoadingSpinner />;

  // Filter inquiries
  const filteredThreads = (threads || []).filter((t: any) => {
    if (inquiryFilter === 'ALL') return true;
    if (inquiryFilter === 'RESOLVED') return t.status === 'RESOLVED';
    if (inquiryFilter === 'NEEDS_REPLY') return t.status === 'WAITING_ON_MENTOR' || t.status === 'OPEN';
    return true;
  });

  const activeThread =
    threads?.find((t: any) => t.id === selectedThreadId) || filteredThreads?.[0] || null;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Mentor Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent-400" />
              Staff Mentor Workbench
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Parent Oversight Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Code Review & Guidance Hub</h1>
          <p className="text-gray-400 text-sm mt-1">
            Review submissions in live sandboxes, answer student questions, and communicate with learners in a transparent ecosystem.
          </p>
        </div>

        {/* Workbench Primary Nav Switcher */}
        <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-2xl border border-gray-800 self-start md:self-auto">
          <button
            onClick={() => setWorkbenchTab('QUEUE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              workbenchTab === 'QUEUE'
                ? 'bg-accent-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Review Queue</span>
            {stats?.pendingQueueCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-gray-950 font-mono text-[10px] font-bold">
                {stats.pendingQueueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setWorkbenchTab('INQUIRIES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              workbenchTab === 'INQUIRIES'
                ? 'bg-accent-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Student Q&A</span>
            {stats?.openThreadsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-mono text-[10px] font-bold animate-pulse">
                {stats.openThreadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setWorkbenchTab('MENTEES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              workbenchTab === 'MENTEES'
                ? 'bg-accent-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Active Mentees</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center text-primary-400 mb-3">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Queue Awaiting Review</div>
            <div className="text-2xl font-bold text-white mt-1">{stats?.pendingQueueCount ?? 2}</div>
            <div className="text-[11px] text-amber-400 mt-0.5">Code submissions</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Open Student Inquiries</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{stats?.openThreadsCount ?? 1}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Awaiting guidance</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Reviews Completed</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{stats?.reviewsCompleted ?? 4}</div>
            <div className="text-[11px] text-gray-500 mt-0.5">Total evaluations</div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Average Review Rating</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{stats?.averageRating ?? '5.0'} / 5.0</div>
            <div className="text-[11px] text-gray-500 mt-0.5">High standard</div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          VIEW 1: CODE REVIEW QUEUE
          ───────────────────────────────────────────────────────────── */}
      {workbenchTab === 'QUEUE' && (
        <div className="space-y-6">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            {(
              [
                { id: 'SUBMITTED', label: 'Pending Review' },
                { id: 'APPROVED', label: 'Approved Submissions' },
                { id: 'ALL', label: 'All Submissions' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedQueueFilter(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedQueueFilter === tab.id
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-900 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Queue Grid */}
          {(!queue || queue.length === 0) ? (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center text-gray-400 space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">Review queue is clear!</h3>
              <p className="text-xs text-gray-500">No submissions matching the current filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {queue.map((sub: any) => (
                <div
                  key={sub.id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-accent-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          sub.studentAvatar ||
                          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                        }
                        alt={sub.studentName}
                        className="w-10 h-10 rounded-xl object-cover border border-gray-700"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white truncate">{sub.studentName}</div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-2">
                          <span>LVL {sub.studentLevel}</span>
                          <span>•</span>
                          <span className="text-amber-400">⚡ {sub.studentXp} XP</span>
                          <span>•</span>
                          <span className="text-orange-400 font-semibold">{sub.studentStreak}d 🔥</span>
                        </div>
                      </div>
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

                    {/* Mission Details */}
                    <div className="space-y-1">
                      <div className="text-xs text-accent-400 font-semibold">{sub.courseName}</div>
                      <h3 className="text-base font-bold text-white">{sub.missionTitle}</h3>
                    </div>

                    {/* Code Snapshot Thumbnail */}
                    <div className="h-32 bg-white rounded-lg overflow-hidden border border-gray-800 relative">
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head><style>body { margin: 0; padding: 10px; font-family: sans-serif; font-size: 12px; } ${sub.cssCode}</style></head>
                            <body>${sub.htmlCode}<script>${sub.jsCode}<\/script></body>
                          </html>
                        `}
                        className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
                        tabIndex={-1}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-gray-500">
                      {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => {
                        setActiveSubmission(sub);
                        setFeedbackText(
                          sub.reviews?.[0]?.feedback ||
                            'Great semantic HTML structure! Clean container styling and proper tag hierarchy.',
                        );
                        setReviewRating(sub.reviews?.[0]?.rating || 5);
                      }}
                      className="px-4 py-2 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Inspect & Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 2: STUDENT Q&A & INQUIRIES WORKBENCH
          ───────────────────────────────────────────────────────────── */}
      {workbenchTab === 'INQUIRIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Threads List (5 cols) */}
          <div className="lg:col-span-5 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-3.5 border-b border-gray-800 bg-gray-950/70 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Student Inquiries ({filteredThreads.length})
              </span>
              <div className="flex items-center gap-1 bg-gray-900 p-0.5 rounded-lg border border-gray-800">
                {(['ALL', 'NEEDS_REPLY', 'RESOLVED'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setInquiryFilter(f)}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                      inquiryFilter === f
                        ? 'bg-accent-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f === 'ALL' ? 'All' : f === 'NEEDS_REPLY' ? 'Needs Reply' : 'Resolved'}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-gray-800 max-h-[620px] overflow-y-auto">
              {filteredThreads.length === 0 ? (
                <div className="p-8 text-center text-gray-500 space-y-2">
                  <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
                  <p className="text-sm font-medium text-white">All caught up!</p>
                  <p className="text-xs">No student questions waiting for reply.</p>
                </div>
              ) : (
                filteredThreads.map((thread: any) => {
                  const isSelected = activeThread?.id === thread.id;
                  const needsReply = thread.status === 'WAITING_ON_MENTOR' || thread.status === 'OPEN';
                  const lastMsg = thread.messages?.[thread.messages.length - 1];

                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThreadId(thread.id)}
                      className={`w-full p-4 text-left transition-all flex flex-col gap-2.5 ${
                        isSelected
                          ? 'bg-accent-950/30 border-l-4 border-l-accent-500'
                          : 'hover:bg-gray-850 bg-gray-900/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              thread.student?.avatarUrl ||
                              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                            }
                            alt={thread.student?.name}
                            className="w-6 h-6 rounded-full object-cover border border-gray-700"
                          />
                          <span className="text-xs font-bold text-white truncate max-w-[140px]">
                            {thread.student?.name}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            thread.status === 'RESOLVED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : needsReply
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30 font-extrabold animate-pulse'
                                : 'bg-primary-500/10 text-primary-300 border border-primary-500/30'
                          }`}
                        >
                          {thread.status === 'RESOLVED'
                            ? 'Resolved'
                            : needsReply
                              ? 'Action Required'
                              : 'Waiting on Student'}
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] text-accent-400 font-semibold mb-0.5">
                          {thread.mission?.title || 'General Mentorship Consultation'}
                        </div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{thread.subject}</h4>
                      </div>

                      {lastMsg && (
                        <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                          <strong className="text-gray-300">
                            {lastMsg.senderRole === 'MENTOR' ? 'You: ' : `${thread.student?.name || 'Student'}: `}
                          </strong>
                          {lastMsg.content}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                        <span>{new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1 text-accent-400 font-medium">
                          {thread.messages?.length || 0} messages
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right: Active Thread Conversation & Guidance Form (7 cols) */}
          <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col min-h-[620px]">
            {activeThread ? (
              <>
                {/* Thread Header */}
                <div className="p-4 sm:p-5 border-b border-gray-800 bg-gray-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-accent-400">
                        {activeThread.mission?.title ? `Mission: ${activeThread.mission.title}` : 'General Consultation'}
                      </span>
                      {activeThread.missionId && (
                        <a
                          href={`/mission/${activeThread.missionId}/`}
                          className="text-[11px] text-primary-400 hover:text-primary-300 flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Task
                        </a>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-white">{activeThread.subject}</h2>
                    <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>Student: <strong className="text-white">{activeThread.student?.name}</strong></span>
                      <span>•</span>
                      <span>Level {activeThread.student?.level || 1}</span>
                      <span>•</span>
                      <span className="text-amber-400">⚡ {activeThread.student?.xp || 0} XP</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateStatusMutation.mutate({
                          threadId: activeThread.id,
                          status: activeThread.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED',
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        activeThread.status === 'RESOLVED'
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {activeThread.status === 'RESOLVED' ? 'Reopen Inquiry' : 'Mark Resolved'}
                    </button>
                  </div>
                </div>

                {/* Transparency Notice */}
                <div className="px-4 py-1.5 bg-primary-950/30 border-b border-gray-800 flex items-center justify-between text-[11px] text-primary-300">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
                    All replies are mirrored to linked parent oversight portal.
                  </span>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[460px]">
                  {activeThread.messages?.map((msg: any) => {
                    const isMentor = msg.senderRole === 'MENTOR';
                    return (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${isMentor ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <img
                          src={
                            msg.sender?.avatarUrl ||
                            (isMentor
                              ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
                              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')
                          }
                          alt={msg.sender?.name || 'User'}
                          className="w-8 h-8 rounded-xl object-cover shrink-0 border border-gray-700"
                        />

                        <div className={`space-y-1.5 max-w-[85%] ${isMentor ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-center gap-2 text-[11px] ${isMentor ? 'justify-end' : 'justify-start'}`}>
                            <span className="font-semibold text-gray-300">
                              {isMentor ? 'You (Staff Mentor)' : msg.sender?.name || 'Student'}
                            </span>
                            <span className="text-gray-500">
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div
                            className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              isMentor
                                ? 'bg-accent-600 text-white rounded-tr-none shadow-md'
                                : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{msg.content}</p>

                            {msg.codeSnippet && (
                              <div className="mt-3 relative rounded-xl bg-gray-950 border border-gray-800 p-3 text-left">
                                <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-2 border-b border-gray-800 pb-1">
                                  <span className="flex items-center gap-1 text-accent-400 font-bold">
                                    <Code2 className="w-3 h-3" />
                                    Attached Code {msg.stepNumber ? `• Step ${msg.stepNumber}` : ''}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyCode(msg.codeSnippet, msg.id)}
                                    className="text-gray-400 hover:text-white flex items-center gap-1"
                                  >
                                    {copiedSnippetId === msg.id ? (
                                      <Check className="w-3 h-3 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                    <span>{copiedSnippetId === msg.id ? 'Copied' : 'Copy'}</span>
                                  </button>
                                </div>
                                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre p-1">
                                  <code>{msg.codeSnippet}</code>
                                </pre>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mentor Guidance Reply Form */}
                <div className="p-4 border-t border-gray-800 bg-gray-950">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!mentorReplyText.trim()) return;
                      addReplyMutation.mutate({
                        threadId: activeThread.id,
                        content: mentorReplyText.trim(),
                        codeSnippet: mentorReplyCode.trim() ? mentorReplyCode.trim() : undefined,
                      });
                    }}
                    className="space-y-3"
                  >
                    {showReplyCodeInput && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1 font-mono text-accent-400">
                            <Code2 className="w-3.5 h-3.5" /> Attach Corrective Code Suggestion
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowReplyCodeInput(false);
                              setMentorReplyCode('');
                            }}
                            className="text-gray-500 hover:text-gray-300 text-[11px]"
                          >
                            Remove
                          </button>
                        </div>
                        <textarea
                          value={mentorReplyCode}
                          onChange={(e) => setMentorReplyCode(e.target.value)}
                          placeholder="/* Example mentor recommendation: */\n.card { display: flex; flex-direction: column; align-items: center; }"
                          rows={4}
                          className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-accent-500 resize-none"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowReplyCodeInput(!showReplyCodeInput)}
                        className={`p-2.5 rounded-xl border transition-colors ${
                          showReplyCodeInput
                            ? 'bg-accent-500/20 border-accent-500/40 text-accent-300'
                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                        title="Attach suggested code snippet"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>

                      <input
                        type="text"
                        value={mentorReplyText}
                        onChange={(e) => setMentorReplyText(e.target.value)}
                        placeholder="Provide constructive engineering guidance or hints..."
                        className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-accent-500 placeholder:text-gray-500"
                      />

                      <button
                        type="submit"
                        disabled={!mentorReplyText.trim() || addReplyMutation.isPending}
                        className="px-4 py-2.5 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 space-y-3">
                <MessageSquare className="w-12 h-12 text-gray-700" />
                <h3 className="text-base font-bold text-white">Select a student inquiry</h3>
                <p className="text-xs text-gray-400 max-w-sm">
                  Click any question from the left column to view the student's code context and send engineering feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          VIEW 3: ACTIVE MENTEES DIRECTORY
          ───────────────────────────────────────────────────────────── */}
      {workbenchTab === 'MENTEES' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Apprentice & Mentee Roster</h2>
              <p className="text-xs text-gray-400">Track student progress velocity, active blockers, and initiate direct guidance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(mentees || []).map((student: any) => (
              <div
                key={student.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-accent-500/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        student.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                      }
                      alt={student.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-700"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-white text-base truncate">{student.name}</div>
                      <p className="text-xs text-gray-400 truncate">{student.headline}</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-3 text-xs">
                    <span className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-gray-300 font-mono">
                      LVL {student.level}
                    </span>
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      ⚡ {student.xp} XP
                    </span>
                    <span className="flex items-center gap-1 text-orange-400 font-semibold">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      {student.streak}d streak
                    </span>
                  </div>

                  {/* Status Note */}
                  {student.hasPendingQuestion ? (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Has an open question awaiting mentor feedback!
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-gray-950/70 border border-gray-800 text-xs text-gray-400">
                      Last active: {student.recentSubmissions?.[0]?.mission?.title || 'Starting missions'}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-gray-800">
                  <button
                    onClick={() => {
                      setDmStudent(student);
                      setDmSubject(`Mentorship check-in with ${student.name}`);
                    }}
                    className="flex-1 py-2 px-3 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Send Guidance</span>
                  </button>

                  <Link
                    href={`/portfolio/${student.id}`}
                    target="_blank"
                    className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs transition-colors"
                    title="View Portfolio"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          SPLIT-SCREEN CODE INSPECTION MODAL (from Review Queue)
          ───────────────────────────────────────────────────────────── */}
      {activeSubmission && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 lg:p-8 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Top Bar */}
            <div className="p-5 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={
                    activeSubmission.studentAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                  }
                  alt={activeSubmission.studentName}
                  className="w-10 h-10 rounded-xl object-cover border border-gray-700"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{activeSubmission.studentName}</h3>
                    <span className="text-xs text-accent-400 font-semibold">• {activeSubmission.missionTitle}</span>
                  </div>
                  <p className="text-xs text-gray-400">{activeSubmission.courseName}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveSubmission(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Split Screen Body */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
              {/* Left 7 Columns: Code & Live Preview */}
              <div className="lg:col-span-7 flex flex-col border-r border-gray-800 h-full overflow-hidden">
                {/* Code Tabs */}
                <div className="p-2 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {(['html', 'css', 'js'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono uppercase font-bold transition-colors ${
                          codeTab === tab
                            ? 'bg-accent-500/20 text-accent-300 border border-accent-500/40'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">Read-Only Code Inspector</span>
                </div>

                {/* Code Viewer */}
                <div className="h-1/2 p-4 bg-gray-950 overflow-y-auto font-mono text-xs text-gray-300">
                  <pre className="whitespace-pre leading-relaxed text-emerald-300">
                    <code>
                      {codeTab === 'html' && (activeSubmission.htmlCode || '<!-- No HTML submitted -->')}
                      {codeTab === 'css' && (activeSubmission.cssCode || '/* No CSS submitted */')}
                      {codeTab === 'js' && (activeSubmission.jsCode || '// No JS submitted')}
                    </code>
                  </pre>
                </div>

                {/* Live Sandboxed Output */}
                <div className="h-1/2 border-t border-gray-800 flex flex-col bg-white">
                  <div className="p-2 bg-gray-900 border-b border-gray-800 text-[11px] text-gray-400 font-mono flex items-center justify-between">
                    <span>Live Runnable Sandbox</span>
                    <span className="text-emerald-400">● Interactive Preview</span>
                  </div>
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            body { margin: 0; padding: 16px; font-family: sans-serif; }
                            ${activeSubmission.cssCode}
                          </style>
                        </head>
                        <body>
                          ${activeSubmission.htmlCode}
                          <script>${activeSubmission.jsCode}<\/script>
                        </body>
                      </html>
                    `}
                    className="flex-1 w-full border-0"
                    sandbox="allow-scripts"
                  />
                </div>
              </div>

              {/* Right 5 Columns: Evaluation Rubric & Feedback */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between overflow-y-auto bg-gray-900/60 space-y-6">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Mentor Evaluation Rubric</h4>
                    <p className="text-xs text-gray-400">
                      Provide constructive feedback to guide the student towards professional engineering standards.
                    </p>
                  </div>

                  {/* Rating Picker */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300">Star Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-sm font-bold text-amber-400 ml-2">{reviewRating} / 5.0</span>
                    </div>
                  </div>

                  {/* Quick Feedback Templates */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300">Quick Industry Templates</label>
                    <div className="flex flex-wrap gap-1.5">
                      {feedbackTemplates.map((t, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFeedbackText(t)}
                          className="px-2.5 py-1 bg-gray-950 hover:bg-gray-800 border border-gray-800 text-[11px] text-gray-300 rounded-lg text-left truncate max-w-full transition-colors"
                        >
                          {t.slice(0, 45)}...
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Written Feedback Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-300">Constructive Feedback Note</label>
                    <textarea
                      rows={5}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-accent-500 resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-800">
                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        reviewMutation.mutate({
                          submissionId: activeSubmission.id,
                          status: 'REJECTED',
                          feedback: feedbackText,
                          rating: reviewRating,
                        })
                      }
                      disabled={reviewMutation.isPending}
                      className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Request Revisions</span>
                    </button>

                    <button
                      onClick={() =>
                        reviewMutation.mutate({
                          submissionId: activeSubmission.id,
                          status: 'APPROVED',
                          feedback: feedbackText,
                          rating: reviewRating,
                        })
                      }
                      disabled={reviewMutation.isPending}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-95"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Approve (+35 Bonus XP)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DIRECT GUIDANCE INITIATION MODAL
          ───────────────────────────────────────────────────────────── */}
      {dmStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <img
                  src={
                    dmStudent.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                  }
                  alt={dmStudent.name}
                  className="w-10 h-10 rounded-xl object-cover border border-accent-500/40"
                />
                <div>
                  <h3 className="text-base font-bold text-white">Send Guidance to {dmStudent.name}</h3>
                  <p className="text-xs text-gray-400">Initiate a dedicated 1-on-1 mentorship discussion</p>
                </div>
              </div>
              <button
                onClick={() => setDmStudent(null)}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!dmSubject.trim() || !dmMessage.trim()) return;
                initiateDmMutation.mutate({
                  studentId: dmStudent.id,
                  subject: dmSubject.trim(),
                  message: dmMessage.trim(),
                  codeSnippet: dmCode.trim() ? dmCode.trim() : undefined,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Subject / Topic</label>
                <input
                  type="text"
                  required
                  value={dmSubject}
                  onChange={(e) => setDmSubject(e.target.value)}
                  placeholder="e.g. Recommendations on your CSS Layout & Next Steps"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">Guidance Note</label>
                <textarea
                  required
                  rows={4}
                  value={dmMessage}
                  onChange={(e) => setDmMessage(e.target.value)}
                  placeholder="Provide encouragement, recommended reading, architectural insights, or mission tips..."
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-accent-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Code Snippet (Optional)</span>
                  <span className="text-gray-500 font-mono text-[10px]">HTML/CSS/JS</span>
                </label>
                <textarea
                  rows={3}
                  value={dmCode}
                  onChange={(e) => setDmCode(e.target.value)}
                  placeholder="/* Optional code recommendation snippet */"
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-accent-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setDmStudent(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={initiateDmMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-accent-600 hover:bg-accent-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Guidance</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
