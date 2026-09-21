'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, getRoleHomeRoute } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { LogIn, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.login({ email: email.trim(), password });
      await login(res.token);
      toast.success(`Welcome back, ${res.user.name}!`);

      // Redirect directly to the user's role-specific workbench or quiz if onboarding needed
      if (res.user.role === 'STUDENT' && res.user.quizCompleted === false) {
        router.push('/quiz');
      } else {
        const targetRoute = getRoleHomeRoute(res.user.role);
        router.push(targetRoute);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Student', email: 'student@levelup.com', color: 'border-primary-500/30 text-primary-300 bg-primary-500/10' },
    { role: 'Mentor', email: 'mentor@levelup.com', color: 'border-accent-500/30 text-accent-300 bg-accent-500/10' },
    { role: 'Parent', email: 'parent@levelup.com', color: 'border-rose-500/30 text-rose-300 bg-rose-500/10' },
    { role: 'Recruiter', email: 'recruiter@levelup.com', color: 'border-blue-500/30 text-blue-300 bg-blue-500/10' },
  ];

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('12345678');
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
      <div className="text-center mb-6 space-y-2">
        <div className="flex justify-center mb-2">
          <Logo size="md" href="/" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Your Account</h2>
        <p className="text-xs text-gray-400">
          Access your personalized workspace based on your role
        </p>
      </div>

      {/* Quick Demo Fill Buttons */}
      <div className="mb-6 p-3 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-1">
          <span className="flex items-center gap-1.5 text-primary-400">
            <Sparkles className="w-3.5 h-3.5" />
            Quick Demo Accounts (Password: 12345678)
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {demoAccounts.map((d) => (
            <button
              key={d.role}
              type="button"
              onClick={() => fillDemo(d.email)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all hover:scale-105 text-center ${d.color} ${
                email === d.email ? 'ring-2 ring-primary-400' : ''
              }`}
            >
              {d.role}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
          <input
            type="email"
            required
            placeholder="student@levelup.com"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 hover:scale-[1.01] active:scale-98 text-sm"
        >
          {loading ? (
            'Authenticating...'
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-400 text-xs">
        Don't have an account?{' '}
        <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-semibold underline">
          Create an account
        </Link>
      </div>
    </div>
  );
}
