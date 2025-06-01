'use client';

import { useState, useRef, useCallback } from 'react';

type RecordingStatus = 'idle' | 'recording' | 'stopped' | 'error';

interface AudioRecorderControls {
  status: RecordingStatus;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  audioDataUri: string | null;
  error: string | null;
  reset: () => void;
}

export function useAudioRecorder(): AudioRecorderControls {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    if (status === 'recording') return;
    setError(null);
    setAudioDataUri(null);
    audioChunksRef.current = [];
    setStatus('recording');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Common format, adjust if needed
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioDataUri(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        setStatus('stopped');
        // Stop all tracks on the stream to turn off the microphone light/indicator
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Error durante la grabación.');
        setStatus('error');
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(err instanceof Error ? err.message : 'No se pudo acceder al micrófono. Por favor, revisa los permisos.');
      setStatus('error');
    }
  }, [status]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.stop();
      // Tracks are stopped in onstop to ensure data is processed
    }
  }, [status]);

  const reset = useCallback(() => {
    setStatus('idle');
    setAudioDataUri(null);
    setError(null);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    mediaRecorderRef.current = null;
  }, []);

  return { status, startRecording, stopRecording, audioDataUri, error, reset };
}
