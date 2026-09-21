'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, getRoleHomeRoute, UserRole } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { UserPlus, Sparkles, GraduationCap, Users, HeartHandshake, Briefcase, Code2, Heart } from 'lucide-react';
import Logo from '@/components/Logo';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.register({ name: name.trim(), email: email.trim(), password, role });
      await login(res.token);
      toast.success(`Account created! Welcome to DuniyaAI, ${res.user.name}.`);

      if (res.user.role === 'STUDENT') {
        router.push('/quiz');
      } else {
        const targetRoute = getRoleHomeRoute(res.user.role);
        router.push(targetRoute);
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl shadow-2xl max-w-md w-full">
      <div className="text-center mb-6 space-y-2">
        <div className="flex justify-center mb-2">
          <Logo size="md" href="/" />
        </div>
        <h2 className="text-xl font-bold text-white">Create Your Account</h2>
        <p className="text-xs text-gray-400">
          Choose your role to get your customized workspace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Role Selector */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">I am joining as a:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRole('STUDENT')}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-semibold ${
                role === 'STUDENT'
                  ? 'bg-primary-600/20 border-primary-500 text-primary-300 shadow-sm'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-850'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('MENTOR')}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-semibold ${
                role === 'MENTOR'
                  ? 'bg-accent-600/20 border-accent-500 text-accent-300 shadow-sm'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-850'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Mentor</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('PARENT')}
              className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 text-xs font-semibold ${
                role === 'PARENT'
                  ? 'bg-rose-600/20 border-rose-500 text-rose-300 shadow-sm'
                  : 'bg-gray-950 border-gray-800 text-gray-400 hover:text-white hover:bg-gray-850'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Parent</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Full Name</label>
          <input
            type="text"
            required
            placeholder="Your name"
            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
          <label className="block text-xs font-semibold text-gray-300 mb-1.5">Password (min 6 characters)</label>
          <input
            type="password"
            required
            minLength={6}
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
            'Creating your account...'
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Create Account as {role.charAt(0) + role.slice(1).toLowerCase()}</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-400 text-xs">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-400 hover:text-primary-300 font-semibold underline">
          Log in
        </Link>
      </div>
    </div>
  );
}
