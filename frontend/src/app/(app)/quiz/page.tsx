'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trophy,
  Compass,
  Rocket,
  Code2,
  Layers,
  Server,
  Smartphone,
  Palette,
  Briefcase,
  GraduationCap,
  Eye,
  Cpu,
  Hammer,
  Clock,
  Zap,
  Flame,
  Check,
  ChevronRight,
  Star,
  RefreshCw,
  Layout,
  BrainCircuit,
  LogOut,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Logo from '@/components/Logo';

export default function QuizPage() {
  const router = useRouter();
  const { user, refreshUser, logout } = useAuth();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [recommendationResult, setRecommendationResult] = useState<any>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions'],
    queryFn: () => api.quiz.getQuestions(),
  });

  const submitMutation = useMutation({
    mutationFn: (answersArray: any[]) => api.quiz.submit(answersArray),
    onSuccess: async (data) => {
      setRecommendationResult(data);
      await refreshUser();
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      toast.success(
        data.bonusXpAwarded
          ? `🎉 AI Path matched! +${data.bonusXpAwarded} XP bonus awarded!`
          : 'AI Path recommendation updated!',
      );
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to analyze responses');
    },
  });

  if (isLoading || !questions) return <LoadingSpinner />;

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const isSelected = !!selectedAnswers[currentQ?.id];

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const answersPayload = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
        questionId,
        optionId,
      }));
      submitMutation.mutate(answersPayload);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const getOptionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout':
        return <Rocket className="w-5 h-5 text-emerald-400" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-blue-400" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-purple-400" />;
      case 'Layout':
        return <Layers className="w-5 h-5 text-blue-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-purple-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-amber-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-blue-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-indigo-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-teal-400" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-blue-400" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-purple-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-gray-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-400" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary-400" />;
    }
  };

  const questionEmojis = ['🤔', '🧐', '💡', '🚀', '🎯'];

  // AI Analyzing Loading State
  if (submitMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary-400 animate-pulse" />
          </div>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-300 border border-primary-500/30 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Duniya AI Neural Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Analyzing Your Profile & Aptitude...</h2>
        <p className="text-sm text-gray-400 max-w-md">
          Synthesizing your interests, learning rhythm, and problem-solving style to formulate your customized curriculum, starter missions, and milestone goals.
        </p>
      </div>
    );
  }

  // Recommendation Results Screen (matching video design)
  if (recommendationResult) {
    const { recommendedTrack, secondaryTrack, bonusXpAwarded } = recommendationResult;
    const firstMission = recommendedTrack?.firstMission;
    const startingCourse = recommendedTrack?.startingCourse;

    return (
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 py-12 space-y-10 animate-in fade-in duration-500">
        {/* Top Hero Section matching video: "YOUR RESULT / You are a [Track]" */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary-900/50 border border-primary-500/30 text-primary-300 text-xs font-bold tracking-wider uppercase">
            <span>YOUR RESULT</span>
            {bonusXpAwarded > 0 && (
              <span className="bg-emerald-500 text-gray-950 px-2 py-0.2 rounded-full text-[10px] font-black">
                +{bonusXpAwarded} XP
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
            You are a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-400 to-primary-300">
              {recommendedTrack.personaTitle || recommendedTrack.name}
            </span>
          </h1>

          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {recommendedTrack.personaDescription ||
              `Based on your answers, you have a keen eye for design and enjoy building interactive user experiences.`}
          </p>

          {/* Direct CTA button to Dashboard as in video */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transition-all hover:scale-105 active:scale-98 text-sm flex items-center gap-2"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {firstMission && (
              <Link
                href={`/mission/${firstMission.id}`}
                className="px-6 py-3.5 bg-accent-600/20 hover:bg-accent-600/30 text-accent-300 border border-accent-500/40 font-bold rounded-xl transition-all hover:scale-105 text-sm flex items-center gap-2"
              >
                <Rocket className="w-4 h-4 text-accent-400" />
                <span>Start First Mission ({firstMission.title})</span>
              </Link>
            )}
          </div>
        </div>

        {/* Detailed AI Recommended Track Spotlight */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-primary-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-primary-500/20 text-primary-300 border border-primary-500/30 text-xs font-bold flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-primary-400 text-primary-400" />
                  {recommendedTrack.matchScore}% AI Neural Match
                </span>
                <span className="text-xs text-gray-400">
                  {recommendedTrack.totalMissions} Interactive Missions
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white">
                {recommendedTrack.name}
              </h2>
            </div>

            <div className="flex items-center gap-4 bg-gray-950/80 border border-gray-800 px-4 py-2.5 rounded-2xl self-start md:self-auto">
              <div className="text-center">
                <div className="text-xs text-gray-400">Total Courses</div>
                <div className="text-lg font-bold text-white">{recommendedTrack.totalCourses}</div>
              </div>
              <div className="w-px h-8 bg-gray-800" />
              <div className="text-center">
                <div className="text-xs text-gray-400">Total XP</div>
                <div className="text-lg font-bold text-primary-400">+{recommendedTrack.totalXp} XP</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-300 leading-relaxed">
            {recommendedTrack.description}
          </p>

          {/* AI Match Reasons */}
          <div className="bg-gray-950/60 border border-gray-800/80 rounded-2xl p-4 sm:p-5 space-y-2.5">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Why AI chose this path for you:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-300">
              {recommendedTrack.matchReasons?.map((reason: string, idx: number) => (
                <div key={idx} className="flex items-start gap-2 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Starting Mission Callout */}
          {firstMission && (
            <div className="bg-primary-950/30 border border-primary-500/40 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-primary-400" />
                  <span className="text-xs font-bold text-primary-300 uppercase tracking-wider">
                    First Recommended Mission
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-300 font-bold border border-primary-500/30">
                  +{firstMission.xpReward} XP Reward
                </span>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-0.5">
                  Course: <strong className="text-gray-200">{startingCourse?.name || 'Fundamentals'}</strong>
                </div>
                <h3 className="text-lg font-bold text-white">{firstMission.title}</h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">{firstMission.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  {firstMission.languages?.map((lang: string) => (
                    <span
                      key={lang}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800"
                    >
                      {lang.toUpperCase()}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/mission/${firstMission.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30 transition-all text-xs"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Launch Code IDE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Retake and Navigation */}
        <div className="flex items-center justify-between pt-2 text-xs text-gray-400">
          <button
            onClick={() => {
              setRecommendationResult(null);
              setCurrentIndex(0);
              setSelectedAnswers({});
            }}
            className="hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake Questionnaire</span>
          </button>

          <Link href="/roadmap" className="hover:text-primary-400 transition-colors inline-flex items-center gap-1">
            <span>Explore All Subjects & Tracks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Active Questionnaire Flow with Animated Stepper
  return (
    <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 min-h-screen flex flex-col justify-between py-6">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-800/80 mb-6">
        <Logo size="sm" href="/" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            Student: <strong className="text-gray-200">{user?.name}</strong>
          </span>
          <button
            onClick={() => logout()}
            className="text-xs text-gray-500 hover:text-rose-400 flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-lg hover:bg-gray-900 border border-transparent hover:border-gray-800"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Header & Progress Indicator */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-bold">
              {currentQ.category || 'AI Assessment'}
            </span>
            <span className="text-xs text-gray-400">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <span className="text-xs font-mono text-gray-400">
            {Math.round(progress)}% Complete
          </span>
        </div>

        <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 to-accent-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Question Card with Smooth Slide Animations */}
      <div className="flex-1 flex flex-col justify-center my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            <div className="space-y-3 text-center sm:text-left">
              <span className="text-4xl sm:text-5xl block mb-2">
                {questionEmojis[currentIndex % questionEmojis.length]}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentQ.title}
              </h2>
              {currentQ.subtitle && (
                <p className="text-sm text-gray-400">{currentQ.subtitle}</p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {currentQ.options?.map((option: any) => {
                const selected = selectedAnswers[currentQ.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQ.id, option.id)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-start gap-4 ${
                      selected
                        ? 'bg-primary-950/40 border-primary-500 ring-1 ring-primary-500/50 shadow-lg shadow-primary-500/10 scale-[1.01]'
                        : 'bg-gray-900/90 border-gray-800 hover:border-gray-700 hover:bg-gray-850'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-xl border mt-0.5 shrink-0 ${
                        selected
                          ? 'bg-primary-500/20 border-primary-500/40 text-primary-300'
                          : 'bg-gray-950 border-gray-800 text-gray-400'
                      }`}
                    >
                      {getOptionIcon(option.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3
                          className={`text-sm sm:text-base font-bold ${
                            selected ? 'text-white' : 'text-gray-200'
                          }`}
                        >
                          {option.label}
                        </h3>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            selected
                              ? 'bg-primary-500 border-primary-500 text-gray-950'
                              : 'border-gray-700 bg-gray-950'
                          }`}
                        >
                          {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls Footer */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-800/80">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="px-5 py-3 rounded-xl border border-gray-800 bg-gray-900 hover:bg-gray-800 text-gray-300 font-semibold text-xs transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          disabled={!isSelected}
          className="px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 shadow-lg shadow-primary-600/20 hover:scale-[1.02] active:scale-98"
        >
          <span>{currentIndex === questions.length - 1 ? 'Analyze with AI & Recommend Path' : 'Continue'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
