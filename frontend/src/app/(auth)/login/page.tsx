'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, getRoleHomeRoute } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { ArrowRight, Sparkles, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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

      if (res.user.role === 'STUDENT' && res.user.quizCompleted === false) {
        router.push('/quiz');
      } else {
        const targetRoute = getRoleHomeRoute(res.user.role);
        router.push(targetRoute);
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { role: 'Student', email: 'student@levelup.com' },
    { role: 'Mentor', email: 'mentor@levelup.com' },
    { role: 'Parent', email: 'parent@levelup.com' },
    { role: 'Recruiter', email: 'recruiter@levelup.com' },
  ];

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('12345678');
  };

  return (
    <Card className="w-full shadow-lg border border-zinc-200 bg-white">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-xl text-zinc-950">Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials to access your dedicated workbench
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Demo Fill Buttons */}
        <div className="p-3 rounded-[10px] bg-zinc-50 border border-zinc-200 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-body text-zinc-600">
            <span className="flex items-center gap-1.5 text-zinc-900 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-zinc-900" />
              Quick Demo Logins (Password: 12345678)
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {demoAccounts.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => fillDemo(d.email)}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium border transition-all text-center ${
                  email === d.email
                    ? 'border-zinc-950 bg-zinc-950 text-white'
                    : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 hover:border-zinc-400'
                }`}
              >
                {d.role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Email address</label>
            <Input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Password</label>
            <Input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" size="default" className="w-full gap-2 mt-2" isLoading={loading}>
            Sign in <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col border-t border-zinc-200 pt-4 text-center text-xs text-zinc-500 space-y-2">
        <p>
          Don't have an account?{' '}
          <Link href="/signup" className="text-zinc-950 hover:text-black font-semibold underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
