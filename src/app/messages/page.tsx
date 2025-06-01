// src/app/messages/page.tsx
'use client';

import { useAuth } from '@/contexts/auth-context';
import type { User } from '@/types/friendly-voice';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquarePlus, Users, Loader2, LogIn } from 'lucide-react';

export default function MessagesPage() {
  const { user, loading, getMutualFollows } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center p-4">
        <Users className="w-24 h-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Inicia Sesión para Chatear</h2>
        <p className="text-muted-foreground mb-6">Conéctate con tus Voces Amigas enviando mensajes de voz.</p>
        <Button asChild>
          <Link href="/login"><LogIn className="mr-2 h-4 w-4"/> Iniciar Sesión</Link>
        </Button>
      </div>
    );
  }

  const mutualFollows = getMutualFollows();

  return (
    <div className="container mx-auto max-w-md py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-primary flex items-center">
            <MessageSquarePlus className="mr-3 h-7 w-7" /> Mensajes Directos
          </CardTitle>
          <CardDescription>Comunícate con tus Voces Amigas.</CardDescription>
        </CardHeader>
        <CardContent>
          {mutualFollows.length > 0 ? (
            <div className="space-y-4">
              {mutualFollows.map((friend: User) => (
                <Link key={friend.id} href={`/messages/${friend.id}`} passHref>
                  <div className="flex items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={friend.avatarUrl} alt={friend.name} data-ai-hint="abstract person" />
                      <AvatarFallback>{friend.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-medium">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">Iniciar chat de voz</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Aún no tienes Voces Amigas</p>
              <p className="text-sm text-muted-foreground">
                Sigue a otros usuarios y espera a que te sigan de vuelta para poder enviarles mensajes.
              </p>
              <Button variant="link" asChild className="mt-4">
                <Link href="/discover">Descubrir Ecosistemas y Personas</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
