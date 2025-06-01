// src/components/layout/tab-bar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Bell, User, MicVocal, MessageSquare } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/discover', label: 'Ecosistemas', icon: LayoutGrid },
  { href: '/feed', label: 'Feed', icon: MicVocal },
  { href: '/messages', label: 'Mensajes', icon: MessageSquare },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
  { href: '/profile', label: 'Perfil', icon: User },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          let isActive = pathname === item.href;
          // More specific active states for routes with children
          if (item.href === '/discover') {
            isActive = pathname === '/discover' || pathname === '/' || pathname.startsWith('/ecosystems/');
          } else if (item.href === '/feed') {
            isActive = pathname.startsWith('/feed');
          } else if (item.href === '/messages') {
            isActive = pathname.startsWith('/messages');
          } else if (item.href === '/notifications') {
            isActive = pathname.startsWith('/notifications');
          } else if (item.href === '/profile') {
            isActive = pathname.startsWith('/profile');
          }
          
          return (
            <Link key={item.label} href={item.href} passHref>
              <div className={cn(
                "flex flex-col items-center justify-center p-2 rounded-md transition-colors w-1/5", // Adjusted to w-1/5 for 5 items
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}>
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
