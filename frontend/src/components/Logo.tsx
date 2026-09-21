import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}

export function DuniyaIcon({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]"
      >
        <defs>
          <linearGradient id="duniya-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="duniya-gradient-orbit" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="duniya-core-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id="glow-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Tech Orbit 1 */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="18"
          transform="rotate(-28 50 50)"
          stroke="url(#duniya-gradient-orbit)"
          strokeWidth="2.5"
          strokeDasharray="4 3"
          className="opacity-70"
        />

        {/* Outer Tech Orbit 2 */}
        <ellipse
          cx="50"
          cy="50"
          rx="44"
          ry="18"
          transform="rotate(38 50 50)"
          stroke="url(#duniya-gradient-primary)"
          strokeWidth="2.5"
          className="opacity-80"
        />

        {/* Central Core Sphere (The "Duniya" Globe) */}
        <circle
          cx="50"
          cy="50"
          r="26"
          fill="#090d16"
          stroke="url(#duniya-core-glow)"
          strokeWidth="3.5"
        />

        {/* Internal Neural Latitude / Longitude lines */}
        <path
          d="M 50 24 C 36 34, 36 66, 50 76"
          stroke="url(#duniya-gradient-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-80"
        />
        <path
          d="M 50 24 C 64 34, 64 66, 50 76"
          stroke="url(#duniya-gradient-orbit)"
          strokeWidth="2"
          strokeLinecap="round"
          className="opacity-80"
        />
        <line
          x1="24"
          y1="50"
          x2="76"
          y2="50"
          stroke="url(#duniya-gradient-primary)"
          strokeWidth="2"
          strokeDasharray="2 2"
          className="opacity-60"
        />

        {/* AI Center Node (Nucleus) */}
        <circle cx="50" cy="50" r="7" fill="url(#duniya-gradient-orbit)" filter="url(#glow-blur)" />
        <circle cx="50" cy="50" r="3.5" fill="#ffffff" />

        {/* Orbit Satellite Nodes */}
        <circle cx="86" cy="36" r="4.5" fill="#38bdf8" filter="url(#glow-blur)" />
        <circle cx="14" cy="64" r="3.5" fill="#ec4899" filter="url(#glow-blur)" />
        <circle cx="70" cy="80" r="3" fill="#a855f7" />
      </svg>
    </div>
  );
}

export default function Logo({
  size = 'md',
  showText = true,
  href,
  className = '',
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 'w-6 h-6', text: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5' },
    md: { icon: 'w-8 h-8', text: 'text-2xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 'w-10 h-10', text: 'text-3xl', badge: 'text-xs px-2.5 py-0.5' },
    xl: { icon: 'w-12 h-12', text: 'text-4xl', badge: 'text-sm px-3 py-1' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <DuniyaIcon className={`${currentSize.icon} group-hover:scale-105 transition-transform duration-300`} />
      {showText && (
        <div className="flex items-center tracking-tight">
          <span className={`${currentSize.text} font-black text-white group-hover:text-gray-100 transition-colors`}>
            Duniya
          </span>
          <span
            className={`${currentSize.text} font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-pink-400 animate-gradient-x ml-0.5`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
}
