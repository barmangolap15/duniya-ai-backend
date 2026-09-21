interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const currentLevelXp = level * 1000;
  const nextLevelXp = (level + 1) * 1000;
  const progress = Math.min(100, Math.max(0, ((xp - currentLevelXp) / 1000) * 100));

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-mono">
        <span className="text-slate-300 font-semibold">Level {level}</span>
        <span className="text-slate-400 tabular-nums">
          <span className="text-accent-400 font-semibold">{xp}</span> / {nextLevelXp} XP
        </span>
      </div>
      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
