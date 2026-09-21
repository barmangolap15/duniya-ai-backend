import Link from 'next/link';
import { Target, ArrowRight } from 'lucide-react';

interface MissionCardProps {
  id: string;
  title: string;
  courseName: string;
  xpReward: number;
}

export default function MissionCard({ id, title, courseName, xpReward }: MissionCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary-500/50 transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full group-hover:bg-primary-500/20 transition-all" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-2 block">{courseName}</span>
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <div className="flex items-center text-xp font-medium">
            <Target className="w-4 h-4 mr-1" />
            +{xpReward} XP
          </div>
        </div>
      </div>
      
      <div className="mt-6 relative z-10">
        <a 
          href={`/mission/${id}/`}
          className="flex items-center justify-center w-full py-2 bg-gray-800 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium group-hover:bg-primary-600"
        >
          Start Mission
          <ArrowRight className="w-4 h-4 ml-2" />
        </a>
      </div>
    </div>
  );
}
