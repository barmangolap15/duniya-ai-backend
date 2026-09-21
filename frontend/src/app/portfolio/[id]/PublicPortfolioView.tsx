'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import Logo from '@/components/Logo';
import {
  ShieldCheck,
  Flame,
  Trophy,
  Award,
  ExternalLink,
  Github,
  Linkedin,
  Share2,
  Code,
  Eye,
  CheckCircle2,
  Star,
  Sparkles,
  ArrowLeft,
  Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function PublicPortfolioPage() {
  const params = useParams();

  const [actualUserId, setActualUserId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('portfolio');
      if (idx !== -1 && parts[idx + 1] && parts[idx + 1] !== 'preview') {
        return parts[idx + 1];
      }
    }
    return (params?.id as string) || '';
  });

  const userId = actualUserId || (params?.id as string);
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-portfolio', userId],
    queryFn: () => api.users.getPublic(userId),
  });

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Public portfolio link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-16 h-16 text-gray-700 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Portfolio Not Found</h1>
        <p className="text-gray-400 mb-6">The requested candidate portfolio could not be located.</p>
        <Link
          href="/"
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-medium transition-colors"
        >
          Back to DuniyaAI
        </Link>
      </div>
    );
  }

  const submissions = profile.submissions || [];

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-primary-500/30">
      {/* Top Banner */}
      <div className="border-b border-gray-800 bg-gray-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 group">
            <Logo size="sm" href="/" />
            <span className="text-xs text-gray-500 hidden sm:inline group-hover:text-gray-400">
              • Verified Talent Network
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Authenticated Code
            </div>

            <button
              onClick={copyShareLink}
              className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border border-gray-700"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Candidate Profile Header Card */}
        <section className="relative rounded-3xl bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-950 border border-gray-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-600/10 rounded-full blur-3xl -z-10" />

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    profile.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
                  }
                  alt={profile.name}
                  className="w-24 h-24 sm:w-28 sm:sum-28 rounded-2xl object-cover border-2 border-primary-500/40 shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-primary-600 text-white rounded-md text-[11px] font-bold shadow-md">
                  LVL {profile.level}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{profile.name}</h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-500/20 text-primary-300 border border-primary-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary-400" />
                    Verified Developer
                  </span>
                </div>

                <p className="text-primary-300 font-medium text-sm sm:text-base">
                  {profile.headline || 'Frontend Developer | DuniyaAI Certified'}
                </p>

                <p className="text-gray-400 text-sm max-w-2xl leading-relaxed">
                  {profile.bio || 'Building hands-on software missions and verified web applications.'}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-4 pt-1">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-xs"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Metrics pills */}
            <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
              <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 sm:p-4 text-center min-w-[90px]">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" /> XP
                </div>
                <div className="text-lg sm:text-xl font-bold text-amber-400">{profile.xp}</div>
              </div>

              <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 sm:p-4 text-center min-w-[90px]">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Streak
                </div>
                <div className="text-lg sm:text-xl font-bold text-orange-400">{profile.streak} Days</div>
              </div>

              <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3 sm:p-4 text-center min-w-[90px]">
                <div className="text-xs text-gray-500 flex items-center justify-center gap-1 mb-1">
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> Proofs
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-400">{submissions.length}</div>
              </div>
            </div>
          </div>

          {/* Track & Skills Bar */}
          <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Track:</span>
              <span className="px-3 py-1 bg-primary-950 border border-primary-800 text-primary-300 rounded-full text-xs font-semibold">
                {profile.roadmap?.careerTrack?.name || 'Frontend Web Development'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Verified Tech:</span>
              {(profile.skills?.length > 0 ? profile.skills : [{ name: 'HTML' }, { name: 'CSS' }, { name: 'JAVASCRIPT' }]).map(
                (skill: any) => (
                  <span
                    key={skill.name}
                    className="px-2.5 py-0.5 rounded text-xs font-mono bg-gray-800 border border-gray-700 text-gray-300"
                  >
                    {skill.name}
                  </span>
                ),
              )}
            </div>
          </div>
        </section>

        {/* Verified Proof-of-Work Projects */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-400" />
                Verified Mission Projects
              </h2>
              <p className="text-gray-400 text-sm">
                Each project represents real code written and verified within the browser sandbox.
              </p>
            </div>
            <span className="text-xs text-gray-500">{submissions.length} completed projects</span>
          </div>

          {submissions.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center text-gray-400">
              No completed public projects yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub: any) => {
                const latestReview = sub.reviews?.[0];
                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      setSelectedSub(sub);
                      setActiveCodeTab('preview');
                    }}
                    className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-primary-500/50 hover:shadow-2xl hover:shadow-primary-500/10 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    {/* Live Preview Miniature */}
                    <div className="h-44 bg-white relative overflow-hidden border-b border-gray-800">
                      <iframe
                        srcDoc={`
                          <!DOCTYPE html>
                          <html>
                            <head><style>body { margin: 0; padding: 12px; font-family: sans-serif; } ${sub.cssCode}</style></head>
                            <body>${sub.htmlCode}<script>${sub.jsCode}<\/script></body>
                          </html>
                        `}
                        className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none border-0"
                        tabIndex={-1}
                      />
                      <div className="absolute inset-0 bg-gray-950/20 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="px-3 py-1.5 bg-gray-950/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                          <Eye className="w-3.5 h-3.5 text-primary-400" />
                          Inspect Code & Live Demo
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-primary-400 mb-1">
                          {sub.mission?.course?.name || 'Course Mission'}
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                          {sub.mission?.title}
                        </h3>
                        <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                          {sub.mission?.description}
                        </p>
                      </div>

                      {/* Mentor Commendation Snippet */}
                      {latestReview && (
                        <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-xs">
                          <div className="flex items-center gap-1 text-emerald-400 font-semibold mb-1">
                            <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                            <span>Reviewed by Mentor {latestReview.mentor?.name}</span>
                          </div>
                          <p className="text-emerald-200/80 italic text-[11px] line-clamp-2">
                            "{latestReview.feedback}"
                          </p>
                        </div>
                      )}

                      {/* Card Footer */}
                      <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          {(sub.mission?.languages || ['html']).map((lang: string) => (
                            <span key={lang} className="px-1.5 py-0.5 bg-gray-800 rounded font-mono text-[10px] uppercase text-gray-400">
                              {lang}
                            </span>
                          ))}
                        </div>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          +{sub.xpEarned} XP
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Recruiter / Collaboration CTA */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-primary-950/60 to-accent-950/60 border border-primary-800/40 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-white">Interested in hiring or interviewing {profile.name}?</h3>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            This developer's submissions have been validated on the DuniyaAI platform. Recruiters can connect directly or send official job invitations.
          </p>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Link
              href="/recruiter"
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-primary-500/20"
            >
              Open in Recruiter Portal
            </Link>
            <button
              onClick={copyShareLink}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 rounded-xl font-semibold text-sm transition-colors"
            >
              Share Profile
            </button>
          </div>
        </section>
      </main>

      {/* Interactive Code & Live App Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-white">{selectedSub.mission?.title}</h2>
                  <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Verified Code
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Course: {selectedSub.mission?.course?.name} • Submitted by {profile.name}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Tabs */}
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800 text-xs">
                  <button
                    onClick={() => setActiveCodeTab('preview')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeCodeTab === 'preview' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Live Preview
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('html')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeCodeTab === 'html' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('css')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeCodeTab === 'css' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    CSS
                  </button>
                  <button
                    onClick={() => setActiveCodeTab('js')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeCodeTab === 'js' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    JS
                  </button>
                </div>

                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-3 py-1.5 text-gray-400 hover:text-white text-xs bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-hidden relative">
              {activeCodeTab === 'preview' ? (
                <div className="w-full h-full bg-white relative">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <style>
                            body { margin: 0; padding: 24px; font-family: system-ui, -apple-system, sans-serif; }
                            ${selectedSub.cssCode}
                          </style>
                        </head>
                        <body>
                          ${selectedSub.htmlCode}
                          <script>${selectedSub.jsCode}<\/script>
                        </body>
                      </html>
                    `}
                    title="Live Code Preview"
                    sandbox="allow-scripts"
                    className="w-full h-full border-0"
                  />
                </div>
              ) : (
                <div className="w-full h-full bg-[#1e293b] p-4 overflow-auto font-mono text-xs sm:text-sm text-gray-200">
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {activeCodeTab === 'html' && (selectedSub.htmlCode || '<!-- No HTML code provided -->')}
                    {activeCodeTab === 'css' && (selectedSub.cssCode || '/* No CSS code provided */')}
                    {activeCodeTab === 'js' && (selectedSub.jsCode || '// No JavaScript code provided')}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer: Mentor Review If Present */}
            {selectedSub.reviews?.length > 0 && (
              <div className="p-4 bg-gray-950 border-t border-gray-800 shrink-0 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-gray-300 font-semibold">
                    Mentor Feedback ({selectedSub.reviews[0].mentor?.name}):
                  </span>
                  <span className="text-gray-400 italic">"{selectedSub.reviews[0].feedback}"</span>
                </div>
                <span className="text-emerald-400 font-semibold uppercase text-[10px]">Verified Pass</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
