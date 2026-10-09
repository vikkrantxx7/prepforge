import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/shared/lib/AuthProvider';
import { cn } from '@/shared/lib/utils';
import { Navbar } from '@/widgets/navbar/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'PrepForge',
  description: 'Personalized interview preparation for software engineers',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body>
        <AuthProvider>
          <Navbar>
            <Navbar.Logo />
            <Navbar.Links />
            <div className="flex items-center gap-2">
              <Navbar.Actions />
              <Navbar.Profile />
            </div>
          </Navbar>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
