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
  Check,
  Github,
  Linkedin,
  ShieldCheck,
  Star,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
      toast.success('Public portfolio link copied!');
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto w-full space-y-10">
      {/* Portfolio Header & Share Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-primary-950/60 via-gray-900 to-accent-950/60 border border-gray-800 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Portfolio
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your Verified Project Portfolio</h1>
          <p className="text-gray-400 text-sm max-w-xl">
            Every mission you submit in the sandbox produces verified proof-of-work that recruiters and parents can inspect live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user?.id && (
            <>
              <Link
                href={`/portfolio/${user.id}`}
                target="_blank"
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary-600/20"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Public Showcase
              </Link>

              <button
                onClick={copyPublicLink}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                Copy Link
              </button>
            </>
          )}

          <button
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Bio
          </button>
        </div>
      </div>

      {/* Profile Bio Editor Drawer */}
      {isEditingProfile && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 animate-slide-up">
          <h3 className="text-base font-bold text-white">Edit Public Profile Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-gray-400 font-semibold block mb-1">Headline</label>
              <input
                type="text"
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div>
              <label className="text-gray-400 font-semibold block mb-1">GitHub URL</label>
              <input
                type="text"
                value={profileForm.githubUrl}
                onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-gray-400 font-semibold block mb-1">Bio</label>
              <textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-white focus:outline-none focus:border-primary-500 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => updateProfileMutation.mutate(profileForm)}
              disabled={updateProfileMutation.isPending}
              className="px-5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold"
            >
              Save Profile
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {submissions?.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-12 text-center flex flex-col items-center space-y-3">
          <Code2 className="w-16 h-16 text-gray-700 mb-2" />
          <h2 className="text-xl font-bold text-white">Your portfolio is awaiting its first project</h2>
          <p className="text-gray-400 text-sm max-w-md">
            Complete daily missions in the Mission Workspace to automatically publish verified projects to your portfolio.
          </p>
          <Link
            href="/dashboard"
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-colors mt-2"
          >
            Start a Mission
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((sub: any) => (
            <div
              key={sub.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              onClick={() => {
                setSelectedSub(sub);
                setActiveTab('preview');
              }}
            >
              {/* Thumbnail */}
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
                  <span className="px-3 py-1.5 bg-gray-950/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg">
                    <Eye className="w-3.5 h-3.5 text-primary-400" />
                    Inspect Submission
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-xs font-semibold text-primary-400 mb-1">
                    {sub.mission?.course?.name || 'Course Mission'}
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-primary-300 transition-colors">
                    {sub.mission?.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(sub.updatedAt).toLocaleDateString()}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Pass
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full inspection */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-gray-950/80 backdrop-blur-md">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-slide-up">
            <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-gray-950 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedSub.mission?.title}</h2>
                <div className="text-xs text-gray-400">{selectedSub.mission?.course?.name}</div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex bg-gray-900 rounded-lg p-1 border border-gray-800 text-xs">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeTab === 'preview' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('html')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeTab === 'html' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    HTML
                  </button>
                  <button
                    onClick={() => setActiveTab('css')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeTab === 'css' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    CSS
                  </button>
                  <button
                    onClick={() => setActiveTab('js')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      activeTab === 'js' ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    JS
                  </button>
                </div>

                <button
                  onClick={() => setSelectedSub(null)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
              {activeTab === 'preview' ? (
                <iframe
                  srcDoc={`
                    <!DOCTYPE html>
                    <html>
                      <head><style>body { margin: 0; padding: 24px; font-family: system-ui, sans-serif; } ${selectedSub.cssCode}</style></head>
                      <body>${selectedSub.htmlCode}<script>${selectedSub.jsCode}<\/script></body>
                    </html>
                  `}
                  title="Code Preview"
                  sandbox="allow-scripts"
                  className="w-full h-full border-0 bg-white"
                />
              ) : (
                <div className="w-full h-full bg-[#1e293b] p-4 overflow-auto font-mono text-xs text-gray-200">
                  <pre className="whitespace-pre-wrap leading-relaxed">
                    {activeTab === 'html' && (selectedSub.htmlCode || '<!-- No HTML provided -->')}
                    {activeTab === 'css' && (selectedSub.cssCode || '/* No CSS provided */')}
                    {activeTab === 'js' && (selectedSub.jsCode || '// No JavaScript provided')}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
