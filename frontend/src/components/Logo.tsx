'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  className?: string;
}

export function DuniyaIcon({
  size = 32,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/duniya_ai.png"
        alt="DuniyaAI"
        className="w-full h-full object-contain"
      />
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
    sm: { iconSize: 26, text: 'text-lg', ai: 'text-lg' },
    md: { iconSize: 32, text: 'text-xl', ai: 'text-xl' },
    lg: { iconSize: 40, text: 'text-2xl', ai: 'text-2xl' },
    xl: { iconSize: 48, text: 'text-3xl', ai: 'text-3xl' },
  };

  const current = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      <DuniyaIcon
        size={current.iconSize}
        className="transition-transform duration-200 group-hover:scale-105"
      />
      {showText && (
        <div className="flex items-center tracking-tight leading-none">
          <span className={`${current.text} font-heading font-bold text-zinc-950 transition-colors`}>
            Duniya
          </span>
          <span className={`${current.ai} font-heading font-bold text-zinc-500 ml-0.5`}>
            AI
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
