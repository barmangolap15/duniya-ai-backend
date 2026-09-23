'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { api } from '@/lib/api';
import { soundManager } from '@/lib/sounds';
import LoadingSpinner from '@/components/LoadingSpinner';
import Confetti, { XPPopup } from '@/components/Confetti';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Check,
  Lightbulb,
  Keyboard,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  Send,
  Sparkles,
  Code2,
  X,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface Step {
  id: number;
  title: string;
  instruction: string;
  target: string;
  expectedCode: string;
  hint: string;
  validation: string;
  xp: number;
  emoji: string;
}

export default function MissionWorkspace() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [actualMissionId, setActualMissionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const missionIdx = parts.indexOf('mission');
      if (missionIdx !== -1 && parts[missionIdx + 1] && parts[missionIdx + 1] !== 'workspace') {
        return parts[missionIdx + 1];
      }
    }
    return (params?.id as string) || '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const missionIdx = parts.indexOf('mission');
      if (missionIdx !== -1 && parts[missionIdx + 1] && parts[missionIdx + 1] !== 'workspace') {
        setActualMissionId(parts[missionIdx + 1]);
      } else if (params?.id && params.id !== 'workspace') {
        setActualMissionId(params.id as string);
      }
    }
  }, [params]);

  const missionId = actualMissionId || (params?.id as string) || 'workspace';

  // Editor state
  const [activeTab, setActiveTab] = useState<string>('html');
  const [code, setCode] = useState<Record<string, string>>({ html: '', css: '', js: '', py: '', sql: '' });
  const [debouncedCode, setDebouncedCode] = useState<Record<string, string>>({ html: '', css: '', js: '', py: '', sql: '' });
  const [isSaving, setIsSaving] = useState(false);

  // Step-by-step state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  // Animation state
  const [showStepXP, setShowStepXP] = useState(false);
  const [stepXPAmount, setStepXPAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMissionComplete, setShowMissionComplete] = useState(false);
  const [justCompletedStep, setJustCompletedStep] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(true);

  // Mentor Drawer state
  const [showMentorDrawer, setShowMentorDrawer] = useState(false);
  const [mentorQuestion, setMentorQuestion] = useState('');
  const [mentorReply, setMentorReply] = useState('');

  const editorRef = useRef<any>(null);

  // Fetch mission details
  const { data: mission, isLoading: loadingMission } = useQuery({
    queryKey: ['mission', missionId],
    queryFn: () => api.missions.getOne(missionId),
    enabled: Boolean(missionId),
  });

  // Fetch existing submission
  const { data: submission } = useQuery({
    queryKey: ['submission', missionId],
    queryFn: () => api.missions.getSubmission(missionId).catch(() => null),
    enabled: Boolean(missionId),
  });

  // Fetch mentorship threads
  const { data: allThreads } = useQuery({
    queryKey: ['mentorship-threads'],
    queryFn: () => api.mentorship.getThreads(),
  });

  const missionThread = allThreads?.find((t: any) => t.missionId === missionId) || null;

  // Ask mentor mutation
  const askMentorMutation = useMutation({
    mutationFn: (data: any) => api.mentorship.createThread(data),
    onSuccess: () => {
      soundManager.playStepComplete();
      toast.success('Question sent to mentor Elena Rostova!');
      setMentorQuestion('');
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to send question');
    },
  });

  // Reply mentor mutation
  const replyMentorMutation = useMutation({
    mutationFn: (data: { threadId: string; content: string; codeSnippet?: string }) =>
      api.mentorship.addMessage(data.threadId, { content: data.content, codeSnippet: data.codeSnippet }),
    onSuccess: () => {
      soundManager.playTap();
      toast.success('Reply sent to mentor!');
      setMentorReply('');
      queryClient.invalidateQueries({ queryKey: ['mentorship-threads'] });
    },
  });

  const steps: Step[] = mission?.steps || [];

  // Initialize code from submission or starter
  useEffect(() => {
    if (submission) {
      setCode({
        html: submission.htmlCode || '',
        css: submission.cssCode || '',
        js: submission.jsCode || '',
        py: submission.jsCode || '',
        sql: submission.jsCode || '',
      });
      setDebouncedCode({
        html: submission.htmlCode || '',
        css: submission.cssCode || '',
        js: submission.jsCode || '',
        py: submission.jsCode || '',
        sql: submission.jsCode || '',
      });
    } else if (mission) {
      setCode({
        html: mission.starterHtml || '',
        css: mission.starterCss || '',
        js: mission.starterJs || '',
        py: mission.starterJs || '',
        sql: mission.starterJs || '',
      });
      setDebouncedCode({
        html: mission.starterHtml || '',
        css: mission.starterCss || '',
        js: mission.starterJs || '',
        py: mission.starterJs || '',
        sql: mission.starterJs || '',
      });
    }

    if (mission) {
      const missionLangs = mission.languages && mission.languages.length > 0 ? mission.languages : ['html', 'css', 'js'];
      const firstTarget = steps[0]?.target;
      if (firstTarget && missionLangs.includes(firstTarget)) {
        setActiveTab(firstTarget);
      } else if (missionLangs[0]) {
        setActiveTab(missionLangs[0]);
      }
    }
  }, [submission, mission]);

  // Re-validate steps when code changes
  useEffect(() => {
    if (!steps.length) return;
    const newCompleted = new Set<number>();
    let totalXP = 0;
    for (const step of steps) {
      const targetCode = code[step.target] || '';
      const normalizedCode = targetCode.replace(/\s+/g, ' ').toLowerCase();
      const normalizedValidation = step.validation.replace(/\s+/g, ' ').toLowerCase();
      if (normalizedCode.includes(normalizedValidation)) {
        newCompleted.add(step.id);
        totalXP += step.xp;
      }
    }
    setCompletedSteps(newCompleted);
    setEarnedXP(totalXP);

    const firstIncomplete = steps.findIndex((s) => !newCompleted.has(s.id));
    if (firstIncomplete >= 0 && firstIncomplete !== currentStepIndex && !showMissionComplete) {
      if (firstIncomplete > currentStepIndex) {
        setCurrentStepIndex(firstIncomplete);
      }
    }
  }, [code, steps]);

  const validateCurrentStep = useCallback(
    (newCode: typeof code) => {
      if (!steps.length || currentStepIndex >= steps.length) return;
      const currentStep = steps[currentStepIndex];
      if (!currentStep) return;

      const targetCode = newCode[currentStep.target] || '';
      const normalizedCode = targetCode.replace(/\s+/g, ' ').toLowerCase();
      const normalizedValidation = currentStep.validation.replace(/\s+/g, ' ').toLowerCase();

      if (normalizedCode.includes(normalizedValidation)) {
        if (!completedSteps.has(currentStep.id)) {
          soundManager.playStepComplete();
          setJustCompletedStep(currentStep.id);
          setTimeout(() => setJustCompletedStep(null), 1200);

          setCompletedSteps((prev) => {
            const next = new Set(prev);
            next.add(currentStep.id);
            return next;
          });

          setEarnedXP((prev) => prev + currentStep.xp);
          setStepXPAmount(currentStep.xp);
          setShowStepXP(true);
          setTimeout(() => setShowStepXP(false), 1500);

          setShowHint(false);

          const nextIndex = currentStepIndex + 1;
          if (nextIndex < steps.length) {
            setTimeout(() => {
              setCurrentStepIndex(nextIndex);
              const nextStep = steps[nextIndex];
              if (nextStep && nextStep.target) {
                setActiveTab(nextStep.target);
              }
            }, 800);
          } else {
            setTimeout(() => {
              soundManager.playMilestone();
              setShowConfetti(true);
              setShowMissionComplete(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }, 600);
          }
        }
      }
    },
    [steps, currentStepIndex, completedSteps]
  );

  const saveMutation = useMutation({
    mutationFn: (currentCode: typeof code) =>
      api.submissions.autosave({
        missionId,
        htmlCode: currentCode.html,
        cssCode: currentCode.css,
        jsCode: currentCode.js,
      }),
    onSuccess: () => {
      setIsSaving(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      api.submissions.submit({
        missionId,
        htmlCode: code.html,
        cssCode: code.css,
        jsCode: code.js,
      }),
    onSuccess: () => {
      soundManager.playMilestone();
      toast.success('Mission completed! Submission saved.');
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      router.push('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Submission failed');
    },
  });

  const handleCodeChange = (tab: string, value: string) => {
    const updated = { ...code, [tab]: value };
    setCode(updated);
    setIsSaving(true);
    validateCurrentStep(updated);
  };

  const handleTabToFill = () => {
    if (!steps.length || currentStepIndex >= steps.length) return;
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;

    const targetTab = currentStep.target;
    if (activeTab !== targetTab) {
      setActiveTab(targetTab);
    }

    const currentCode = code[targetTab] || '';
    let updatedCode = currentCode;

    if (currentStep.expectedCode) {
      if (targetTab === 'html') {
        const bodyCloseIdx = updatedCode.lastIndexOf('</body>');
        if (bodyCloseIdx !== -1) {
          updatedCode =
            updatedCode.slice(0, bodyCloseIdx) +
            '    ' +
            currentStep.expectedCode +
            '\n  ' +
            updatedCode.slice(bodyCloseIdx);
        } else {
          updatedCode += '\n' + currentStep.expectedCode;
        }
      } else {
        updatedCode += '\n' + currentStep.expectedCode;
      }
    }

    handleCodeChange(targetTab, updatedCode);
    soundManager.playTap();
  };

  const currentStep = steps[currentStepIndex];
  const allStepsCompleted = steps.length > 0 && completedSteps.size === steps.length;
  const progressPercent = steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0;

  if (loadingMission || !mission) {
    return (
      <div className="flex items-center justify-center h-screen bg-night text-white">
        <LoadingSpinner />
      </div>
    );
  }

  const getExtensions = () => {
    switch (activeTab) {
      case 'html':
        return [html()];
      case 'css':
        return [css()];
      case 'js':
        return [javascript()];
      case 'py':
      case 'python':
        return [python()];
      case 'sql':
        return [sql()];
      default:
        return [html()];
    }
  };

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #ffffff; color: #0f172a; }
          ${debouncedCode.css}
        </style>
      </head>
      <body>
        ${debouncedCode.html}
        <script>
          try {
            ${debouncedCode.js}
          } catch(e) {
            console.error(e);
          }
        <\/script>
      </body>
    </html>
  `;

  return (
    <div className="flex flex-col h-screen bg-white text-zinc-900 overflow-hidden font-body">
      {/* Gamification popups */}
      <Confetti active={showConfetti} />
      <XPPopup xp={stepXPAmount} show={showStepXP} />

      {/* ─── WORKSPACE HEADER ─── */}
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-[8px] text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="font-heading font-bold text-sm text-zinc-950 truncate max-w-[200px] sm:max-w-md">
            {mission.title}
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            {(mission.languages || ['html', 'css', 'js']).map((lang: string) => (
              <span
                key={lang}
                className={`px-2 py-0.5 rounded-[6px] text-[10px] font-mono uppercase font-semibold ${
                  currentStep?.target === lang
                    ? 'bg-black text-white border border-black'
                    : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                }`}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* XP indicator */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 border border-zinc-200 px-2.5 py-1 font-mono text-xs font-semibold text-zinc-900 tabular-nums">
            <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            <span>+{earnedXP} XP</span>
          </span>

          {/* Ask Mentor Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMentorDrawer(true)}
            className="gap-1.5 text-xs text-zinc-800"
          >
            <MessageSquare className="w-3.5 h-3.5 text-zinc-700" />
            <span className="hidden sm:inline">Ask Mentor</span>
            {missionThread && <span className="w-2 h-2 rounded-full bg-black" />}
          </Button>

          {/* Save status */}
          <span className="text-xs text-zinc-500 font-mono hidden sm:flex items-center gap-1">
            {isSaving ? 'Saving...' : 'Saved'}
          </span>
        </div>
      </header>

      {/* ─── STEP PROGRESS TRACK ─── */}
      <div className="h-1.5 bg-zinc-200 shrink-0 relative">
        <div
          className="h-full bg-black transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ─── MAIN WORKSPACE ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Editor & Preview */}
        <div className="flex-1 flex flex-col border-r border-zinc-200 min-w-0">
          {/* Editor Tabs Bar */}
          <div className="flex bg-zinc-50 border-b border-zinc-200 shrink-0">
            {(() => {
              const stepTargets = Array.from(new Set(steps.map((s) => s.target).filter(Boolean)));
              const missionLangs: string[] =
                mission.languages && mission.languages.length > 0
                  ? mission.languages
                  : stepTargets.length > 0
                    ? stepTargets
                    : ['html', 'css', 'js'];
              const displayTabs = Array.from(new Set([...missionLangs, ...stepTargets]));

              const tabLabels: Record<string, string> = {
                html: 'HTML',
                css: 'CSS',
                js: 'JavaScript',
                py: 'Python',
                python: 'Python',
                sql: 'SQL',
              };

              return displayTabs.map((tab) => {
                const isTarget = currentStep?.target === tab;
                const isCurrentActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      soundManager.playTap();
                    }}
                    className={`relative px-5 py-2.5 text-xs font-mono font-semibold uppercase border-r border-zinc-200 transition-all flex items-center gap-2 ${
                      isCurrentActive
                        ? 'bg-white text-zinc-950 border-t-2 border-t-black'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 border-t-2 border-t-transparent'
                    }`}
                  >
                    <span>{tabLabels[tab] || tab.toUpperCase()}</span>
                    {isTarget && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-zinc-200 text-zinc-800 font-mono lowercase border border-zinc-300">
                        step target
                      </span>
                    )}
                  </button>
                );
              });
            })()}

            {/* Toggle Preview Button */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="ml-auto px-3 py-2 text-zinc-600 hover:text-zinc-950 transition-colors flex items-center gap-1.5 text-xs font-body"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>Preview</span>
            </button>
          </div>

          {/* CodeMirror Editor Area */}
          <div className={`${showPreview ? 'flex-1' : 'flex-[2]'} overflow-auto bg-zinc-950 min-h-0`}>
            <CodeMirror
              value={code[activeTab]}
              height="100%"
              extensions={getExtensions()}
              theme={oneDark}
              onChange={(value) => handleCodeChange(activeTab, value)}
              className="h-full text-xs font-mono"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                autocompletion: true,
              }}
            />
          </div>

          {/* Live Sandbox Preview */}
          {showPreview && (
            <div className="flex-1 bg-white relative border-t border-zinc-200 min-h-0">
              <div className="absolute top-2 left-2 text-[10px] bg-black/75 text-white px-2 py-0.5 rounded font-mono z-10 select-none">
                LIVE SANDBOX PREVIEW
              </div>
              <iframe
                srcDoc={srcDoc}
                title="live preview"
                sandbox="allow-scripts"
                className="w-full h-full border-0"
              />
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Step-by-Step Instructions */}
        <div className="w-[380px] bg-white flex flex-col border-l border-zinc-200 shrink-0">
          {/* Step header */}
          <div className="p-4 border-b border-zinc-200 shrink-0 flex items-center justify-between">
            <h2 className="font-heading text-xs font-bold uppercase tracking-wider text-zinc-500">
              Mission Steps
            </h2>
            <span
              className={`font-mono text-xs font-semibold ${
                allStepsCompleted ? 'text-zinc-950' : 'text-zinc-500'
              }`}
            >
              {completedSteps.size}/{steps.length} complete {allStepsCompleted && '✓'}
            </span>
          </div>

          {/* Mission Complete Card */}
          {(allStepsCompleted || showMissionComplete) && (
            <div className="p-4 bg-zinc-100 border-b border-zinc-300 shrink-0 space-y-3 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-zinc-200 border border-zinc-300 flex items-center justify-center text-xl text-zinc-900">
                  🏆
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-950 uppercase tracking-wider">Mission Solved</p>
                  <p className="text-sm font-bold text-zinc-900 truncate">All steps verified</p>
                </div>
                <Badge variant="xp">+{mission.xpReward} XP</Badge>
              </div>

              <p className="text-xs text-zinc-600 font-body leading-relaxed">
                Great job! All unit tests passed. Click continue to submit code for verified mentor endorsement.
              </p>

              <Button
                variant="default"
                size="default"
                onClick={() => submitMutation.mutate()}
                isLoading={submitMutation.isPending}
                className="w-full gap-2 text-xs font-bold"
              >
                <span>Submit mission</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Steps list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {steps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = index === currentStepIndex;
              const isLocked = index > currentStepIndex && !isCompleted;
              const wasJustCompleted = justCompletedStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`rounded-[12px] transition-all duration-200 border ${
                    isCompleted
                      ? 'bg-zinc-50 border-zinc-200'
                      : isCurrent
                        ? 'bg-white border-black ring-1 ring-black'
                        : 'bg-zinc-50/50 border-zinc-200 opacity-60'
                  }`}
                >
                  {/* Step header */}
                  <div className="flex items-center gap-3 p-3">
                    <div
                      className={`w-7 h-7 rounded-[8px] flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-black text-white font-bold'
                          : isCurrent
                            ? 'bg-zinc-100 text-zinc-900 border border-zinc-300'
                            : 'bg-zinc-200 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : isLocked ? <Lock className="w-3 h-3" /> : step.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-semibold truncate ${
                          isCompleted ? 'text-zinc-900' : isCurrent ? 'text-zinc-950 font-bold' : 'text-zinc-500'
                        }`}
                      >
                        {step.title}
                      </p>
                      {isCompleted && (
                        <p className="text-[10px] font-mono text-zinc-600">+{step.xp} XP</p>
                      )}
                    </div>

                    {(isCurrent || isCompleted) && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-zinc-100 border border-zinc-200 text-zinc-600">
                        {step.target}
                      </span>
                    )}
                  </div>

                  {/* Expanded instructions for active step */}
                  {isCurrent && !isCompleted && (
                    <div className="px-3 pb-3 space-y-3">
                      <div className="bg-zinc-50 rounded-[8px] p-3 border border-zinc-200">
                        <p
                          className="text-xs text-zinc-800 font-body leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: step.instruction
                              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-950 font-semibold">$1</strong>')
                              .replace(/`(.*?)`/g, '<code class="bg-zinc-200 px-1.5 py-0.5 rounded text-zinc-900 text-xs font-mono">$1</code>'),
                          }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={handleTabToFill}
                          className="flex-1 gap-1.5 text-xs font-semibold"
                        >
                          <Keyboard className="w-3.5 h-3.5" />
                          <span>Fill Code</span>
                        </Button>

                        <button
                          onClick={() => {
                            setShowHint(!showHint);
                            soundManager.playTap();
                          }}
                          className={`p-2 rounded-[8px] border transition-all ${
                            showHint
                              ? 'bg-black text-white border-black'
                              : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-950'
                          }`}
                          title="Show Hint"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setMentorQuestion(
                              `I'm stuck on Step ${step.id} ("${step.title}"). How do I properly write the ${step.target.toUpperCase()} code for this step?`
                            );
                            setShowMentorDrawer(true);
                          }}
                          className="p-2 rounded-[8px] border border-zinc-200 bg-white text-zinc-600 hover:text-zinc-950 transition-all"
                          title="Ask Mentor"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>

                      {showHint && (
                        <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-[8px] space-y-1">
                          <div className="flex items-center gap-1.5 text-zinc-950 text-xs font-semibold">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>Hint</span>
                          </div>
                          <code className="text-xs text-zinc-800 font-mono break-all whitespace-pre-wrap block">
                            {step.hint}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom: Mission Reward */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 shrink-0 flex items-center justify-between font-mono text-xs">
            <span className="text-zinc-500">Total Mission XP</span>
            <span className="font-bold text-zinc-950 text-sm">+{mission.xpReward} XP</span>
          </div>
        </div>
      </div>

      {/* ─── SLIDE-OVER MENTOR DRAWER ─── */}
      {showMentorDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border-l border-zinc-200 h-full flex flex-col shadow-2xl animate-slide-left">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name="Elena Rostova" size="md" variant="mentor" />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-zinc-950">Elena Rostova</span>
                    <Badge variant="verified" size="sm">
                      Mentor
                    </Badge>
                  </div>
                  <p className="text-[11px] text-zinc-500 font-mono">Staff Frontend Engineer</p>
                </div>
              </div>
              <button
                onClick={() => setShowMentorDrawer(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-950"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Parent Notice */}
            <div className="px-4 py-2 bg-zinc-100 border-b border-zinc-200 flex items-center justify-between text-[11px] text-zinc-700 font-mono">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
                Verified mentorship environment
              </span>
              <Link href="/mentorship" className="text-zinc-950 font-semibold hover:underline">
                Hub &rarr;
              </Link>
            </div>

            {/* Conversation */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {missionThread ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-950">
                    Active Discussion: {missionThread.subject}
                  </p>
                  <div className="space-y-2">
                    {missionThread.messages?.map((msg: any) => {
                      const isUser = msg.senderRole === 'STUDENT';
                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-[10px] text-xs leading-relaxed ${
                            isUser
                              ? 'bg-black text-white ml-6'
                              : 'bg-zinc-100 text-zinc-900 mr-6 border border-zinc-200'
                          }`}
                        >
                          <div className="font-semibold text-[10px] opacity-75 mb-1 font-mono">
                            {isUser ? 'You' : 'Elena (Mentor)'} · {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <p className="font-body">{msg.content}</p>
                          {msg.codeSnippet && (
                            <pre className="mt-2 p-2 bg-zinc-900 rounded border border-zinc-800 text-[11px] font-mono text-zinc-100 overflow-x-auto">
                              <code>{msg.codeSnippet}</code>
                            </pre>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-zinc-50 rounded-[10px] border border-zinc-200 text-xs text-zinc-700 font-body">
                    <p className="font-semibold text-zinc-950 mb-1">Need guidance on {mission.title}?</p>
                    <p className="text-zinc-600">
                      Elena will review your code snapshot and help you work through blockers without spoiling the solution.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-700">Your question</label>
                    <textarea
                      rows={4}
                      value={mentorQuestion}
                      onChange={(e) => setMentorQuestion(e.target.value)}
                      placeholder="e.g. How do I get the flex container to wrap properly?"
                      className="w-full bg-white border border-zinc-300 rounded-[10px] p-3 text-xs text-zinc-950 focus:outline-none focus:ring-2 focus:ring-black font-body resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <p className="text-[11px] text-zinc-700 font-mono flex items-center gap-1">
                      <Code2 className="w-3.5 h-3.5" /> Auto-attached Code ({activeTab.toUpperCase()})
                    </p>
                    <pre className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-[10px] text-[11px] font-mono text-zinc-100 max-h-36 overflow-y-auto">
                      <code>{code[activeTab] || '/* Empty file */'}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-200 bg-white">
              {missionThread ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!mentorReply.trim()) return;
                    replyMentorMutation.mutate({
                      threadId: missionThread.id,
                      content: mentorReply.trim(),
                      codeSnippet: code[activeTab] || undefined,
                    });
                  }}
                  className="flex gap-2"
                >
                  <Input
                    type="text"
                    value={mentorReply}
                    onChange={(e) => setMentorReply(e.target.value)}
                    placeholder="Reply to mentor..."
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" disabled={!mentorReply.trim() || replyMentorMutation.isPending}>
                    <Send className="w-3.5 h-3.5" />
                  </Button>
                </form>
              ) : (
                <Button
                  size="default"
                  onClick={() => {
                    if (!mentorQuestion.trim()) {
                      toast.error('Please write a question for the mentor');
                      return;
                    }
                    askMentorMutation.mutate({
                      missionId: mission?.id || (missionId && missionId !== 'workspace' ? missionId : undefined),
                      subject: `Help with ${mission?.title || 'Mission'}${currentStep ? ` (Step ${currentStep.id})` : ''}`,
                      message: mentorQuestion.trim(),
                      codeSnippet: code[activeTab] || undefined,
                      stepNumber: currentStep?.id,
                    });
                  }}
                  disabled={askMentorMutation.isPending || !mentorQuestion.trim()}
                  isLoading={askMentorMutation.isPending}
                  className="w-full gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send question to mentor</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
