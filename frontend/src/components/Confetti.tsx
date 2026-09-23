'use client';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  angle: number;
  velocity: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  shape: 'square' | 'circle' | 'star';
}

const COLORS = ['#000000', '#18181b', '#3f3f46', '#71717a', '#a1a1aa', '#d4d4d8', '#09090b'];

export default function Confetti({ active, duration = 3000 }: { active: boolean; duration?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!active) return;

    setVisible(true);
    const newParticles: Particle[] = [];
    for (let i = 0; i < 60; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20,
        y: 40,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        angle: Math.random() * 360,
        velocity: 3 + Math.random() * 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        size: 6 + Math.random() * 6,
        shape: (['square', 'circle', 'star'] as const)[Math.floor(Math.random() * 3)],
      });
    }
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setVisible(false);
      setParticles([]);
    }, duration);

    return () => clearTimeout(timer);
  }, [active, duration]);

  if (!visible || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.shape !== 'star' ? p.color : 'transparent',
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            transform: `rotate(${p.rotation}deg)`,
            animationDuration: `${1.5 + Math.random() * 1.5}s`,
            animationDelay: `${Math.random() * 0.3}s`,
            ['--confetti-x' as any]: `${(Math.random() - 0.5) * 300}px`,
            ['--confetti-rotate' as any]: `${p.rotationSpeed * 40}deg`,
            ...(p.shape === 'star'
              ? {
                  width: 0,
                  height: 0,
                  borderLeft: `${p.size / 2}px solid transparent`,
                  borderRight: `${p.size / 2}px solid transparent`,
                  borderBottom: `${p.size}px solid ${p.color}`,
                }
              : {}),
          }}
        />
      ))}
    </div>
  );
}

// XP Popup component
export function XPPopup({ xp, show }: { xp: number; show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] pointer-events-none">
      <div className="animate-xp-popup text-center bg-white/95 border border-zinc-300 shadow-2xl p-6 rounded-2xl backdrop-blur-md">
        <div className="text-6xl font-black text-zinc-950 font-mono">
          +{xp} XP
        </div>
        <div className="text-xl font-bold text-zinc-800 mt-2">
          Step Complete!
        </div>
      </div>
    </div>
  );
}

// Mission Complete overlay
export function MissionCompleteOverlay({ show, xp, onContinue }: { show: boolean; xp: number; onContinue: () => void }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99] flex items-center justify-center p-4">
      <div className="text-center animate-mission-complete bg-white border border-zinc-300 p-8 sm:p-10 rounded-2xl max-w-md w-full shadow-2xl space-y-4">
        <div className="text-7xl">🏆</div>
        <h2 className="text-3xl font-black text-zinc-950 tracking-tight">Mission Complete!</h2>
        <div className="text-2xl font-bold font-mono text-zinc-900">
          +{xp} XP Earned
        </div>
        <button
          onClick={onContinue}
          className="w-full px-6 py-3 bg-black hover:bg-zinc-800 text-white font-bold text-base rounded-xl transition-all shadow-md"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
