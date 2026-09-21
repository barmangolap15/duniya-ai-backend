import Logo from '@/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-3xl" />
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <Logo size="lg" href="/" />
        </div>
        {children}
      </div>
    </div>
  );
}
