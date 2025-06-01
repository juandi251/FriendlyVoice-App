// src/app/messages/[userId]/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import type { User, Message as DirectMessage } from '@/types/friendly-voice';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VoiceMessageItem } from '@/components/voice-message-item';
import { VoiceMessageInput } from '@/components/voice-message-input';
import { ArrowLeft, Loader2, UserX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser, loading: authLoading, getUserById, getDirectMessages, sendDirectMessage } = useAuth();
  const { toast } = useToast();
  
  const chatPartnerId = typeof params.userId === 'string' ? params.userId : undefined;
  const [chatPartner, setChatPartner] = useState<User | null>(null);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(true);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatPartnerId && currentUser) {
      const partner = getUserById(chatPartnerId);
      if (partner) {
        setChatPartner(partner);
        const fetchedMessages = getDirectMessages(chatPartnerId);
        setMessages(fetchedMessages);
      } else {
        toast({ title: "Error", description: "Usuario no encontrado.", variant: "destructive" });
        router.push('/messages');
      }
      setIsLoadingChat(false);
    } else if (!authLoading && !currentUser) {
      router.push('/login');
    }
  }, [chatPartnerId, currentUser, authLoading, getUserById, getDirectMessages, router, toast]);
  
  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  }, [messages]);


  const handleSendMessage = async (voiceDataUri: string) => {
    if (!currentUser || !chatPartner) return;
    try {
      await sendDirectMessage(chatPartner.id, voiceDataUri);
      // Re-fetch messages to include the new one
      const updatedMessages = getDirectMessages(chatPartner.id);
      setMessages(updatedMessages);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo enviar el mensaje.", variant: "destructive" });
    }
  };

  if (authLoading || isLoadingChat) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!chatPartner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)] text-center p-4">
        <UserX className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Chat no disponible</h2>
        <p className="text-muted-foreground mb-6">No se pudo cargar la información del chat.</p>
        <Button onClick={() => router.push('/messages')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Mensajes
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-var(--site-header-height,4rem)-var(--tab-bar-height,4rem))] md:h-[calc(100vh-var(--site-header-height,4rem))] bg-background">
      {/* Header */}
      <div className="flex items-center p-3 border-b bg-card shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.push('/messages')} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Link href={`/profile/${chatPartner.id}`} className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <Avatar className="h-9 w-9">
            <AvatarImage src={chatPartner.avatarUrl} alt={chatPartner.name} data-ai-hint="abstract person" />
            <AvatarFallback>{chatPartner.name.substring(0,1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm">{chatPartner.name}</span>
        </Link>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Aún no hay mensajes. ¡Envía el primero!
          </p>
        ) : (
          messages.map(msg => (
            <VoiceMessageItem 
              key={msg.id} 
              message={msg} 
              sender={msg.senderId === chatPartner.id ? chatPartner : undefined}
              isCurrentUserSender={msg.senderId === currentUser?.id}
            />
          ))
        )}
      </ScrollArea>

      {/* Input Area */}
      <VoiceMessageInput onSendMessage={handleSendMessage} />
      
      {/* CSS Variables for header/tab bar height for h-screen calculation */}
      <style jsx global>{`
        :root {
          --site-header-height: 4rem; /* Adjust if your header height is different */
          --tab-bar-height: 4rem; /* Adjust if your tab bar height is different */
        }
      `}</style>
    </div>
  );
}
