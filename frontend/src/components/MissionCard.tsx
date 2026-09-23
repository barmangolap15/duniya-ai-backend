import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MissionCardProps {
  id: string;
  title: string;
  courseName: string;
  xpReward: number;
  completed?: boolean;
}

export default function MissionCard({ id, title, courseName, xpReward, completed = false }: MissionCardProps) {
  return (
    <Card interactive className="group relative overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-zinc-500">
              {courseName}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 border border-zinc-200 px-2 py-0.5 font-mono text-xs font-semibold text-zinc-900 tabular-nums">
              <Sparkles className="w-3 h-3 text-zinc-700" />
              +{xpReward} XP
            </span>
          </div>
          <h3 className="font-heading text-base font-semibold text-zinc-950 group-hover:text-black transition-colors line-clamp-2">
            {title}
          </h3>
        </div>

        <Link href={`/mission/${id}/`} className="block w-full">
          <Button
            variant={completed ? 'secondary' : 'default'}
            size="sm"
            className="w-full gap-1.5 text-xs font-medium"
          >
            <span>{completed ? 'Revisit mission' : 'Start mission'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
