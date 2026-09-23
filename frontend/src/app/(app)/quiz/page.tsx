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
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
          ? `Path matched! +${data.bonusXpAwarded} XP bonus awarded!`
          : 'Path recommendation ready!'
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
        return <Rocket className="w-5 h-5 text-zinc-900" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-zinc-900" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-zinc-900" />;
      case 'Layout':
        return <Layers className="w-5 h-5 text-zinc-900" />;
      case 'Server':
        return <Server className="w-5 h-5 text-zinc-900" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-zinc-900" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-zinc-900" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-zinc-900" />;
      case 'Briefcase':
        return <Briefcase className="w-5 h-5 text-zinc-900" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-zinc-900" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-zinc-900" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-zinc-900" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-zinc-900" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-zinc-900" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-zinc-900" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-zinc-900" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-zinc-900" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-zinc-900" />;
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-zinc-900" />;
      default:
        return <Sparkles className="w-5 h-5 text-zinc-900" />;
    }
  };

  const questionEmojis = ['🤔', '🧐', '💡', '🚀', '🎯'];

  // AI Analyzing Loading State
  if (submitMutation.isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-zinc-200 border-t-zinc-950 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-zinc-950 animate-pulse" />
          </div>
        </div>
        <Badge variant="default" className="mb-3">
          AI Engine Analyzing
        </Badge>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-zinc-950 mb-2">
          Formulating your personalized path...
        </h2>
        <p className="text-sm text-zinc-600 max-w-md font-body leading-relaxed">
          Synthesizing your interests, prior knowledge, and problem-solving preferences to recommend your optimal career curriculum and starting missions.
        </p>
      </div>
    );
  }

  // Recommendation Results Screen
  if (recommendationResult) {
    const { recommendedTrack, bonusXpAwarded } = recommendationResult;
    const firstMission = recommendedTrack?.firstMission;
    const startingCourse = recommendedTrack?.startingCourse;

    return (
      <div className="max-w-4xl mx-auto w-full p-4 sm:p-8 py-10 space-y-8 animate-slide-up">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2">
            <Badge variant="default" className="uppercase tracking-wider">
              YOUR RESULT
            </Badge>
            {bonusXpAwarded > 0 && (
              <span className="inline-flex items-center rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 font-mono text-xs font-semibold text-zinc-900">
                +{bonusXpAwarded} XP
              </span>
            )}
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-zinc-950 tracking-tight">
            You are a <span className="text-zinc-500">{recommendedTrack.personaTitle || recommendedTrack.name}</span>
          </h1>

          <p className="text-zinc-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-body">
            {recommendedTrack.personaDescription ||
              `Based on your responses, you enjoy building hands-on solutions with immediate visual impact.`}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button size="default" className="gap-2">
                <span>Go to dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            {firstMission && (
              <Link href={`/mission/${firstMission.id}`}>
                <Button variant="secondary" size="default" className="gap-2">
                  <Rocket className="w-4 h-4 text-zinc-900" />
                  <span>Start mission ({firstMission.title})</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Detailed Recommended Track Card */}
        <Card className="border-zinc-200 bg-white">
          <CardHeader className="border-b border-zinc-200 pb-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 font-mono text-xs font-semibold text-zinc-900">
                    <Star className="w-3 h-3 fill-zinc-900 text-zinc-900" />
                    {recommendedTrack.matchScore}% Match
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    {recommendedTrack.totalMissions} interactive missions
                  </span>
                </div>
                <CardTitle className="text-2xl text-zinc-950">{recommendedTrack.name}</CardTitle>
              </div>

              <div className="flex items-center gap-4 bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-[10px] self-start md:self-auto font-mono">
                <div className="text-center">
                  <p className="text-[11px] text-zinc-500">Courses</p>
                  <p className="text-base font-bold text-zinc-950">{recommendedTrack.totalCourses}</p>
                </div>
                <div className="w-px h-6 bg-zinc-200" />
                <div className="text-center">
                  <p className="text-[11px] text-zinc-500">Total XP</p>
                  <p className="text-base font-bold text-zinc-950">+{recommendedTrack.totalXp}</p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-5 space-y-6">
            <p className="text-sm text-zinc-600 font-body leading-relaxed">
              {recommendedTrack.description}
            </p>

            {/* Match Reasons */}
            <div className="p-4 rounded-[10px] bg-zinc-50 border border-zinc-200 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Why this track matches your profile:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-zinc-700">
                {recommendedTrack.matchReasons?.map((reason: string, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 bg-white p-2.5 rounded-[8px] border border-zinc-200"
                  >
                    <Check className="w-4 h-4 text-zinc-950 shrink-0 mt-0.5" />
                    <span className="leading-snug">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Starting Mission Callout */}
            {firstMission && (
              <div className="p-5 rounded-[12px] bg-zinc-50 border border-zinc-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-zinc-950" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
                      Starter Mission
                    </span>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-zinc-200 border border-zinc-300 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-900">
                    +{firstMission.xpReward} XP
                  </span>
                </div>

                <div>
                  <p className="text-xs text-zinc-500 mb-0.5">
                    Course: <strong className="text-zinc-800">{startingCourse?.name || 'Fundamentals'}</strong>
                  </p>
                  <h4 className="font-heading text-lg font-bold text-zinc-950">{firstMission.title}</h4>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{firstMission.description}</p>
                </div>

                <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-1.5">
                    {firstMission.languages?.map((lang: string) => (
                      <span
                        key={lang}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-zinc-800 border border-zinc-200 font-semibold"
                      >
                        {lang.toUpperCase()}
                      </span>
                    ))}
                  </div>

                  <Link href={`/mission/${firstMission.id}`}>
                    <Button size="sm" className="gap-2 text-xs">
                      <span>Launch workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Retake and Navigation */}
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <button
            onClick={() => {
              setRecommendationResult(null);
              setCurrentIndex(0);
              setSelectedAnswers({});
            }}
            className="hover:text-zinc-950 inline-flex items-center gap-1.5 transition-colors font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake questionnaire</span>
          </button>

          <Link href="/roadmap" className="hover:text-zinc-950 transition-colors inline-flex items-center gap-1 font-medium">
            <span>Explore all roadmaps</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Active Questionnaire Flow
  return (
    <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 min-h-screen flex flex-col justify-between py-6">
      {/* Top Brand Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
        <Logo size="sm" href="/" />
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-600">
            Student: <strong className="text-zinc-900">{user?.name}</strong>
          </span>
          <button
            onClick={() => logout()}
            className="text-xs text-zinc-500 hover:text-black flex items-center gap-1.5 transition-colors px-2.5 py-1 rounded-[8px] hover:bg-zinc-100 border border-transparent hover:border-zinc-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Header & Progress Indicator */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="default" size="sm">
              {currentQ.category || 'Skill Assessment'}
            </Badge>
            <span className="text-zinc-500">
              Question {currentIndex + 1} of {questions.length}
            </span>
          </div>
          <span className="font-mono text-zinc-500 tabular-nums">
            {Math.round(progress)}% complete
          </span>
        </div>

        <div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-950 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="flex-1 flex flex-col justify-center my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-3xl sm:text-4xl block mb-1">
                {questionEmojis[currentIndex % questionEmojis.length]}
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                {currentQ.title}
              </h2>
              {currentQ.subtitle && (
                <p className="text-sm text-zinc-600 font-body">{currentQ.subtitle}</p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {currentQ.options?.map((option: any) => {
                const selected = selectedAnswers[currentQ.id] === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(currentQ.id, option.id)}
                    className={`w-full p-4 rounded-[12px] border text-left transition-all flex items-start gap-4 ${
                      selected
                        ? 'bg-zinc-50 border-zinc-950 ring-1 ring-zinc-950 text-zinc-950'
                        : 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50 text-zinc-800'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-[10px] border mt-0.5 shrink-0 ${
                        selected
                          ? 'bg-zinc-950 border-zinc-950 text-white'
                          : 'bg-zinc-100 border-zinc-200 text-zinc-700'
                      }`}
                    >
                      {getOptionIcon(option.icon)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className={`text-sm font-semibold ${selected ? 'text-zinc-950' : 'text-zinc-800'}`}>
                          {option.label}
                        </h3>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                            selected
                              ? 'border-zinc-950 bg-zinc-950 text-white'
                              : 'border-zinc-300 bg-transparent'
                          }`}
                        >
                          {selected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      {option.description && (
                        <p className="text-xs text-zinc-500 mt-1 leading-relaxed font-body">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action Footer */}
      <div className="pt-6 border-t border-zinc-200 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="default"
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        <Button
          size="default"
          onClick={handleNext}
          disabled={!isSelected}
          className="gap-2"
        >
          <span>
            {currentIndex === questions.length - 1
              ? 'Analyze with AI & Recommend Path'
              : 'Next question'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
