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
  Check,
  X,
  ExternalLink,
  MessageSquare,
  Send,
  HelpCircle,
  Copy,
  ChevronRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function MentorPage() {
  const queryClient = useQueryClient();

  // Primary Workbench Tab
  const [workbenchTab, setWorkbenchTab] = useState<'QUEUE' | 'INQUIRIES' | 'MENTEES'>('QUEUE');

  // Review Queue state
  const [selectedQueueFilter, setSelectedQueueFilter] = useState<'ALL' | 'SUBMITTED' | 'APPROVED'>('SUBMITTED');
  const [activeSubmission, setActiveSubmission] = useState<any>(null);
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js'>('html');
  const [reviewRating, setReviewRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState(
    'Great semantic HTML structure! Clean container styling and proper tag hierarchy.'
  );

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 font-body">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Mentor Engineering Workbench</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 font-body">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proof-of-Work Reviewer</span>
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Code Review & Guidance Hub
          </h1>
          <p className="text-zinc-600 text-sm font-body mt-1">
            Review sandbox code submissions, answer student technical questions, and award endorsements.
          </p>
        </div>

        {/* Workbench Primary Nav Switcher */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-[12px] border border-zinc-200 self-start md:self-auto">
          <button
            onClick={() => setWorkbenchTab('QUEUE')}
            className={`px-3.5 py-2 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 ${
              workbenchTab === 'QUEUE'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Review Queue</span>
            {stats?.pendingQueueCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-white font-mono text-[10px] font-bold">
                {stats.pendingQueueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setWorkbenchTab('INQUIRIES')}
            className={`px-3.5 py-2 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 ${
              workbenchTab === 'INQUIRIES'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Student Q&A</span>
            {stats?.openThreadsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-white font-mono text-[10px] font-bold">
                {stats.openThreadsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setWorkbenchTab('MENTEES')}
            className={`px-3.5 py-2 rounded-[10px] text-xs font-semibold transition-all flex items-center gap-2 ${
              workbenchTab === 'MENTEES'
                ? 'bg-black text-white shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Mentee Roster</span>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-200 text-zinc-900 font-mono text-[10px]">
              {mentees?.length || 0}
            </span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <p className="text-xs text-zinc-500 font-body">Pending Reviews</p>
            <p className="font-mono text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{stats?.pendingQueueCount || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
              <Award className="w-5 h-5" />
            </div>
            <p className="text-xs text-zinc-500 font-body">Approved Projects</p>
            <p className="font-mono text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{stats?.approvedReviewsCount || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-xs text-zinc-500 font-body">Open Questions</p>
            <p className="font-mono text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{stats?.openThreadsCount || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="w-9 h-9 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-xs text-zinc-500 font-body">Active Mentees</p>
            <p className="font-mono text-2xl font-bold text-zinc-950 mt-1 tabular-nums">{mentees?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {workbenchTab === 'QUEUE' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {(['SUBMITTED', 'APPROVED', 'ALL'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedQueueFilter(filter)}
                  className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold transition-all ${
                    selectedQueueFilter === filter
                      ? 'bg-black text-white border border-black'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-950 border border-zinc-200'
                  }`}
                >
                  {filter === 'SUBMITTED' ? 'Needs Review' : filter === 'APPROVED' ? 'Approved' : 'All Submissions'}
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-500 font-mono">
              {queue?.length || 0} items in queue
            </span>
          </div>

          {/* Queue List / Split Review Modal */}
          {queue?.length === 0 ? (
            <Card className="p-10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-zinc-900 mx-auto" />
              <CardTitle className="text-lg">Review queue is empty!</CardTitle>
              <CardDescription>
                All student code submissions have been graded and endorsed. Excellent work!
              </CardDescription>
            </Card>
          ) : (
            <Card className="divide-y divide-zinc-200 overflow-hidden">
              {queue?.map((item: any) => (
                <div
                  key={item.id}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar name={item.user?.name || 'Student'} size="md" variant="student" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm text-zinc-950">{item.mission?.title}</span>
                        <Badge
                          variant={item.status === 'APPROVED' ? 'verified' : 'streak'}
                          size="sm"
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 font-mono">
                        Student: <strong className="text-zinc-800">{item.user?.name}</strong> ·{' '}
                        {item.mission?.courseName} · Submitted {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveSubmission(item)}
                      className="gap-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-700" />
                      <span>Inspect Code</span>
                    </Button>
                    <Link href={`/portfolio/${item.user?.id}`} target="_blank">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Portfolio
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {/* TAB 2: INQUIRIES */}
      {workbenchTab === 'INQUIRIES' && (
        <div className="grid md:grid-cols-12 gap-6 min-h-[500px]">
          {/* Thread List */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-1.5 pb-2">
              {(['ALL', 'NEEDS_REPLY', 'RESOLVED'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setInquiryFilter(filter)}
                  className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold ${
                    inquiryFilter === filter
                      ? 'bg-black text-white border border-black'
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:text-zinc-950'
                  }`}
                >
                  {filter === 'ALL' ? 'All' : filter === 'NEEDS_REPLY' ? 'Needs Reply' : 'Resolved'}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredThreads.map((t: any) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedThreadId(t.id)}
                  className={`p-3.5 rounded-[10px] border cursor-pointer transition-all ${
                    activeThread?.id === t.id
                      ? 'border-zinc-950 bg-zinc-100'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-zinc-950 truncate">{t.subject}</span>
                    <Badge variant={t.status === 'RESOLVED' ? 'verified' : 'streak'} size="sm">
                      {t.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-1">{t.messages?.[0]?.content}</p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-1">From: {t.student?.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Detail & Reply */}
          <div className="md:col-span-8">
            {activeThread ? (
              <Card className="h-full flex flex-col justify-between">
                <CardHeader className="border-b border-zinc-200 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{activeThread.subject}</CardTitle>
                      <CardDescription>
                        Student: <strong className="text-zinc-900">{activeThread.student?.name}</strong> ·{' '}
                        {activeThread.mission?.title}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          threadId: activeThread.id,
                          status: activeThread.status === 'RESOLVED' ? 'OPEN' : 'RESOLVED',
                        })
                      }
                      className="text-xs"
                    >
                      {activeThread.status === 'RESOLVED' ? 'Reopen Inquiry' : 'Mark Resolved'}
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
                  {activeThread.messages?.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-3.5 rounded-[10px] text-xs space-y-2 ${
                        msg.senderRole === 'MENTOR'
                          ? 'bg-zinc-100 border border-zinc-300 ml-6'
                          : 'bg-white border border-zinc-200 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500">
                        <span className="font-semibold text-zinc-900">{msg.senderName} ({msg.senderRole})</span>
                        <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-zinc-800 leading-relaxed font-body">{msg.content}</p>
                      {msg.codeSnippet && (
                        <pre className="p-3 bg-zinc-900 rounded border border-zinc-800 font-mono text-[11px] text-zinc-100 overflow-x-auto">
                          <code>{msg.codeSnippet}</code>
                        </pre>
                      )}
                    </div>
                  ))}
                </CardContent>

                {/* Reply Form */}
                <div className="p-4 border-t border-zinc-200 bg-zinc-50/70 space-y-3">
                  <textarea
                    rows={2}
                    placeholder="Write a clear, encouraging technical explanation..."
                    value={mentorReplyText}
                    onChange={(e) => setMentorReplyText(e.target.value)}
                    className="w-full bg-white border border-zinc-300 rounded-[10px] p-3 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black font-body"
                  />

                  {showReplyCodeInput && (
                    <textarea
                      rows={3}
                      placeholder="// Insert optional code snippet recommendation..."
                      value={mentorReplyCode}
                      onChange={(e) => setMentorReplyCode(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-[10px] p-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowReplyCodeInput(!showReplyCodeInput)}
                      className="text-xs text-zinc-600 hover:text-zinc-950 font-medium"
                    >
                      {showReplyCodeInput ? '− Hide code snippet' : '+ Add code snippet'}
                    </button>

                    <Button
                      variant="default"
                      size="sm"
                      onClick={() =>
                        addReplyMutation.mutate({
                          threadId: activeThread.id,
                          content: mentorReplyText,
                          codeSnippet: mentorReplyCode || undefined,
                        })
                      }
                      disabled={!mentorReplyText.trim() || addReplyMutation.isPending}
                      isLoading={addReplyMutation.isPending}
                      className="gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send reply</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center p-10 text-zinc-400 text-xs font-body">
                Select an inquiry from the list to reply
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MENTEES */}
      {workbenchTab === 'MENTEES' && (
        <Card className="divide-y divide-zinc-200 overflow-hidden">
          {mentees?.map((student: any) => (
            <div key={student.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar name={student.name} size="lg" variant="student" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-zinc-950">{student.name}</span>
                    <Badge variant="streak" size="sm">Level {student.level}</Badge>
                  </div>
                  <p className="text-xs text-zinc-600 font-mono">{student.trackName || 'Frontend Web Development'}</p>
                  <p className="text-xs text-zinc-500 font-mono">Streak: {student.streak || 0}d · XP: {student.xp || 0}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end md:self-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDmStudent(student);
                    setDmSubject(`Guidance on ${student.trackName || 'curriculum'}`);
                  }}
                  className="gap-1 text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
                  <span>Send note</span>
                </Button>
                <Link href={`/portfolio/${student.id}`} target="_blank">
                  <Button variant="secondary" size="sm" className="gap-1 text-xs">
                    <span>Portfolio</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* Code Inspector & Review Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up border-zinc-300">
            <CardHeader className="border-b border-zinc-200 flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold">
                  Code Evaluation: {activeSubmission.mission?.title}
                </CardTitle>
                <CardDescription>
                  Student: <strong className="text-zinc-900">{activeSubmission.user?.name}</strong> ·{' '}
                  {activeSubmission.mission?.courseName}
                </CardDescription>
              </div>
              <button
                onClick={() => setActiveSubmission(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </CardHeader>

            <CardContent className="p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Code Preview Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                  <div className="flex items-center gap-2">
                    {(['html', 'css', 'js'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setCodeTab(tab)}
                        className={`px-3 py-1 rounded-[6px] text-xs font-mono uppercase font-semibold ${
                          codeTab === tab
                            ? 'bg-black text-white'
                            : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:text-zinc-950'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-zinc-500 font-mono">AST DOM Validated</span>
                </div>

                <pre className="p-4 bg-zinc-900 rounded-[10px] border border-zinc-800 font-mono text-xs text-zinc-100 overflow-x-auto max-h-56">
                  <code>{activeSubmission.code?.[codeTab] || '// No code submitted for this file'}</code>
                </pre>
              </div>

              {/* Feedback Form */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-950">Mentor Rating & Endorsement</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`w-4 h-4 cursor-pointer transition-colors ${
                          star <= reviewRating ? 'text-black fill-black' : 'text-zinc-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Templates */}
                <div className="space-y-1">
                  <span className="text-[11px] text-zinc-500">Quick endorsement template:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {feedbackTemplates.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFeedbackText(tmpl)}
                        className={`p-2 rounded text-left text-[11px] border transition-all truncate ${
                          feedbackText === tmpl
                            ? 'border-black bg-zinc-100 text-zinc-950 font-medium'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {tmpl}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Provide technical feedback and praise for student implementation..."
                  className="w-full bg-white border border-zinc-300 rounded-[10px] p-3 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black font-body"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setActiveSubmission(null)}>
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() =>
                    reviewMutation.mutate({
                      submissionId: activeSubmission.id,
                      status: 'APPROVED',
                      feedback: feedbackText,
                      rating: reviewRating,
                    })
                  }
                  isLoading={reviewMutation.isPending}
                  className="gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>Approve & Award +35 XP</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
