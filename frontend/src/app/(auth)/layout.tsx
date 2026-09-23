import Logo from '@/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10 space-y-6">
        <div className="flex justify-center">
          <Logo size="lg" href="/" />
        </div>
        {children}
      </div>
    </div>
  );
}
