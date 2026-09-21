'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['quiz-questions'],
    queryFn: () => api.quiz.getQuestions(),
  });

  const handleAnswer = (value: number) => {
    const currentQ = questions[currentIndex];
    const newAnswers = [...answers, { questionId: currentQ.id, value }];
    
    if (currentIndex < questions.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers: any[]) => {
    setSubmitting(true);
    try {
      await api.quiz.submit({ answers: finalAnswers });
      toast.success('Quiz completed!');
      router.push('/roadmap');
    } catch (error: any) {
      toast.error('Failed to submit quiz');
      setSubmitting(false);
    }
  };

  if (isLoading || !questions) return <LoadingSpinner />;
  if (submitting) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
      <LoadingSpinner />
      <p className="mt-4 text-primary-400 font-medium">Analyzing your responses...</p>
    </div>
  );

  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto w-full p-4 h-[calc(100vh-64px)] flex flex-col pt-12">
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <div className="h-2 w-full bg-gray-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex flex-col"
          >
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-6xl mb-6">{['🤔','🧐','💡','🚀','🎯'][currentIndex % 5]}</span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-12">
                {questions[currentIndex].text}
              </h2>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={() => handleAnswer(1)}
                  className="flex-1 py-4 px-6 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ThumbsDown className="w-5 h-5 text-red-400" />
                  Not really
                </button>
                <button 
                  onClick={() => handleAnswer(5)}
                  className="flex-1 py-4 px-6 bg-primary-600 hover:bg-primary-500 rounded-xl text-white font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <ThumbsUp className="w-5 h-5 text-green-400" />
                  Yes, that's me!
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
