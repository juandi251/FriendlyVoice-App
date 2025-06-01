// src/components/create-voz-form.tsx
'use client';

import type { Voz } from '@/types/friendly-voice';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, Send, Loader2, RotateCcw, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/use-audio-recorder';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

interface CreateVozFormProps {
  onVozCreated: (newVoz: Voz) => void;
}

export function CreateVozForm({ onVozCreated }: CreateVozFormProps) {
  const { user } = useAuth();
  const { status, startRecording, stopRecording, audioDataUri, error: recorderError, reset: resetRecorder } = useAudioRecorder();
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!audioDataUri) {
      toast({ title: 'Error', description: 'Por favor, graba tu voz primero.', variant: 'destructive' });
      return;
    }
    if (!user) {
      toast({ title: 'Error', description: 'Debes iniciar sesión para publicar.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newVoz: Voz = {
      id: `voz-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      userId: user.id,
      userName: user.name,
      userAvatarUrl: user.avatarUrl,
      audioUrl: audioDataUri,
      caption: caption || undefined,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString(),
      isLiked: false,
    };

    onVozCreated(newVoz);
    toast({ title: '¡Voz Publicada!', description: 'Tu voz ha sido compartida con la comunidad.' });
    
    // Reset form
    setCaption('');
    resetRecorder();
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full shadow-lg mb-8">
      <CardHeader>
        <CardTitle className="text-xl text-primary">Crear una Nueva Voz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Escribe un mensaje para acompañar tu voz (opcional)..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          disabled={isSubmitting || status === 'recording'}
        />

        <div className="flex flex-col items-center space-y-3">
          <div className="flex space-x-2">
            {status === 'idle' || status === 'stopped' || status === 'error' ? (
              <Button onClick={startRecording} disabled={isSubmitting} variant="outline">
                <Mic className="mr-2" /> Grabar Voz
              </Button>
            ) : null}
            {status === 'recording' ? (
              <Button onClick={stopRecording} disabled={isSubmitting} variant="destructive">
                <StopCircle className="mr-2" /> Detener Grabación
              </Button>
            ) : null}
          </div>
          {status === 'recording' && (
            <p className="text-sm text-accent animate-pulse">Grabando...</p>
          )}
        </div>

        {audioDataUri && status === 'stopped' && (
          <div className="p-3 bg-muted rounded-md text-center space-y-2">
            <CheckCircle className="mx-auto h-6 w-6 text-green-500" />
            <p className="text-sm font-medium">¡Grabación lista!</p>
            <audio src={audioDataUri} controls className="w-full h-10" />
            <Button onClick={() => { resetRecorder(); setCaption('');}} variant="ghost" size="sm" disabled={isSubmitting}>
              <RotateCcw className="mr-2 h-4 w-4" /> Grabar de Nuevo / Borrar
            </Button>
          </div>
        )}
        
        {recorderError && (
          <div className="p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm flex items-center">
            <AlertTriangle className="mr-2 h-4 w-4" /> {recorderError}
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting || !audioDataUri || status === 'recording'} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 animate-spin" /> : <Send className="mr-2" />}
          Publicar Voz
        </Button>
      </CardFooter>
    </Card>
  );
}
