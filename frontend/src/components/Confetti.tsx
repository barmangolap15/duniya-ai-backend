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

const COLORS = ['#3b82f6', '#a855f7', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

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
      <div className="animate-xp-popup text-center">
        <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 drop-shadow-lg">
          +{xp} XP
        </div>
        <div className="text-2xl font-bold text-white mt-2 animate-bounce">
          🎉 Step Complete!
        </div>
      </div>
    </div>
  );
}

// Mission Complete overlay
export function MissionCompleteOverlay({ show, xp, onContinue }: { show: boolean; xp: number; onContinue: () => void }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99] flex items-center justify-center">
      <div className="text-center animate-mission-complete">
        <div className="text-8xl mb-6">🏆</div>
        <h2 className="text-5xl font-black text-white mb-4">Mission Complete!</h2>
        <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 mb-8">
          +{xp} XP Earned
        </div>
        <button
          onClick={onContinue}
          className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xl rounded-xl transition-all shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7)] hover:scale-105"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
