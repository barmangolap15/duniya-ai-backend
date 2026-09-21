'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth, getRoleHomeRoute } from '@/lib/auth-context';
import {
  Trophy,
  ArrowRight,
  Heart,
  Sparkles,
  Briefcase,
  ShieldCheck,
  Code2,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const homeRoute = getRoleHomeRoute(user?.role);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-600/20 rounded-full blur-[130px] -z-10" />
          <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-accent-600/20 rounded-full blur-[110px] -z-10" />

          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-primary-400" />
              The Learn-by-Doing Developer Platform
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              <span>Level Up Your </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 animate-gradient-x">
                Tech Career
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Stop watching passive video tutorials. Build real applications in a live browser sandbox. Produce 100% verified proof-of-work reviewed by senior industry mentors and tracked by parents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {user ? (
                <Link
                  href={homeRoute}
                  className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl text-white font-bold text-base transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 hover:scale-105"
                >
                  Enter Your Workspace ({user.role}) <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl text-white font-bold text-base transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] hover:shadow-[0_0_35px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 hover:scale-105"
                  >
                    Start Learning Free <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-2xl text-gray-200 hover:text-white font-bold text-base transition-all flex items-center justify-center gap-2"
                  >
                    Sign In to Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* The 3 Dedicated Stakeholder Spaces */}
        <section className="py-24 bg-gray-900/40 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-primary-400 font-bold">
                Tailored Spaces
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Independent Workbenches For Every Role
              </h2>
              <p className="text-gray-400 text-sm">
                Each stakeholder receives a dedicated interface with role-based permissions and targeted tools.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              {/* Student */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-primary-500/50 transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center text-primary-400">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Student Space</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Interactive bite-sized coding missions with live DOM auto-validation, an "Ask Mentor" slide-over drawer, and public portfolio showcase.
                  </p>
                  <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Daily build streak & XP progression</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct 1-on-1 mentor guidance</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Family encouragement boosts</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-2.5 px-4 bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  Join as Student <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Mentors */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-accent-500/50 transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/30 flex items-center justify-center text-accent-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Mentor Workbench</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Comprehensive code review hub, live sandboxed preview inspection, student Q&A inbox, and active mentee directory.
                  </p>
                  <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Split-screen live code evaluator</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Answer student questions with code snippets</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> +35 XP endorsement awards</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-2.5 px-4 bg-accent-600/20 hover:bg-accent-600/30 text-accent-300 border border-accent-500/30 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  Join as Mentor <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Parents */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col justify-between space-y-6 hover:border-rose-500/50 transition-all">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Parent Oversight</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    100% transparent access to child study velocity, milestone progress, mentor conversation transcripts, and motivation cheers.
                  </p>
                  <ul className="text-xs text-gray-300 space-y-1.5 pt-2">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full mentor communication transcripts</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Safe educational environment guarantee</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Send +15 XP encouragement boosts</li>
                  </ul>
                </div>
                <Link
                  href="/signup"
                  className="w-full py-2.5 px-4 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5"
                >
                  Join as Parent <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Ready to begin your journey?</h2>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Create your account or log in to access your role-specific workbench.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Get Started Now
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-gray-900 hover:bg-gray-800 border border-gray-700 text-gray-300 rounded-xl text-xs font-semibold transition-all"
            >
              Log In
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-800 py-8 text-center text-gray-500 text-xs">
        <p>&copy; {new Date().getFullYear()} LevelUp. All rights reserved.</p>
      </footer>
    </div>
  );
}
