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
  ChevronRight,
  PlusCircle,
  HelpCircle,
  Copy,
  Check,
  ShieldCheck,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

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

  const filteredThreads = (threads || []).filter((t: any) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'RESOLVED') return t.status === 'RESOLVED';
    if (filterStatus === 'OPEN') return t.status !== 'RESOLVED';
    return true;
  });

  const primaryMentor = mentors?.[0] || {
    name: 'Elena Rostova',
    headline: 'Staff Frontend Engineer @ TechCorp | 8+ yrs Industry Mentor',
  };

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 font-body">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>1-on-1 Engineering Guidance</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-semibold flex items-center gap-1.5 font-body">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>Verified Mentor Support</span>
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-zinc-950 tracking-tight">
            Mentorship & Code Guidance
          </h1>
          <p className="text-zinc-600 text-sm font-body mt-1">
            Connect directly with verified senior engineers. Get code feedback, ask architectural questions, and debug your mission work.
          </p>
        </div>

        <Button
          size="default"
          onClick={() => setShowNewThreadModal(true)}
          className="gap-2 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Ask mentor a question</span>
        </Button>
      </div>

      {/* Mentor Spotlight Card */}
      <Card className="border-zinc-200 bg-white">
        <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={primaryMentor.name} size="lg" variant="mentor" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-base font-bold text-zinc-950">{primaryMentor.name}</h3>
                <Badge variant="verified" size="sm">
                  Staff Mentor
                </Badge>
              </div>
              <p className="text-xs text-zinc-600 mt-0.5 font-body">{primaryMentor.headline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
            <Clock className="w-3.5 h-3.5 text-zinc-700" />
            <span>Avg response: <strong className="text-zinc-950">Under 15 mins</strong></span>
          </div>
        </CardContent>
      </Card>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Threads List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-zinc-500 uppercase tracking-wider">
              Discussions ({filteredThreads.length})
            </span>
            <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-[8px] border border-zinc-200 font-body text-xs">
              {(['ALL', 'OPEN', 'RESOLVED'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-[6px] transition-colors ${
                    filterStatus === tab
                      ? 'bg-black text-white shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'OPEN' ? 'Active' : 'Resolved'}
                </button>
              ))}
            </div>
          </div>

          {filteredThreads.length === 0 ? (
            <Card className="p-8 text-center text-zinc-500 text-xs">
              No discussions in this filter.
            </Card>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {filteredThreads.map((t: any) => {
                const isSelected = activeThread?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedThreadId(t.id)}
                    className={`p-4 rounded-[12px] border cursor-pointer transition-all space-y-1.5 ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-100 shadow-sm'
                        : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-sm text-zinc-950 truncate">{t.subject}</h4>
                      <Badge variant={t.status === 'RESOLVED' ? 'verified' : 'streak'} size="sm">
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-600 font-body line-clamp-1">
                      {t.messages?.[t.messages.length - 1]?.content || t.messages?.[0]?.content}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {new Date(t.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Chat & Reply Area (7 cols) */}
        <div className="lg:col-span-7">
          {activeThread ? (
            <Card className="flex flex-col min-h-[500px]">
              <CardHeader className="border-b border-zinc-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 min-w-0">
                    <CardTitle className="text-base truncate">{activeThread.subject}</CardTitle>
                    <CardDescription>
                      Course mission: <strong className="text-zinc-900">{activeThread.mission?.title || 'General Code Inquiry'}</strong>
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
                    className="text-xs shrink-0"
                  >
                    {activeThread.status === 'RESOLVED' ? 'Reopen' : 'Mark resolved'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4 flex-1 overflow-y-auto max-h-[420px]">
                {activeThread.messages?.map((msg: any) => {
                  const isMentor = msg.senderRole === 'MENTOR';
                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-[12px] text-xs space-y-2 ${
                        isMentor
                          ? 'bg-zinc-100 border border-zinc-300 ml-4 sm:ml-8'
                          : 'bg-white border border-zinc-200 mr-4 sm:mr-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className={`font-semibold ${isMentor ? 'text-zinc-950' : 'text-zinc-900'}`}>
                          {msg.senderName} ({msg.senderRole})
                        </span>
                        <span className="text-zinc-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-zinc-800 leading-relaxed font-body">{msg.content}</p>
                      {msg.codeSnippet && (
                        <div className="relative group">
                          <pre className="p-3 bg-zinc-900 rounded-[8px] border border-zinc-800 font-mono text-[11px] text-zinc-100 overflow-x-auto">
                            <code>{msg.codeSnippet}</code>
                          </pre>
                          <button
                            onClick={() => handleCopyCode(msg.codeSnippet, msg.id)}
                            className="absolute top-2 right-2 p-1 bg-zinc-800 rounded text-zinc-300 hover:text-white"
                            title="Copy code"
                          >
                            {copiedSnippetId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-zinc-200" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-zinc-200 bg-zinc-50/70 space-y-3">
                <textarea
                  rows={2}
                  placeholder="Type your message or follow-up question..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-[10px] p-3 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black font-body"
                />

                {showCodeInput && (
                  <textarea
                    rows={3}
                    placeholder="// Paste relevant code snippet here..."
                    value={replyCode}
                    onChange={(e) => setReplyCode(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-[10px] p-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                  />
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setShowCodeInput(!showCodeInput)}
                    className="text-xs text-zinc-600 hover:text-zinc-950 font-medium"
                  >
                    {showCodeInput ? '− Remove code block' : '+ Attach code snippet'}
                  </button>

                  <Button
                    type="submit"
                    size="sm"
                    disabled={!replyText.trim() || addMessageMutation.isPending}
                    isLoading={addMessageMutation.isPending}
                    className="gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send message</span>
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center p-12 text-zinc-500 text-xs font-body">
              Select an inquiry or click "Ask mentor a question" to start
            </Card>
          )}
        </div>
      </div>

      {/* New Question Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 space-y-4 shadow-2xl animate-slide-up border-zinc-300">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Ask a Senior Mentor</CardTitle>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CardDescription>
              Submit a technical question to verified engineering mentors for feedback, code debugging, or architecture advice.
            </CardDescription>

            <form onSubmit={handleCreateQuestion} className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Question subject</label>
                <Input
                  type="text"
                  placeholder="e.g. CSS Grid auto-fit column overlapping on mobile"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Detailed explanation</label>
                <textarea
                  rows={3}
                  placeholder="Describe what you tried, what you expected, and what happened..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  required
                  className="w-full bg-white border border-zinc-300 rounded-[10px] p-3 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black font-body"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Code snippet (optional)</label>
                <textarea
                  rows={3}
                  placeholder="// Paste your CSS / HTML / JS code snippet here..."
                  value={newCodeSnippet}
                  onChange={(e) => setNewCodeSnippet(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-[10px] p-3 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button variant="outline" size="sm" type="button" onClick={() => setShowNewThreadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={createThreadMutation.isPending} className="gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit question</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
