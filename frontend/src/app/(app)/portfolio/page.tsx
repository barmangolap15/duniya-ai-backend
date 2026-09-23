'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  ExternalLink,
  Code2,
  Share2,
  Edit3,
  ShieldCheck,
  CheckCircle2,
  Eye,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function PortfolioPage() {
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'css' | 'js'>('preview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    headline: user?.headline || 'Aspiring Frontend Web Developer',
    bio: user?.bio || 'Learning by building real-world projects on DuniyaAI.',
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
  });

  const { data: submissions, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: () => api.submissions.portfolio(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => api.users.updateProfile(data),
    onSuccess: () => {
      toast.success('Public profile updated!');
      setIsEditingProfile(false);
      refreshUser();
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const copyPublicLink = () => {
    if (user?.id && typeof window !== 'undefined') {
      const url = `${window.location.origin}/portfolio/${user.id}`;
      navigator.clipboard.writeText(url);
      toast.success('Public portfolio link copied to clipboard!');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-8">
      {/* Portfolio Header & Share Banner */}
      <Card className="border-zinc-200 bg-white">
        <CardContent className="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="verified">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Proof-of-Work Portfolio</span>
              </Badge>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
              Your Public Project Portfolio
            </h1>
            <p className="text-zinc-600 text-xs sm:text-sm max-w-xl font-body leading-relaxed">
              Every mission you complete in the sandbox produces verified proof-of-work that recruiters, mentors, and parents can inspect live.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {user?.id && (
              <>
                <Link href={`/portfolio/${user.id}`} target="_blank">
                  <Button size="sm" className="gap-2 text-xs">
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Public view</span>
                  </Button>
                </Link>

                <Button variant="outline" size="sm" onClick={copyPublicLink} className="gap-1.5 text-xs">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy link</span>
                </Button>
              </>
            )}

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="gap-1.5 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Bio Editor Drawer */}
      {isEditingProfile && (
        <Card className="animate-slide-up border-zinc-200 bg-white">
          <CardHeader className="pb-3 border-b border-zinc-200">
            <CardTitle className="text-base">Edit Public Profile Details</CardTitle>
            <CardDescription>Update your public headline, bio, and social links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">Professional headline</label>
                <Input
                  type="text"
                  value={profileForm.headline}
                  onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-700">GitHub Profile URL</label>
                <Input
                  type="text"
                  value={profileForm.githubUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-zinc-700">Short biography</label>
                <textarea
                  rows={3}
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  className="w-full bg-white border border-zinc-300 rounded-[10px] p-3 text-xs text-zinc-950 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-black font-body"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => updateProfileMutation.mutate(profileForm)}
                isLoading={updateProfileMutation.isPending}
              >
                Save profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      {submissions?.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center space-y-3">
          <Code2 className="w-12 h-12 text-zinc-400 mb-1" />
          <CardTitle className="text-lg">Your portfolio is awaiting its first project</CardTitle>
          <CardDescription className="max-w-md">
            Complete daily missions in the Mission Workspace to automatically publish verified projects to your portfolio.
          </CardDescription>
          <Link href="/dashboard" className="pt-2">
            <Button size="sm">Start a mission</Button>
          </Link>
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
                setActiveTab('preview');
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
                    Inspect project
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
                    Verified Pass
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-[6px] font-semibold uppercase transition-colors ${
                        activeTab === tab ? 'bg-black text-white' : 'text-zinc-600 hover:text-zinc-950'
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
              {activeTab === 'preview' ? (
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
                    {activeTab === 'html'
                      ? selectedSub.htmlCode
                      : activeTab === 'css'
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
