'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';
import Link from 'next/link';
import { CheckCircle2, Lock, ArrowRight } from 'lucide-react';

export default function RoadmapPage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['auth-me'],
    queryFn: () => api.auth.me(),
  });

  if (isLoading || !user) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto w-full p-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <span className="px-4 py-1.5 bg-primary-900/50 text-primary-400 rounded-full text-sm font-semibold tracking-wide uppercase border border-primary-500/20 mb-4 inline-block">
          Your Result
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          You are a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-500">{user.track?.name || 'Frontend Developer'}</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {user.track?.description || 'Based on your answers, you have a keen eye for design and enjoy building interactive user experiences.'}
        </p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[39px] top-4 bottom-4 w-0.5 bg-gray-800" />
        
        <div className="space-y-8 relative z-10">
          {(user.track?.courses || []).map((course: any, index: number) => {
            const isUnlocked = index === 0; // Simplified logic, real app would check completion
            return (
              <motion.div 
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="flex gap-6"
              >
                <div className={`w-20 h-20 shrink-0 rounded-2xl flex items-center justify-center border-4 border-gray-950 ${isUnlocked ? 'bg-primary-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-gray-800 text-gray-500'}`}>
                  {isUnlocked ? <CheckCircle2 className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                </div>
                
                <div className={`flex-1 bg-gray-900 border border-gray-800 rounded-2xl p-6 ${!isUnlocked && 'opacity-60'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{course.title}</h3>
                    <span className="text-sm font-medium text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                      {course.missions?.length || 0} Missions
                    </span>
                  </div>
                  <p className="text-gray-400 mb-4">{course.description}</p>
                  
                  {isUnlocked && (
                    <Link 
                      href="/dashboard"
                      className="inline-flex items-center text-primary-400 font-medium hover:text-primary-300"
                    >
                      Start Learning <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link 
          href="/dashboard"
          className="inline-flex px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-lg text-white font-bold text-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
