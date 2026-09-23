'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useAuth, getRoleHomeRoute } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  ShieldCheck,
  Trophy,
  Heart,
  Eye,
  Search,
  Terminal,
  Layers,
  ChevronRight,
  Flame,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const homeRoute = getRoleHomeRoute(user?.role);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-zinc-900 selection:text-white">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-body font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
              <span>Where builders get verified</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-zinc-950 leading-[1.1]">
              Learn it. Build it.{' '}
              <span className="text-zinc-500">Prove it.</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed font-body">
              Stop watching passive video tutorials. Build real applications with interactive sandbox missions,
              automated test validation, and verified industry mentor reviews.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
              {user ? (
                <Link href={homeRoute}>
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-semibold">
                    Open {user.role.toLowerCase()} workbench <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto gap-2 text-sm font-semibold">
                      Start learning free <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm">
                      Sign in to account
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Social Proof / Metrics */}
            <div className="pt-8 flex items-center justify-center gap-8 sm:gap-14 text-center">
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-zinc-950 tabular-nums">100%</p>
                <p className="text-xs text-zinc-500 mt-0.5">Hands-on code</p>
              </div>
              <div className="w-px h-8 bg-zinc-200" />
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-zinc-950 tabular-nums">4 Portals</p>
                <p className="text-xs text-zinc-500 mt-0.5">Role-dedicated</p>
              </div>
              <div className="w-px h-8 bg-zinc-200" />
              <div>
                <p className="font-mono text-2xl sm:text-3xl font-bold text-zinc-950 tabular-nums">Verified</p>
                <p className="text-xs text-zinc-500 mt-0.5">Proof of work</p>
              </div>
            </div>
          </div>

          {/* Interactive Workspace Preview Mockup */}
          <div className="mt-14 max-w-5xl mx-auto rounded-[14px] border border-zinc-200 bg-white shadow-xl overflow-hidden">
            {/* Window bar */}
            <div className="h-10 bg-zinc-50 px-4 border-b border-zinc-200 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="ml-2 text-zinc-700 font-medium">mission-01 · responsive-card.html</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-zinc-950 bg-zinc-100 border border-zinc-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                  <Check className="w-3 h-3 text-zinc-950" /> Step 3 Validated (+35 XP)
                </span>
              </div>
            </div>

            {/* Split layout preview */}
            <div className="grid md:grid-cols-12 min-h-[300px]">
              {/* Left Code Editor Preview */}
              <div className="md:col-span-7 p-4 bg-zinc-50 border-b md:border-b-0 md:border-r border-zinc-200 font-mono text-xs text-zinc-800 space-y-1 overflow-x-auto">
                <div className="text-zinc-400">// Step 3: Configure CSS Grid container</div>
                <div><span className="text-zinc-950 font-bold">.card-grid</span> &#123;</div>
                <div className="pl-4"><span className="text-zinc-500">display</span>: <span className="text-zinc-900 font-medium">grid</span>;</div>
                <div className="pl-4"><span className="text-zinc-500">grid-template-columns</span>: <span className="text-zinc-900 font-medium">repeat(auto-fit, minmax(280px, 1fr))</span>;</div>
                <div className="pl-4"><span className="text-zinc-500">gap</span>: <span className="text-zinc-900 font-medium">1.5rem</span>;</div>
                <div className="pl-4"><span className="text-zinc-500">align-items</span>: <span className="text-zinc-900 font-medium">stretch</span>;</div>
                <div>&#125;</div>
                <div className="pt-2 text-zinc-400">// Live AST validator running in background</div>
                <div className="text-zinc-950 flex items-center gap-1 pt-1 font-semibold">
                  <Check className="w-3.5 h-3.5 text-zinc-950" />
                  <span>DOM check passed: .card-grid contains active display property</span>
                </div>
              </div>

              {/* Right Sandbox Live Output */}
              <div className="md:col-span-5 p-5 bg-white flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-800">Live Preview</span>
                    <span className="text-[10px] font-mono text-zinc-400">100% responsive</span>
                  </div>
                  <div className="rounded-[10px] border border-zinc-200 bg-zinc-50 p-3.5 space-y-2">
                    <div className="w-full h-20 rounded bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-zinc-900" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-950">Full-Stack SaaS Platform</p>
                    <p className="text-[11px] text-zinc-500 leading-snug">
                      Built with Next.js App Router, Tailwind CSS, and verified by industry mentors.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-mono">Streak: 7 days</span>
                  <span className="text-zinc-950 font-mono font-bold">+50 XP Ready</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 4 Dedicated Workbenches */}
        <section className="py-24 border-y border-zinc-200 bg-zinc-50/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Dedicated Ecosystem
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-zinc-950">
                Purpose-built spaces for every role
              </h2>
              <p className="text-zinc-600 text-sm font-body">
                Each stakeholder gets an independent workbench tailored to their exact workflow.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Student */}
              <Card interactive className="flex flex-col justify-between hover:border-zinc-400 bg-white">
                <CardHeader>
                  <div className="w-10 h-10 rounded-[10px] bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <CardTitle>Student Space</CardTitle>
                  <CardDescription>
                    Learn by doing with bite-sized missions, step-by-step DOM testing, and AI career guidance.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-xs text-zinc-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>In-browser code editor</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Daily streaks & XP ladder</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Verified proof-of-work portfolio</span>
                    </li>
                  </ul>
                  <Link href="/signup" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      Join as student <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Mentor */}
              <Card interactive className="flex flex-col justify-between hover:border-zinc-400 bg-white">
                <CardHeader>
                  <div className="w-10 h-10 rounded-[10px] bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
                    <Eye className="w-5 h-5" />
                  </div>
                  <CardTitle>Mentor Workbench</CardTitle>
                  <CardDescription>
                    Code review queue with split preview, student Q&A inbox, and endorsement awards.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-xs text-zinc-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Review student submissions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Answer student questions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Award +35 XP endorsements</span>
                    </li>
                  </ul>
                  <Link href="/signup" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      Join as mentor <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Parent */}
              <Card interactive className="flex flex-col justify-between hover:border-zinc-400 bg-white">
                <CardHeader>
                  <div className="w-10 h-10 rounded-[10px] bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
                    <Heart className="w-5 h-5" />
                  </div>
                  <CardTitle>Family Oversight</CardTitle>
                  <CardDescription>
                    Clear academic reports, study hours velocity, and encouragement cheer boosts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-xs text-zinc-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Weekly velocity & test scores</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Printable progress report cards</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Send +15 XP cheer boosts</span>
                    </li>
                  </ul>
                  <Link href="/signup" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      Join as parent <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recruiter */}
              <Card interactive className="flex flex-col justify-between hover:border-zinc-400 bg-white">
                <CardHeader>
                  <div className="w-10 h-10 rounded-[10px] bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-900 mb-2">
                    <Search className="w-5 h-5" />
                  </div>
                  <CardTitle>Recruiter Scout</CardTitle>
                  <CardDescription>
                    Browse verified proof-of-work talent pipeline with runnable demos and mentor stamps.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="text-xs text-zinc-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Search candidate portfolios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Inspect runnable source code</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 shrink-0" />
                      <span>Filter by technology stack</span>
                    </li>
                  </ul>
                  <Link href="/signup" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full text-xs gap-1">
                      Join as recruiter <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Verification & Proof-of-Work Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="rounded-[14px] border border-zinc-900 bg-zinc-950 text-white p-8 sm:p-12 shadow-xl">
            <div className="max-w-3xl space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                Industry-Grade Standard
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white leading-tight">
                No certificate mills. Real working code verified by senior engineers.
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed font-body">
                Every project in a student’s DuniyaAI portfolio runs in the browser, passes automated tests,
                and has code endorsement from verified mentors. Recruiters inspect actual implementation quality,
                not buzzwords.
              </p>
              <div className="pt-4 flex flex-wrap gap-3">
                <Link href="/signup">
                  <Button size="default" variant="secondary" className="gap-2 bg-white text-zinc-950 hover:bg-zinc-100">
                    Build your verified portfolio <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <span className="font-heading font-semibold text-zinc-950">DuniyaAI</span>
            <span>·</span>
            <span>Learn it. Build it. Prove it.</span>
          </div>
          <p>&copy; {new Date().getFullYear()} DuniyaAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
