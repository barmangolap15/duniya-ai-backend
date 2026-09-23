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
        <span className="text-zinc-900 font-semibold">Level {level}</span>
        <span className="text-zinc-500 tabular-nums">
          <span className="text-zinc-950 font-bold">{xp}</span> / {nextLevelXp} XP
        </span>
      </div>
      <div className="h-2 w-full bg-zinc-100 border border-zinc-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
