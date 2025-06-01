// src/app/feed/page.tsx
'use client';

import { useState, useEffect } from 'react';
import type { Voz, VozComment, User } from '@/types/friendly-voice';
import { CreateVozForm } from '@/components/create-voz-form';
import { VozCard } from '@/components/voz-card';
import { CommentModal } from '@/components/comment-modal';
import { useAuth } from '@/contexts/auth-context';
import { Loader2, Users, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { initialMockVoces as allMockVoces } from '@/lib/mock-data'; // Import all mock voces
import { useToast } from '@/hooks/use-toast';

export default function FeedPage() {
  const { user, loading: authLoading, getUserById } = useAuth();
  const { toast } = useToast();
  const [voces, setVoces] = useState<Voz[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);

  const [selectedVozForComments, setSelectedVozForComments] = useState<Voz | null>(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  useEffect(() => {
    setIsLoadingFeed(true);
    // Simulate fetching feed data
    setTimeout(() => {
      let feedVoces = [...allMockVoces]; // Make a mutable copy

      if (user && user.following && user.following.length > 0) {
        // Prioritize voces from followed users or filter by them
        // For this demo, we'll sort: followed users' voces first, then others
        feedVoces.sort((a, b) => {
          const aIsFollowed = user.following!.includes(a.userId);
          const bIsFollowed = user.following!.includes(b.userId);
          if (aIsFollowed && !bIsFollowed) return -1;
          if (!aIsFollowed && bIsFollowed) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Then by date
        });
      } else {
        // Default sort by date if not logged in or not following anyone
        feedVoces.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      setVoces(feedVoces);
      setIsLoadingFeed(false);
    }, 1000);
  }, [user]); // Re-fetch/re-sort when user (and thus their following list) changes

  const handleVozCreated = (newVoz: Voz) => {
    setVoces(prevVoces => [newVoz, ...prevVoces]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())); // Re-sort after adding
      // Re-apply following sort if needed
      if (user && user.following && user.following.length > 0) {
         setVoces(prevVoces => [...prevVoces].sort((a,b) => {
             const aIsFollowed = user.following!.includes(a.userId);
             const bIsFollowed = user.following!.includes(b.userId);
             if (aIsFollowed && !bIsFollowed) return -1;
             if (!aIsFollowed && bIsFollowed) return 1;
             return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
         }));
      }
  };

  const handleLikeToggle = (vozId: string) => {
    setVoces(prevVoces =>
      prevVoces.map(v =>
        v.id === vozId
          ? { ...v, isLiked: !v.isLiked, likesCount: v.isLiked ? v.likesCount - 1 : v.likesCount + 1 }
          : v
      )
    );
  };

  const handleOpenComments = (vozId: string) => {
    const voz = voces.find(v => v.id === vozId);
    if (voz) {
      setSelectedVozForComments(voz);
      setIsCommentModalOpen(true);
    }
  };

  const handleAddComment = async (vozId: string, text: string): Promise<void> => {
    if (!user) {
      toast({ title: 'Error', description: 'Debes iniciar sesión para comentar.', variant: 'destructive'});
      return Promise.reject("User not logged in");
    }
    // Simulate API call for adding comment
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newComment: VozComment = {
      id: `comment-${Date.now()}`,
      vozId,
      userId: user.id,
      userName: user.name,
      userAvatarUrl: user.avatarUrl,
      text,
      createdAt: new Date().toISOString(),
    };

    setVoces(prevVoces =>
      prevVoces.map(v =>
        v.id === vozId
          ? { 
              ...v, 
              comments: [...(v.comments || []), newComment],
              commentsCount: (v.commentsCount || 0) + 1,
            }
          : v
      )
    );
    // Update selectedVozForComments if it's the one being commented on
    setSelectedVozForComments(prevSelected => 
      prevSelected && prevSelected.id === vozId 
      ? { ...prevSelected, comments: [...(prevSelected.comments || []), newComment], commentsCount: (prevSelected.commentsCount || 0) + 1 } 
      : prevSelected
    );
    toast({ title: 'Comentario Añadido', description: 'Tu comentario ha sido publicado.' });
    return Promise.resolve();
  };


  if (authLoading) {
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
        <h2 className="text-2xl font-semibold mb-2">Únete a la Conversación</h2>
        <p className="text-muted-foreground mb-6">Inicia sesión o crea una cuenta para ver y compartir voces.</p>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/signup">Registrarse</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6 flex items-center">
        <Rss className="mr-3 h-8 w-8" /> Voces Recientes
      </h1>
      
      <CreateVozForm onVozCreated={handleVozCreated} />

      {isLoadingFeed && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Cargando voces...</p>
        </div>
      )}

      {!isLoadingFeed && voces.length === 0 && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">Aún no hay voces. ¡Sé el primero en publicar o sigue a otros usuarios!</p>
        </div>
      )}

      {!isLoadingFeed && voces.length > 0 && (
        <div className="space-y-6">
          {voces.map(voz => (
            <VozCard key={voz.id} voz={voz} onLikeToggle={handleLikeToggle} onOpenComments={handleOpenComments} />
          ))}
        </div>
      )}

      {selectedVozForComments && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          voz={selectedVozForComments}
          comments={selectedVozForComments.comments || []}
          onAddComment={handleAddComment}
          currentUser={user}
        />
      )}
    </div>
  );
}
