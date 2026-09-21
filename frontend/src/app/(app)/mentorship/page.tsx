'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { soundManager } from '@/lib/sounds';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  MessageSquare,
  Send,
  Code2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User,
  PlusCircle,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MentorshipHubPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);

  // Reply form state
  const [replyText, setReplyText] = useState('');
  const [replyCode, setReplyCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // New thread form state
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newCodeSnippet, setNewCodeSnippet] = useState('');
  const [newMissionId, setNewMissionId] = useState('');

  // Fetch threads
  const { data: threads, isLoading: loadingThreads } = useQuery({
    queryKey: ['mentorship-threads'],
    queryFn: () => api.mentorship.getThreads(),
  });

  // Fetch available mentors
  const { data: mentors } = useQuery({
    queryKey: ['mentorship-mentors'],
    queryFn: () => api.mentorship.getMentors(),
  });

  // Fetch student missions for dropdown
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.dashboard.get(),
  });

  // Auto-select first thread if none selected
  const activeThread =
    threads?.find((t: any) => t.id === selectedThreadId) || threads?.[0] || null;

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: ({ threadId, content, codeSnippet }: { threadId: string; content: string; codeSnippet?: string }) =>
      api.mentorship.addMessage(threadId, { content, codeSnippet }),
    onSuccess: () => {
      soundManager.playTap();
      setReplyText('');
      setReplyCode('');
      setShowCodeInput(false);
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
      toast.success('Message sent to mentor!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send message');
    },
  });

  // Create thread mutation
  const createThreadMutation = useMutation({
    mutationFn: (data: any) => api.mentorship.createThread(data),
    onSuccess: (newThread) => {
      soundManager.playStepComplete();
      toast.success('Question submitted to mentor!');
      setShowNewThreadModal(false);
      setNewSubject('');
      setNewMessage('');
      setNewCodeSnippet('');
      setNewMissionId('');
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
      if (newThread?.id) {
        setSelectedThreadId(newThread.id);
      }
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to submit question');
    },
  });

  // Update thread status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ threadId, status }: { threadId: string; status: string }) =>
      api.mentorship.updateStatus(threadId, status),
    onSuccess: (res, vars) => {
      toast.success(`Thread marked as ${vars.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
    },
  });

  const handleCopyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippetId(id);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeThread) return;
    addMessageMutation.mutate({
      threadId: activeThread.id,
      content: replyText.trim(),
      codeSnippet: replyCode.trim() ? replyCode.trim() : undefined,
    });
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      toast.error('Please enter a subject and your question');
      return;
    }
    createThreadMutation.mutate({
      subject: newSubject.trim(),
      message: newMessage.trim(),
      codeSnippet: newCodeSnippet.trim() ? newCodeSnippet.trim() : undefined,
      missionId: newMissionId ? newMissionId : undefined,
    });
  };

  if (loadingThreads) return <LoadingSpinner />;

  // Filter threads
  const filteredThreads = (threads || []).filter((t: any) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'RESOLVED') return t.status === 'RESOLVED';
    if (filterStatus === 'OPEN') return t.status !== 'RESOLVED';
    return true;
  });

  const primaryMentor = mentors?.[0] || {
    name: 'Elena Rostova',
    headline: 'Staff Frontend Engineer @ TechCorp | 8+ yrs Industry Mentor',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-accent-400" />
              1-on-1 Engineering Guidance
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-primary-400" />
              Parental Safety Oversight Active
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Mentorship & Code Guidance Hub</h1>
          <p className="text-gray-400 text-sm mt-1">
            Connect directly with verified senior engineers. Get code feedback, ask architectural questions, and debug your mission work.
          </p>
        </div>

        <button
          onClick={() => setShowNewThreadModal(true)}
          className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary-600/20 flex items-center gap-2 self-start md:self-auto hover:scale-[1.02] active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          Ask Mentor a Question
        </button>
      </div>

      {/* Mentor Spotlight Card */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-900 via-gray-900 to-accent-950/40 border border-gray-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={primaryMentor.avatarUrl}
              alt={primaryMentor.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-accent-500/40"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-gray-950 rounded-full" title="Online & Available" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{primaryMentor.name}</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent-500/20 text-accent-300 border border-accent-500/30">
                Staff Mentor
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{primaryMentor.headline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-950 rounded-xl border border-gray-800">
            <Clock className="w-3.5 h-3.5 text-accent-400" />
            <span>Avg Response: <strong className="text-white">Under 15 mins</strong></span>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Threads List (5 cols) */}
        <div className="lg:col-span-5 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
          {/* Filter Bar */}
          <div className="p-3 border-b border-gray-800 bg-gray-950/60 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Discussions ({filteredThreads.length})
            </span>
            <div className="flex items-center gap-1 bg-gray-900 p-0.5 rounded-lg border border-gray-800">
              {(['ALL', 'OPEN', 'RESOLVED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                    filterStatus === tab
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'OPEN' ? 'Active' : 'Resolved'}
                </button>
              ))}
            </div>
          </div>

          {/* Thread Cards */}
          <div className="divide-y divide-gray-800 max-h-[620px] overflow-y-auto">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-gray-500 space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-gray-600" />
                <p className="text-sm font-medium">No discussions found</p>
                <p className="text-xs">Have a question? Click "Ask Mentor a Question" to begin!</p>
              </div>
            ) : (
              filteredThreads.map((thread: any) => {
                const isSelected = activeThread?.id === thread.id;
                const lastMsg = thread.messages?.[thread.messages.length - 1];
                const isWaitingOnMentor = thread.status === 'WAITING_ON_MENTOR';
                const isResolved = thread.status === 'RESOLVED';

                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThreadId(thread.id)}
                    className={`w-full p-4 text-left transition-all flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-primary-950/30 border-l-4 border-l-primary-500'
                        : 'hover:bg-gray-850 bg-gray-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-accent-400 truncate max-w-[200px]">
                        {thread.mission?.title || 'General Code Inquiry'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          isResolved
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : isWaitingOnMentor
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-primary-500/10 text-primary-300 border border-primary-500/30'
                        }`}
                      >
                        {isResolved ? 'Resolved' : isWaitingOnMentor ? 'Mentor Reviewing' : 'Mentor Replied'}
                      </span>
                    </div>

                    <h4 className="font-bold text-white text-sm line-clamp-1">{thread.subject}</h4>

                    {lastMsg && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        <strong className="text-gray-300">
                          {lastMsg.senderRole === 'MENTOR' ? 'Elena: ' : 'You: '}
                        </strong>
                        {lastMsg.content}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span>{new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="flex items-center gap-1 text-primary-400 font-medium">
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

        {/* Right Column: Active Thread Details & Interactive Chat (7 cols) */}
        <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col min-h-[620px]">
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 sm:p-5 border-b border-gray-800 bg-gray-950/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-accent-400">
                      {activeThread.mission?.title ? `Mission: ${activeThread.mission.title}` : 'General Consultation'}
                    </span>
                    {activeThread.missionId && (
                      <a
                        href={`/mission/${activeThread.missionId}/`}
                        className="text-[11px] text-primary-400 hover:text-primary-300 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Workspace
                      </a>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white">{activeThread.subject}</h2>
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
                    {activeThread.status === 'RESOLVED' ? 'Reopen Question' : 'Mark Resolved'}
                  </button>
                </div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-5 space-y-4 overflow-y-auto max-h-[480px]">
                {activeThread.messages?.map((msg: any) => {
                  const isUser = msg.senderId === user?.id;
                  const isMentor = msg.senderRole === 'MENTOR';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <img
                        src={
                          msg.sender?.avatarUrl ||
                          (isMentor
                            ? primaryMentor.avatarUrl
                            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')
                        }
                        alt={msg.sender?.name || 'User'}
                        className="w-8 h-8 rounded-xl object-cover shrink-0 border border-gray-700"
                      />

                      <div className={`space-y-1.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div className={`flex items-center gap-2 text-[11px] ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <span className="font-semibold text-gray-300">
                            {isUser ? 'You' : msg.sender?.name || 'Elena Rostova'}
                          </span>
                          {isMentor && (
                            <span className="px-1.5 py-0.2 rounded bg-accent-500/20 text-accent-300 font-mono text-[9px] border border-accent-500/30">
                              STAFF MENTOR
                            </span>
                          )}
                          <span className="text-gray-500">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Message Box */}
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isUser
                              ? 'bg-primary-600 text-white rounded-tr-none'
                              : 'bg-gray-800 text-gray-100 rounded-tl-none border border-gray-700'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>

                          {/* Code Snippet if present */}
                          {msg.codeSnippet && (
                            <div className="mt-3 relative rounded-xl bg-gray-950 border border-gray-800 p-3 overflow-hidden text-left">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono mb-2 border-b border-gray-800 pb-1">
                                <span className="flex items-center gap-1 text-accent-400 font-bold">
                                  <Code2 className="w-3 h-3" />
                                  Code Context {msg.stepNumber ? `• Step ${msg.stepNumber}` : ''}
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

              {/* Reply Form */}
              <div className="p-4 border-t border-gray-800 bg-gray-950">
                <form onSubmit={handleSendReply} className="space-y-3">
                  {showCodeInput && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center gap-1 font-mono text-accent-400">
                          <Code2 className="w-3.5 h-3.5" /> Attach Code Snippet (HTML/CSS/JS)
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowCodeInput(false);
                            setReplyCode('');
                          }}
                          className="text-gray-500 hover:text-gray-300 text-[11px]"
                        >
                          Remove snippet
                        </button>
                      </div>
                      <textarea
                        value={replyCode}
                        onChange={(e) => setReplyCode(e.target.value)}
                        placeholder="Paste code snippet here..."
                        rows={4}
                        className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-accent-500 resize-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCodeInput(!showCodeInput)}
                      className={`p-2.5 rounded-xl border transition-colors ${
                        showCodeInput
                          ? 'bg-accent-500/20 border-accent-500/40 text-accent-300'
                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                      title="Attach code snippet"
                    >
                      <Code2 className="w-4 h-4" />
                    </button>

                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply or question to mentor..."
                      className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-primary-500 placeholder:text-gray-500"
                    />

                    <button
                      type="submit"
                      disabled={!replyText.trim() || addMessageMutation.isPending}
                      className="px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500 space-y-3">
              <MessageSquare className="w-12 h-12 text-gray-700" />
              <h3 className="text-base font-bold text-white">No discussion selected</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Select an existing question from the left sidebar or start a new thread to get guidance from our staff mentors.
              </p>
              <button
                onClick={() => setShowNewThreadModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-xl transition-all"
              >
                Ask a Question
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Ask Mentor a Question */}
      {showNewThreadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary-500/10 border border-primary-500/30 rounded-xl text-primary-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Ask Mentor a Question</h3>
                  <p className="text-xs text-gray-400">Directly routed to Elena Rostova (Staff Mentor)</p>
                </div>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Related Mission (Optional)
                </label>
                <select
                  value={newMissionId}
                  onChange={(e) => setNewMissionId(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                >
                  <option value="">General Consultation / Not tied to a mission</option>
                  {dashboardData?.activeMissions?.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.title} ({m.courseName})
                    </option>
                  ))}
                  {dashboardData?.recentSubmissions?.map((s: any) => (
                    <option key={s.mission.id} value={s.mission.id}>
                      {s.mission.title} (Completed)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Subject / Summary <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How to structure CSS flexbox for responsive card grid"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  What are you stuck on or want advice about? <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your thinking, what you tried, and what error or unexpected behavior you encountered..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-primary-500 resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
                  <span>Code Snippet (Optional)</span>
                  <span className="text-gray-500 font-mono text-[10px]">HTML, CSS, or JS</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Paste your current code here so the mentor can inspect it directly..."
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none focus:border-accent-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewThreadModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createThreadMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Mentor</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
