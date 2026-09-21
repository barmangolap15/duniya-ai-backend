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
    { role: 'Student', email: 'student@levelup.com', color: 'hover:border-primary-500/50 hover:bg-primary-500/10 text-primary-300' },
    { role: 'Mentor', email: 'mentor@levelup.com', color: 'hover:border-accent-500/50 hover:bg-accent-500/10 text-accent-300' },
    { role: 'Parent', email: 'parent@levelup.com', color: 'hover:border-gold-500/50 hover:bg-gold-500/10 text-gold-400' },
    { role: 'Recruiter', email: 'recruiter@levelup.com', color: 'hover:border-danger-500/50 hover:bg-danger-500/10 text-danger-400' },
  ];

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('12345678');
  };

  return (
    <Card className="w-full shadow-2xl border-border-dark bg-surface-dark">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-xl">Sign in to your account</CardTitle>
        <CardDescription>
          Enter your credentials to access your dedicated workbench
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quick Demo Fill Buttons */}
        <div className="p-3 rounded-[10px] bg-night border border-border-dark space-y-2">
          <div className="flex items-center justify-between text-[11px] font-body text-slate-400">
            <span className="flex items-center gap-1.5 text-primary-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Quick Demo Logins (Password: 12345678)
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {demoAccounts.map((d) => (
              <button
                key={d.role}
                type="button"
                onClick={() => fillDemo(d.email)}
                className={`py-1.5 px-2 rounded-md text-[11px] font-medium border border-border-dark bg-surface-dark transition-all text-center ${d.color} ${
                  email === d.email ? 'border-primary-500 ring-1 ring-primary-500' : ''
                }`}
              >
                {d.role}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Email address</label>
            <Input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Password</label>
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

      <CardFooter className="flex flex-col border-t border-border-dark pt-4 text-center text-xs text-slate-400 space-y-2">
        <p>
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary-400 hover:text-primary-300 font-medium underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
