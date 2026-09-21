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
import Confetti, { XPPopup, MissionCompleteOverlay } from '@/components/Confetti';
import { ArrowLeft, Play, Save, Check, ChevronRight, Lightbulb, Keyboard, Lock, Eye, EyeOff, MessageSquare, Send, Sparkles, Code2, X, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

type Tab = string;

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

  // Resolve actual missionId in client static hosting
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
  const { data: submission, isLoading: loadingSub } = useQuery({
    queryKey: ['submission', missionId],
    queryFn: () => api.missions.getSubmission(missionId).catch(() => null),
    enabled: Boolean(missionId),
  });

  // Fetch threads to see if a conversation already exists for this mission
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
      // Pick initial tab based on first step or available languages
      const missionLangs = (mission.languages && mission.languages.length > 0)
        ? mission.languages
        : ['html', 'css', 'js'];
      const firstTarget = steps[0]?.target;
      if (firstTarget && missionLangs.includes(firstTarget)) {
        setActiveTab(firstTarget);
      } else if (missionLangs[0]) {
        setActiveTab(missionLangs[0]);
      }
    }
  }, [submission, mission]);

  // Re-validate all steps when code changes (to recover completed state)
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

    // Set current step to first incomplete
    const firstIncomplete = steps.findIndex((s) => !newCompleted.has(s.id));
    if (firstIncomplete >= 0 && firstIncomplete !== currentStepIndex && !showMissionComplete) {
      // Only advance, don't go back
      if (firstIncomplete > currentStepIndex) {
        setCurrentStepIndex(firstIncomplete);
      }
    }
  }, [code, steps]);

  // Validate current step when code changes
  const validateCurrentStep = useCallback(
    (newCode: typeof code) => {
      if (!steps.length || currentStepIndex >= steps.length) return;
      const currentStep = steps[currentStepIndex];
      const targetCode = newCode[currentStep.target] || '';
      const normalizedCode = targetCode.replace(/\s+/g, ' ').toLowerCase();
      const normalizedValidation = currentStep.validation.replace(/\s+/g, ' ').toLowerCase();

      if (normalizedCode.includes(normalizedValidation) && !completedSteps.has(currentStep.id)) {
        // Step completed!
        const newCompleted = new Set(completedSteps);
        newCompleted.add(currentStep.id);
        setCompletedSteps(newCompleted);
        setJustCompletedStep(currentStep.id);

        // Sound & animation
        soundManager.playStepComplete();
        setStepXPAmount(currentStep.xp);
        setShowStepXP(true);
        setEarnedXP((prev) => prev + currentStep.xp);

        setTimeout(() => {
          setShowStepXP(false);
          setJustCompletedStep(null);
        }, 1500);

        // Check if all steps completed
        if (newCompleted.size === steps.length) {
          setTimeout(() => {
            soundManager.playMissionComplete();
            setShowConfetti(true);
            setShowMissionComplete(true);
          }, 800);
        } else {
          // Move to next step
          setTimeout(() => {
            const nextIncomplete = steps.findIndex(
              (s, i) => i > currentStepIndex && !newCompleted.has(s.id),
            );
            if (nextIncomplete >= 0) {
              setCurrentStepIndex(nextIncomplete);
              // Auto-switch to target tab
              setActiveTab(steps[nextIncomplete].target);
              setShowHint(false);
            }
          }, 600);
        }
      }
    },
    [steps, currentStepIndex, completedSteps],
  );

  // Debounce for iframe preview
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(code);
    }, 500);
    return () => clearTimeout(timer);
  }, [code]);

  // Handle code change
  const handleCodeChange = (tab: Tab, value: string) => {
    const newCode = { ...code, [tab]: value };
    setCode(newCode);
    validateCurrentStep(newCode);
  };

  // Auto-save
  useEffect(() => {
    const timer = setInterval(() => {
      handleAutosave();
    }, 10000);
    return () => clearInterval(timer);
  }, [code]);

  const handleAutosave = async () => {
    if (!code.html && !code.css && !code.js) return;
    setIsSaving(true);
    try {
      await api.submissions.autosave({
        missionId,
        htmlCode: code.html,
        cssCode: code.css,
        jsCode: code.js,
      });
    } catch (e) {
      console.error('Autosave failed', e);
    } finally {
      setIsSaving(false);
    }
  };

  // Tab to fill (auto-complete current step)
  const handleTabToFill = () => {
    if (currentStepIndex >= steps.length) return;
    const currentStep = steps[currentStepIndex];
    const target = currentStep.target;

    soundManager.playTap();

    // Auto-switch to correct tab
    setActiveTab(target);

    // Append expected code
    const currentCode = code[target];
    const separator = currentCode.trim() ? '\n' : '';
    const newValue = currentCode + separator + currentStep.expectedCode;

    const newCode = { ...code, [target]: newValue };
    setCode(newCode);

    // Validate immediately
    setTimeout(() => validateCurrentStep(newCode), 100);
  };

  // Submit mission
  const submitMutation = useMutation({
    mutationFn: () =>
      api.submissions.submit({
        missionId,
        htmlCode: code.html,
        cssCode: code.css,
        jsCode: code.js,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success(`Mission Complete! +${data.xpEarned || mission?.xpReward || 0} XP`);
      router.push('/dashboard');
    },
    onError: () => {
      toast.error('Failed to submit mission');
    },
  });

  const getExtensions = () => {
    if (activeTab === 'html') return [html()];
    if (activeTab === 'css') return [css()];
    if (activeTab === 'py' || activeTab === 'python') return [python()];
    if (activeTab === 'sql') return [sql()];
    return [javascript()];
  };

  if (loadingMission || loadingSub) return <LoadingSpinner />;
  if (!mission) return <div className="text-center p-8 text-gray-400">Mission not found</div>;

  const currentStep = steps[currentStepIndex] || null;
  const allStepsCompleted = completedSteps.size === steps.length && steps.length > 0;
  const progressPercent = steps.length > 0 ? (completedSteps.size / steps.length) * 100 : 0;

  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: system-ui, sans-serif; padding: 16px; margin: 0; }
          ${debouncedCode.css}
        </style>
      </head>
      <body>
        ${debouncedCode.html}
        <script>${debouncedCode.js}<\/script>
      </body>
    </html>
  `;

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      {/* Celebration effects */}
      <Confetti active={showConfetti} />
      <XPPopup xp={stepXPAmount} show={showStepXP} />
      <MissionCompleteOverlay
        show={showMissionComplete}
        xp={mission.xpReward}
        onContinue={() => submitMutation.mutate()}
      />

      {/* ─── HEADER ─── */}
      <header className="h-14 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="font-semibold text-white">{mission.title}</div>
          <div className="hidden sm:flex items-center gap-2">
            {(mission.languages || ['html', 'css', 'js']).map((lang: string) => (
              <span
                key={lang}
                className={`px-2 py-0.5 rounded text-xs font-mono uppercase ${
                  currentStep?.target === lang
                    ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40 animate-tab-glow'
                    : 'bg-gray-800 text-gray-500 border border-gray-700'
                }`}
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* XP indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 text-sm font-bold">⚡ {earnedXP} XP</span>
          </div>

          {/* Ask Mentor Button */}
          <button
            onClick={() => setShowMentorDrawer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-600/20 hover:bg-accent-600/30 text-accent-300 border border-accent-500/40 text-xs font-semibold transition-all hover:scale-105"
          >
            <MessageSquare className="w-3.5 h-3.5 text-accent-400" />
            <span className="hidden sm:inline">Ask Mentor</span>
            {missionThread && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Active conversation" />
            )}
          </button>

          {/* Save indicator */}
          <span className="text-xs text-gray-500 hidden sm:flex items-center gap-1">
            {isSaving ? (
              <span className="animate-pulse flex items-center">
                <Save className="w-3 h-3 mr-1" /> Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Check className="w-3 h-3 mr-1" /> Saved
              </span>
            )}
          </span>
        </div>
      </header>

      {/* ─── STEP PROGRESS BAR ─── */}
      <div className="h-2 bg-gray-900 shrink-0 relative">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
        {/* Step dots */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                completedSteps.has(step.id)
                  ? 'bg-green-400 scale-125'
                  : i === currentStepIndex
                    ? 'bg-primary-400 scale-150 ring-2 ring-primary-400/40'
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ─── MAIN WORKSPACE ─── */}
      <div className="flex-1 flex overflow-hidden">
        {/* ═══ LEFT PANEL — Editor & Preview ═══ */}
        <div className="flex-1 flex flex-col border-r border-gray-800 min-w-0">
          {/* Editor Tabs */}
          <div className="flex bg-gray-900 border-b border-gray-800 shrink-0">
            {(() => {
              // Gather all active languages for this mission: either defined in mission.languages or referenced by steps
              const stepTargets = Array.from(new Set(steps.map(s => s.target).filter(Boolean)));
              const missionLangs: string[] = mission.languages && mission.languages.length > 0
                ? mission.languages
                : (stepTargets.length > 0 ? stepTargets : ['html', 'css', 'js']);
              
              // Ensure any step target is also accessible as a tab
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
                    className={`relative px-6 py-2.5 text-sm font-medium border-r border-gray-800 transition-all uppercase flex items-center gap-2 ${
                      isCurrentActive
                        ? 'bg-gray-950 text-primary-400 border-t-2 border-t-primary-500'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white border-t-2 border-t-transparent'
                    } ${isTarget && !isCurrentActive ? 'animate-tab-glow' : ''}`}
                  >
                    <span>{tabLabels[tab] || tab.toUpperCase()}</span>
                    {isTarget && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary-500/20 text-primary-300 font-mono lowercase border border-primary-500/30">
                        target
                      </span>
                    )}
                    {isTarget && !isCurrentActive && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              });
            })()}
            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="ml-auto px-3 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
            >
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              Preview
            </button>
          </div>

          {/* Code Editor */}
          <div className={`${showPreview ? 'flex-1' : 'flex-[2]'} overflow-auto bg-[#282c34] min-h-0`}>
            <CodeMirror
              value={code[activeTab]}
              height="100%"
              extensions={getExtensions()}
              theme={oneDark}
              onChange={(value) => handleCodeChange(activeTab, value)}
              className="h-full text-sm"
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                foldGutter: true,
                autocompletion: true,
              }}
            />
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="flex-1 bg-white relative border-t border-gray-800 min-h-0">
              <div className="absolute top-2 left-2 text-[10px] bg-black/50 text-gray-400 px-2 py-0.5 rounded z-10 font-mono">
                LIVE PREVIEW
              </div>
              <div className="absolute inset-0">
                <iframe
                  srcDoc={srcDoc}
                  title="preview"
                  sandbox="allow-scripts"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* ═══ RIGHT PANEL — Step-by-Step Instructions ═══ */}
        <div className="w-[380px] bg-gray-950 flex flex-col border-l border-gray-800 shrink-0">
          {/* Step header */}
          <div className="p-4 border-b border-gray-800 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Steps
              </h2>
              <span className="text-xs text-gray-500">
                {completedSteps.size}/{steps.length} Complete
              </span>
            </div>
          </div>

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
                  className={`rounded-xl transition-all duration-300 ${
                    isCompleted
                      ? wasJustCompleted
                        ? 'bg-green-500/10 border-2 border-green-500/50 animate-step-glow'
                        : 'bg-green-500/5 border border-green-500/20'
                      : isCurrent
                        ? 'bg-primary-500/10 border-2 border-primary-500/40 animate-step-pulse'
                        : 'bg-gray-900/50 border border-gray-800 opacity-60'
                  }`}
                >
                  {/* Step header */}
                  <div className="flex items-center gap-3 p-3">
                    {/* Status icon */}
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isCurrent
                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/40'
                            : 'bg-gray-800 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : isLocked ? <Lock className="w-3 h-3" /> : step.emoji}
                    </div>

                    {/* Step title */}
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isCompleted
                            ? 'text-green-400'
                            : isCurrent
                              ? 'text-white'
                              : 'text-gray-500'
                        }`}
                      >
                        {step.title}
                      </div>
                      {isCompleted && (
                        <div className="text-xs text-green-400/60">+{step.xp} XP</div>
                      )}
                    </div>

                    {/* Target badge */}
                    {(isCurrent || isCompleted) && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                          isCurrent
                            ? 'bg-primary-500/20 text-primary-300'
                            : 'bg-gray-800 text-gray-500'
                        }`}
                      >
                        {step.target}
                      </span>
                    )}
                  </div>

                  {/* Expanded content for current step */}
                  {isCurrent && !isCompleted && (
                    <div className="px-3 pb-3 animate-slide-up">
                      {/* Instruction text */}
                      <div className="bg-gray-900/80 rounded-lg p-3 mb-3">
                        <p className="text-sm text-gray-300 leading-relaxed"
                           dangerouslySetInnerHTML={{
                             __html: step.instruction
                               .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                               .replace(/`(.*?)`/g, '<code class="bg-gray-800 px-1.5 py-0.5 rounded text-primary-300 text-xs font-mono">$1</code>')
                           }}
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {/* Tab to fill button */}
                        <button
                          onClick={handleTabToFill}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-all hover:scale-[1.02] active:scale-95"
                        >
                          <Keyboard className="w-4 h-4" />
                          Fill Code
                        </button>

                        {/* Hint toggle */}
                        <button
                          onClick={() => {
                            setShowHint(!showHint);
                            soundManager.playTap();
                          }}
                          className={`px-3 py-2 rounded-lg text-sm transition-all ${
                            showHint
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-gray-800 text-gray-400 hover:text-amber-300 hover:bg-amber-500/10'
                          }`}
                          title="Show hint"
                        >
                          <Lightbulb className="w-4 h-4" />
                        </button>

                        {/* Ask Mentor for step */}
                        <button
                          onClick={() => {
                            setMentorQuestion(`I'm stuck on Step ${step.id} ("${step.title}"). How do I properly write the ${step.target.toUpperCase()} code for this step?`);
                            setShowMentorDrawer(true);
                          }}
                          className="px-3 py-2 rounded-lg text-sm bg-gray-800 text-gray-400 hover:text-accent-300 hover:bg-accent-500/10 transition-all border border-gray-700 hover:border-accent-500/40"
                          title="Ask mentor about this step"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Hint */}
                      {showHint && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg animate-slide-up">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                            <code className="text-xs text-amber-300 font-mono break-all whitespace-pre-wrap">
                              {step.hint}
                            </code>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* All steps completed message */}
            {allStepsCompleted && !showMissionComplete && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center animate-slide-up">
                <div className="text-3xl mb-2">🎉</div>
                <div className="text-green-400 font-bold mb-1">All Steps Complete!</div>
                <div className="text-sm text-gray-400 mb-4">Submit your work to earn XP</div>
                <button
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                  className="w-full px-6 py-3 bg-green-500 hover:bg-green-400 text-gray-950 font-bold rounded-lg transition-all text-base disabled:opacity-50 hover:scale-[1.02] active:scale-95"
                >
                  <Play className="w-5 h-5 inline mr-2 fill-current" />
                  Submit & Complete (+{mission.xpReward} XP)
                </button>
              </div>
            )}
          </div>

          {/* Bottom: Mission info */}
          <div className="p-4 bg-gray-900 border-t border-gray-800 shrink-0">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Mission Reward</span>
              <span className="font-bold text-amber-400 text-lg">⚡ {mission.xpReward} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── SLIDE-OVER MENTOR DRAWER ─── */}
      {showMentorDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-gray-900 border-l border-gray-800 h-full flex flex-col shadow-2xl animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-950 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250"
                    alt="Elena Rostova"
                    className="w-10 h-10 rounded-xl object-cover border border-accent-500/40"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-950" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">Elena Rostova</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-500/20 text-accent-300 font-mono border border-accent-500/30">
                      Mentor
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400">Staff Frontend Engineer</span>
                </div>
              </div>
              <button
                onClick={() => setShowMentorDrawer(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Transparency / Parent Notice */}
            <div className="px-4 py-2 bg-primary-950/40 border-b border-gray-800 flex items-center justify-between text-[11px] text-primary-300">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
                Parent oversight active for safety
              </span>
              <Link href="/mentorship" className="text-primary-400 hover:underline">
                Mentorship Hub &rarr;
              </Link>
            </div>

            {/* Existing Thread or New Question form */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {missionThread ? (
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-accent-400">
                    Active Discussion: {missionThread.subject}
                  </div>
                  <div className="space-y-2">
                    {missionThread.messages?.map((msg: any) => {
                      const isUser = msg.senderRole === 'STUDENT';
                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-xl text-xs leading-relaxed ${
                            isUser
                              ? 'bg-primary-600/90 text-white ml-6 rounded-tr-none'
                              : 'bg-gray-800 text-gray-200 mr-6 rounded-tl-none border border-gray-700'
                          }`}
                        >
                          <div className="font-semibold text-[10px] opacity-75 mb-1">
                            {isUser ? 'You' : 'Elena (Mentor)'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.codeSnippet && (
                            <pre className="mt-2 p-2 bg-gray-950 rounded-lg text-[11px] font-mono text-emerald-300 overflow-x-auto">
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
                  <div className="p-3 bg-gray-950/60 rounded-xl border border-gray-800 text-xs text-gray-300">
                    <p className="font-semibold text-white mb-1">Need guidance on {mission.title}?</p>
                    <p className="text-gray-400">
                      Elena will review your code snapshot and help you work through the problem without spoiling the solution.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-300">Your Question</label>
                    <textarea
                      rows={5}
                      value={mentorQuestion}
                      onChange={(e) => setMentorQuestion(e.target.value)}
                      placeholder="e.g. How do I get the element to align properly? What CSS rule is missing?"
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent-500 resize-none"
                    />
                  </div>

                  {/* Code Snapshot preview attached */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                      <span className="flex items-center gap-1 text-accent-400">
                        <Code2 className="w-3.5 h-3.5" /> Auto-attached Code ({activeTab.toUpperCase()})
                      </span>
                    </div>
                    <pre className="p-2.5 bg-gray-950 border border-gray-800 rounded-xl text-[11px] font-mono text-emerald-400/90 max-h-36 overflow-y-auto whitespace-pre">
                      <code>{code[activeTab] || '/* Empty file */'}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Drawer Footer / Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-950">
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
                  <input
                    type="text"
                    value={mentorReply}
                    onChange={(e) => setMentorReply(e.target.value)}
                    placeholder="Reply to mentor..."
                    className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                  <button
                    type="submit"
                    disabled={!mentorReply.trim() || replyMentorMutation.isPending}
                    className="px-3.5 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
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
                  className="w-full py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Question to Mentor</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
