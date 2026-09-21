interface XPBarProps {
  xp: number;
  level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
  const currentLevelXp = level * 1000;
  const nextLevelXp = (level + 1) * 1000;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">Level {level}</span>
        <span className="text-gray-400">{xp} / {nextLevelXp} XP</span>
      </div>
      <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-xp to-yellow-300 transition-all duration-1000 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
}
