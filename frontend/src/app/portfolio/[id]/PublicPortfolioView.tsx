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
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldCheck className="w-14 h-14 text-zinc-400 mb-4" />
        <h1 className="font-heading text-2xl font-bold text-zinc-950 mb-2">Portfolio Not Found</h1>
        <p className="text-zinc-600 text-sm mb-6">The requested candidate portfolio could not be located.</p>
        <Link href="/">
          <Button size="default">Back to DuniyaAI</Button>
        </Link>
      </div>
    );
  }

  const submissions = profile.submissions || [];

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Top Banner */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" href="/" />
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
              · Verified Talent Network
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Badge variant="verified">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>100% Verified Code</span>
            </Badge>

            <Button variant="outline" size="sm" onClick={copyShareLink} className="gap-1 text-xs">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Candidate Profile Card */}
        <Card className="border-zinc-200 bg-white">
          <CardContent className="p-6 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <Avatar name={profile.name} size="xl" variant="student" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="font-heading text-3xl font-bold text-zinc-950 tracking-tight">{profile.name}</h1>
                  <Badge variant="streak">Level {profile.level}</Badge>
                </div>
                <p className="text-sm font-semibold text-zinc-700">{profile.headline}</p>
                <p className="text-xs text-zinc-500 font-mono">{profile.trackName || 'Frontend Web Development'}</p>
                <p className="text-xs text-zinc-600 max-w-xl font-body leading-relaxed pt-1">
                  {profile.bio || 'Developer building real-world verified projects on DuniyaAI.'}
                </p>

                {/* Social links */}
                <div className="flex items-center gap-3 pt-2">
                  {profile.githubUrl && (
                    <a
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-zinc-950 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-zinc-950 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Candidate Quick Stats */}
            <div className="grid grid-cols-3 gap-3 bg-zinc-50 p-4 rounded-[12px] border border-zinc-200 font-mono text-center self-stretch md:self-auto">
              <div>
                <p className="text-[11px] text-zinc-500">Streak</p>
                <p className="text-base font-bold text-zinc-950">{profile.streak || 0}d</p>
              </div>
              <div className="w-px h-8 bg-zinc-200 mx-auto" />
              <div>
                <p className="text-[11px] text-zinc-500">Total XP</p>
                <p className="text-base font-bold text-zinc-950">{profile.xp || 0}</p>
              </div>
              <div className="w-px h-8 bg-zinc-200 mx-auto" />
              <div>
                <p className="text-[11px] text-zinc-500">Projects</p>
                <p className="text-base font-bold text-zinc-950">{submissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl font-bold text-zinc-950">Verified Project Portfolio</h2>
            <span className="text-xs text-zinc-500 font-mono">{submissions.length} completed projects</span>
          </div>

          {submissions.length === 0 ? (
            <Card className="p-12 text-center text-zinc-500 text-xs font-body">
              This developer has not yet published any verified missions to their public showcase.
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {submissions.map((sub: any) => (
                <Card
                  key={sub.id}
                  interactive
                  className="overflow-hidden group flex flex-col justify-between hover:border-zinc-400"
                  onClick={() => {
                    setSelectedSub(sub);
                    setActiveCodeTab('preview');
                  }}
                >
                  {/* Thumbnail */}
                  <div className="h-44 bg-white relative overflow-hidden border-b border-zinc-200">
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
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="px-3 py-1.5 bg-black text-white border border-black rounded-[8px] text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                        <Eye className="w-3.5 h-3.5 text-white" />
                        Run project
                      </span>
                    </div>
                  </div>

                  <CardContent className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-zinc-600">
                        {sub.mission?.course?.name || 'Curriculum Mission'}
                      </span>
                      <h3 className="font-heading text-base font-semibold text-zinc-950 group-hover:text-zinc-700 transition-colors line-clamp-1">
                        {sub.mission?.title}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-500">{new Date(sub.updatedAt).toLocaleDateString()}</span>
                      <span className="text-zinc-950 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
                        Verified
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal for full inspection */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up border-zinc-300">
            <CardHeader className="p-4 sm:p-5 border-b border-zinc-200 flex flex-row items-center justify-between bg-white shrink-0">
              <div>
                <CardTitle className="text-lg">{selectedSub.mission?.title}</CardTitle>
                <CardDescription>{selectedSub.mission?.course?.name}</CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-zinc-100 rounded-[8px] p-1 border border-zinc-200 text-xs font-mono">
                  {(['preview', 'html', 'css', 'js'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCodeTab(tab)}
                      className={`px-3 py-1 rounded-[6px] font-semibold uppercase transition-colors ${
                        activeCodeTab === tab ? 'bg-black text-white' : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setSelectedSub(null)}
                  className="p-1 rounded-md text-zinc-400 hover:text-zinc-950"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            <div className="flex-1 bg-zinc-900 overflow-hidden flex flex-col">
              {activeCodeTab === 'preview' ? (
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head><style>${selectedSub.cssCode}</style></head>
                      <body>${selectedSub.htmlCode}<script>${selectedSub.jsCode}<\/script></body>
                    </html>
                  `}
                  className="w-full h-full border-0 bg-white"
                  title="Project live execution"
                />
              ) : (
                <pre className="p-4 text-xs font-mono text-zinc-100 overflow-auto h-full">
                  <code>
                    {activeCodeTab === 'html'
                      ? selectedSub.htmlCode
                      : activeCodeTab === 'css'
                        ? selectedSub.cssCode
                        : selectedSub.jsCode}
                  </code>
                </pre>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
