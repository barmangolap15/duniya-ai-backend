'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  Search,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Send,
  CheckCircle2,
  Mail,
  X,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export default function RecruiterPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'DISCOVERY' | 'SAVED'>('DISCOVERY');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [outreachForm, setOutreachForm] = useState({
    roleTitle: 'Junior Frontend Developer (Apprentice)',
    company: 'NextGen Tech Partners',
    note: "Hi! We reviewed your verified submissions on DuniyaAI and were very impressed with your code quality. We'd love to chat regarding an open engineering role.",
  });

  // Candidates query
  const { data: candidates, isLoading: loadingCandidates } = useQuery({
    queryKey: ['recruiter-candidates', trackFilter, searchQuery],
    queryFn: () =>
      api.recruiter.getCandidates({
        track: trackFilter,
        search: searchQuery || undefined,
      }),
  });

  // Saved candidates query
  const { data: savedCandidates, isLoading: loadingSaved } = useQuery({
    queryKey: ['recruiter-saved'],
    queryFn: () => api.recruiter.getSaved(),
    enabled: activeTab === 'SAVED',
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: (studentId: string) => api.recruiter.toggleBookmark(studentId),
    onSuccess: (data) => {
      toast.success(data.bookmarked ? 'Candidate bookmarked to shortlist!' : 'Removed from shortlist');
      queryClient.invalidateQueries({ queryKey: ['recruiter-candidates'] });
      queryClient.invalidateQueries({ queryKey: ['recruiter-saved'] });
    },
    onError: () => {
      toast.error('Could not update bookmark');
    },
  });

  // Outreach mutation
  const outreachMutation = useMutation({
    mutationFn: ({ studentId, data }: { studentId: string; data: any }) =>
      api.recruiter.outreach(studentId, data),
    onSuccess: (res) => {
      toast.success(res.message || 'Interview invitation dispatched!');
      setSelectedCandidate(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to dispatch invitation');
    },
  });

  if (loadingCandidates) return <LoadingSpinner />;

  const displayList = activeTab === 'SAVED' ? savedCandidates || [] : candidates || [];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Recruiter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border-dark">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-danger-500/10 border border-danger-500/30 text-danger-400 text-xs font-semibold flex items-center gap-1.5 font-body">
              <Search className="w-3.5 h-3.5" />
              <span>Verified Talent Pipeline</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-accent-500/10 border border-accent-500/30 text-accent-400 text-xs font-semibold flex items-center gap-1.5 font-body">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Runnable Sandbox Demos</span>
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Recruiter Candidate Directory
          </h1>
          <p className="text-slate-400 text-sm font-body mt-1">
            Discover and recruit apprentice developers with real runnable sandbox projects, not buzzwords.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-dark border border-border-dark rounded-[10px] p-1 text-xs self-start md:self-auto font-body">
          <button
            onClick={() => setActiveTab('DISCOVERY')}
            className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'DISCOVERY'
                ? 'bg-danger-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Discover Talent</span>
          </button>
          <button
            onClick={() => setActiveTab('SAVED')}
            className={`px-3.5 py-1.5 rounded-[8px] font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'SAVED'
                ? 'bg-danger-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Shortlist ({savedCandidates?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Search candidates by name, headline, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="bg-surface-dark border border-border-dark rounded-[10px] px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-danger-500 font-body"
        >
          <option value="ALL">All Tracks</option>
          <option value="Frontend Web Development">Frontend Web Development</option>
          <option value="Backend Development">Backend Development</option>
          <option value="Full-Stack Development">Full-Stack Development</option>
        </select>
      </div>

      {/* Candidate Grid */}
      {displayList.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Search className="w-10 h-10 text-slate-600 mx-auto" />
          <CardTitle className="text-lg">No candidates match your criteria</CardTitle>
          <CardDescription>Try clearing the search query or changing track filters.</CardDescription>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayList.map((c: any) => (
            <Card key={c.id} interactive className="flex flex-col justify-between hover:border-danger-500/40">
              <CardContent className="p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={c.name} size="lg" variant="student" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading text-base font-semibold text-white truncate">{c.name}</h3>
                        <Badge variant="streak" size="sm">
                          L{c.level}
                        </Badge>
                      </div>
                      <p className="text-xs text-primary-400 truncate">{c.headline}</p>
                      <p className="text-[11px] text-slate-500 truncate font-mono">{c.trackName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => bookmarkMutation.mutate(c.id)}
                    className={`p-2 rounded-lg border transition-colors ${
                      c.isBookmarked
                        ? 'bg-danger-500/10 border-danger-500/40 text-danger-400'
                        : 'bg-night border-border-dark text-slate-500 hover:text-white'
                    }`}
                    title="Bookmark candidate"
                  >
                    <Bookmark className={`w-4 h-4 ${c.isBookmarked ? 'fill-danger-400' : ''}`} />
                  </button>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-400 leading-relaxed font-body line-clamp-2">
                  {c.bio || 'Active developer learning by building real projects on DuniyaAI.'}
                </p>

                {/* Skills pills */}
                <div className="flex flex-wrap gap-1">
                  {c.skills?.map((s: string) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 rounded text-[10px] font-mono bg-night border border-border-dark text-slate-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Verified Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border-dark text-center font-mono">
                  <div className="bg-night rounded-[8px] p-2 border border-border-dark">
                    <p className="text-[10px] text-slate-500">Total XP</p>
                    <p className="text-xs font-bold text-accent-400">{c.xp}</p>
                  </div>
                  <div className="bg-night rounded-[8px] p-2 border border-border-dark">
                    <p className="text-[10px] text-slate-500">Streak</p>
                    <p className="text-xs font-bold text-gold-400">{c.streak}d</p>
                  </div>
                  <div className="bg-night rounded-[8px] p-2 border border-border-dark">
                    <p className="text-[10px] text-slate-500">Verified</p>
                    <p className="text-xs font-bold text-accent-400">{c.verifiedProjectsCount || 0}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <Link href={`/portfolio/${c.id}`} target="_blank" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-1 text-xs">
                      <ExternalLink className="w-3.5 h-3.5 text-primary-400" />
                      <span>Portfolio</span>
                    </Button>
                  </Link>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedCandidate(c)}
                    className="flex-1 gap-1 text-xs font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Reach out</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Outreach Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-night/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 space-y-4 shadow-2xl border-danger-500/30 animate-slide-up">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Interview Outreach: {selectedCandidate.name}</CardTitle>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <CardDescription>
              Direct message to candidate with role offer based on their verified proof-of-work portfolio.
            </CardDescription>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Opportunity / Role title</label>
                <Input
                  type="text"
                  value={outreachForm.roleTitle}
                  onChange={(e) => setOutreachForm({ ...outreachForm, roleTitle: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Company name</label>
                <Input
                  type="text"
                  value={outreachForm.company}
                  onChange={(e) => setOutreachForm({ ...outreachForm, company: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Personal invitation note</label>
                <textarea
                  rows={3}
                  value={outreachForm.note}
                  onChange={(e) => setOutreachForm({ ...outreachForm, note: e.target.value })}
                  className="w-full bg-night border border-border-dark rounded-[10px] p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-danger-500 font-body"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedCandidate(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() =>
                  outreachMutation.mutate({
                    studentId: selectedCandidate.id,
                    data: outreachForm,
                  })
                }
                isLoading={outreachMutation.isPending}
                className="gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send invitation</span>
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
