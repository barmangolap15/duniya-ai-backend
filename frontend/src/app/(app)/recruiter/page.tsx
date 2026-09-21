'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Flame,
  Trophy,
  Award,
  Sparkles,
  Send,
  SlidersHorizontal,
  Building,
  CheckCircle2,
  Mail,
  UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function RecruiterPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'DISCOVERY' | 'SAVED'>('DISCOVERY');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackFilter, setTrackFilter] = useState('ALL');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [outreachForm, setOutreachForm] = useState({
    roleTitle: 'Junior Frontend Developer (Apprentice)',
    company: 'NextGen Tech Partners',
    note: "Hi! We reviewed your verified submissions on LevelUp and were very impressed with your code quality. We'd love to chat regarding an open engineering role.",
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
      toast.success(res.message || 'Interview outreach dispatched successfully!');
      setSelectedCandidate(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to dispatch invitation');
    },
  });

  if (loadingCandidates) return <LoadingSpinner />;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Recruiter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-blue-400" />
              Verified Talent Directory
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Recruiter Candidate Search</h1>
          <p className="text-gray-400 text-sm mt-1">
            Discover and hire apprentice & junior developers with real runnable sandbox projects, not just certificates.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-900 border border-gray-800 rounded-xl p-1 text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('DISCOVERY')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'DISCOVERY' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            Discover Talent
          </button>
          <button
            onClick={() => setActiveTab('SAVED')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'SAVED' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            Shortlist ({savedCandidates?.length || 0})
          </button>
        </div>
      </div>

      {activeTab === 'DISCOVERY' && (
        <div className="space-y-8">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search candidates by name, headline, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={trackFilter}
                onChange={(e) => setTrackFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500"
              >
                <option value="ALL">All Tracks</option>
                <option value="Frontend Web Development">Frontend Web Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Full-Stack Development">Full-Stack Development</option>
              </select>
            </div>
          </div>

          {/* Candidate Grid */}
          {(!candidates || candidates.length === 0) ? (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center text-gray-400 space-y-2">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">No candidates match your criteria</h3>
              <p className="text-xs text-gray-500">Try clearing the search query or changing track filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((c: any) => (
                <div
                  key={c.id}
                  className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-primary-500/40 hover:shadow-2xl transition-all"
                >
                  <div className="space-y-4">
                    {/* Header: Avatar, Name, Bookmark */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={
                            c.avatarUrl ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                          }
                          alt={c.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-primary-500/40"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{c.name}</h3>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-500/20 text-primary-300">
                              LVL {c.level}
                            </span>
                          </div>
                          <p className="text-xs text-primary-400 font-medium line-clamp-1">{c.headline}</p>
                          <span className="text-[11px] text-gray-500">{c.trackName}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => bookmarkMutation.mutate(c.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          c.isBookmarked
                            ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
                            : 'bg-gray-950 border-gray-800 text-gray-500 hover:text-white'
                        }`}
                        title="Bookmark candidate"
                      >
                        <Bookmark className={`w-4 h-4 ${c.isBookmarked ? 'fill-blue-400' : ''}`} />
                      </button>
                    </div>

                    {/* Bio */}
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{c.bio}</p>

                    {/* Skills pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {c.skills?.map((s: string) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-gray-950 border border-gray-800 text-gray-300 font-semibold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Verified Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800 text-center">
                      <div className="bg-gray-950/60 rounded-xl p-2 border border-gray-800/80">
                        <div className="text-[10px] text-gray-500">Total XP</div>
                        <div className="text-xs font-bold text-amber-400">{c.xp}</div>
                      </div>
                      <div className="bg-gray-950/60 rounded-xl p-2 border border-gray-800/80">
                        <div className="text-[10px] text-gray-500">Streak</div>
                        <div className="text-xs font-bold text-orange-400">{c.streak}d</div>
                      </div>
                      <div className="bg-gray-950/60 rounded-xl p-2 border border-gray-800/80">
                        <div className="text-[10px] text-gray-500">Verified</div>
                        <div className="text-xs font-bold text-emerald-400">{c.verifiedProjectsCount}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      href={`/portfolio/${c.id}`}
                      target="_blank"
                      className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-gray-700"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-primary-400" />
                      View Portfolio
                    </Link>

                    <button
                      onClick={() => setSelectedCandidate(c)}
                      className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary-600/20"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Connect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Shortlist Tab */}
      {activeTab === 'SAVED' && (
        <div className="space-y-6">
          {(!savedCandidates || savedCandidates.length === 0) ? (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center text-gray-400 space-y-2">
              <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-white">Your shortlist is currently empty</h3>
              <p className="text-xs text-gray-500">
                Click the bookmark icon on any candidate card to save them to your active recruiting pipeline.
              </p>
            </div>
          ) : (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden divide-y divide-gray-800">
              {savedCandidates.map((s: any) => (
                <div key={s.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-850 transition-colors">
                  <div className="flex items-center gap-4">
                    <img
                      src={s.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={s.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-gray-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-white">{s.name}</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-primary-500/20 text-primary-300 font-bold">
                          LVL {s.level}
                        </span>
                      </div>
                      <div className="text-xs text-primary-400">{s.headline}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {s.trackName} • {s.verifiedProjectsCount} verified projects • {s.xp} XP
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <Link
                      href={`/portfolio/${s.id}`}
                      target="_blank"
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Portfolio
                    </Link>

                    <button
                      onClick={() => setSelectedCandidate(s)}
                      className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Outreach Invitation Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Send Interview Invitation</h3>
                <p className="text-xs text-gray-400">To: {selectedCandidate.name} ({selectedCandidate.email})</p>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-gray-400 hover:text-white text-xs px-2 py-1 bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-300 font-semibold block mb-1">Position / Role Title</label>
                <input
                  type="text"
                  value={outreachForm.roleTitle}
                  onChange={(e) => setOutreachForm({ ...outreachForm, roleTitle: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Company / Team</label>
                <input
                  type="text"
                  value={outreachForm.company}
                  onChange={(e) => setOutreachForm({ ...outreachForm, company: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="text-gray-300 font-semibold block mb-1">Message Note</label>
                <textarea
                  rows={4}
                  value={outreachForm.note}
                  onChange={(e) => setOutreachForm({ ...outreachForm, note: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={() =>
                outreachMutation.mutate({
                  studentId: selectedCandidate.id,
                  data: outreachForm,
                })
              }
              disabled={outreachMutation.isPending}
              className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {outreachMutation.isPending ? 'Sending...' : 'Dispatch Interview Invitation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
