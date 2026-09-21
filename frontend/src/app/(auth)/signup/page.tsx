'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth, getRoleHomeRoute, UserRole } from '@/lib/auth-context';
import toast from 'react-hot-toast';
import { ArrowRight, Code2, Eye, Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

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
      toast.success(`Welcome to DuniyaAI, ${res.user.name}!`);

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

  const roleOptions = [
    {
      id: 'STUDENT' as UserRole,
      label: 'Student',
      icon: Code2,
      activeClass: 'border-primary-500 bg-primary-500/10 text-primary-300 ring-1 ring-primary-500',
    },
    {
      id: 'MENTOR' as UserRole,
      label: 'Mentor',
      icon: Eye,
      activeClass: 'border-accent-500 bg-accent-500/10 text-accent-300 ring-1 ring-accent-500',
    },
    {
      id: 'PARENT' as UserRole,
      label: 'Parent',
      icon: Heart,
      activeClass: 'border-gold-500 bg-gold-500/10 text-gold-400 ring-1 ring-gold-500',
    },
    {
      id: 'RECRUITER' as UserRole,
      label: 'Recruiter',
      icon: Search,
      activeClass: 'border-danger-500 bg-danger-500/10 text-danger-400 ring-1 ring-danger-500',
    },
  ];

  return (
    <Card className="w-full shadow-2xl border-border-dark bg-surface-dark">
      <CardHeader className="text-center space-y-1">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Select your role to configure your dedicated workspace
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Role Selector Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-300">I am joining as a</label>
          <div className="grid grid-cols-4 gap-2">
            {roleOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = role === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRole(opt.id)}
                  className={`p-2.5 rounded-[10px] border text-center transition-all flex flex-col items-center gap-1.5 text-xs font-medium select-none ${
                    isSelected
                      ? opt.activeClass
                      : 'border-border-dark bg-night text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Full name</label>
            <Input
              type="text"
              required
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

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
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" size="default" className="w-full gap-2 mt-2" isLoading={loading}>
            Create {role.toLowerCase()} account <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col border-t border-border-dark pt-4 text-center text-xs text-slate-400 space-y-2">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
