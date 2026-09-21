import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DuniyaAI - AI-Powered Learning & Career Platform',
  description: 'Learn by building real-world projects with DuniyaAI verified code mentorship',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white min-h-screen antialiased selection:bg-primary-500/30`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
