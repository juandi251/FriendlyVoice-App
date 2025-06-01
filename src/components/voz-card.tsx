// src/components/voz-card.tsx
'use client';

import type { Voz } from '@/types/friendly-voice';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale'; // Import Spanish locale
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface VozCardProps {
  voz: Voz;
  onLikeToggle: (vozId: string) => void;
  onOpenComments: (vozId: string) => void; 
}

export function VozCard({ voz, onLikeToggle, onOpenComments }: VozCardProps) {
  const { toast } = useToast();
  const [showFullCaption, setShowFullCaption] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(voz.createdAt), { addSuffix: true, locale: es });

  const toggleCaption = () => {
    setShowFullCaption(!showFullCaption);
  };
  
  const captionDisplay = voz.caption ? (
    showFullCaption || voz.caption.length <= 150 
      ? voz.caption 
      : `${voz.caption.substring(0, 150)}...`
  ) : null;


  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Link href={`/profile/${voz.userId}`} passHref>
          <Avatar className="cursor-pointer">
            <AvatarImage src={voz.userAvatarUrl} alt={voz.userName} data-ai-hint="abstract person" />
            <AvatarFallback>{voz.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-grow">
          <Link href={`/profile/${voz.userId}`} passHref>
            <p className="font-semibold text-sm hover:underline cursor-pointer">{voz.userName}</p>
          </Link>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Más opciones</span>
        </Button>
      </CardHeader>
      <CardContent className="pb-4 space-y-3">
        {captionDisplay && (
          <p className="text-sm whitespace-pre-line">
            {captionDisplay}
            {voz.caption && voz.caption.length > 150 && (
              <Button variant="link" size="sm" onClick={toggleCaption} className="p-0 h-auto ml-1 text-primary">
                {showFullCaption ? 'Ver menos' : 'Ver más'}
              </Button>
            )}
          </p>
        )}
        <audio controls src={voz.audioUrl} className="w-full h-10 rounded-md">
          Tu navegador no soporta el elemento de audio.
        </audio>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0 border-t pt-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn("text-muted-foreground hover:text-primary", voz.isLiked && "text-destructive hover:text-destructive/90")}
          onClick={() => onLikeToggle(voz.id)}
        >
          <Heart className={cn("mr-2 h-5 w-5", voz.isLiked && "fill-destructive")} /> {voz.likesCount} Me gusta
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-muted-foreground hover:text-primary" 
          onClick={() => onOpenComments(voz.id)}
        >
          <MessageCircle className="mr-2 h-5 w-5" /> {voz.commentsCount} Comentarios
        </Button>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => toast({ title: "Compartir", description: "La función de compartir está en desarrollo."})}>
          <Send className="mr-2 h-5 w-5" /> Compartir
        </Button>
      </CardFooter>
    </Card>
  );
}
