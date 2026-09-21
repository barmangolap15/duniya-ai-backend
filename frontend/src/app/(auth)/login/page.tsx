'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, getRoleHomeRoute } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { LogIn, Sparkles } from 'lucide-react';

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

      // Redirect directly to the user's role-specific workbench
      const targetRoute = getRoleHomeRoute(res.user.role);
      router.push(targetRoute);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
      <div className="text-center mb-8 space-y-2">
        <Link
          href="/"
          className="inline-block text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500"
        >
          LevelUp
        </Link>
        <h2 className="text-xl font-bold text-white">Sign In to Your Account</h2>
        <p className="text-xs text-gray-400">
          Access your personalized workspace based on your role
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Email Address</label>
          <input
            type="email"
            required
            placeholder="you@domain.com"
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
