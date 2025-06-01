import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { TabBar } from '@/components/layout/tab-bar';
import { Providers } from '@/components/providers';


export const metadata: Metadata = {
  title: 'FriendlyVoice',
  description: 'Conectando Personalidades, Amplificando Voces',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className={`font-sans antialiased flex flex-col min-h-screen bg-background text-foreground`}>
        <Providers>
          <SiteHeader />
          {/* Apply pb-20 for mobile (tab bar) and pb-8 for larger screens */}
          <main className="flex-grow container mx-auto px-0 sm:px-4 py-0 sm:py-8 pb-20 md:pb-8">
            {children}
          </main>
          <TabBar />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
