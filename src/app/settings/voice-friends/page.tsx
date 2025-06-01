// src/app/settings/voice-friends/page.tsx
// Esta página gestiona tus VozNotas y opciones de voz.

"use client";

import Link from 'next/link';
import { ChevronLeft, Volume2, Mic, Settings2 } from 'lucide-react'; // Iconos relevantes

export default function VoiceFriendsPage() {
  // Datos de ejemplo para VozNotas (audios)
  const userVoiceNotes = [
    { id: 'v1', title: 'Mi Voz de Presentación', duration: '0:15', date: '2025-05-20', url: '#' },
    { id: 'v2', title: 'Saludo Amigable', duration: '0:10', date: '2025-05-18', url: '#' },
    { id: 'v3', title: 'Reflexión Diaria', duration: '0:30', date: '2025-05-15', url: '#' },
  ];

  const handlePlayAudio = (url: string) => {
    // alert(`Reproduciendo audio: ${url}`);
    console.log(`Reproduciendo audio: ${url}`);
    // Aquí iría la lógica para reproducir el audio
  };

  const handleEditAudio = (id: string) => {
    // alert(`Editando audio: ${id}`);
    console.log(`Editando audio: ${id}`);
    // Aquí iría la lógica para editar el audio (cambiar voz, efectos, etc.)
  };

  const handleDeleteAudio = (id: string) => {
    // alert(`Eliminando audio: ${id}`);
    console.log(`Eliminando audio: ${id}`);
    // Aquí iría la lógica para eliminar el audio (con confirmación)
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      {/* Encabezado de la página */}
      <header className="p-4 shadow-md bg-card text-card-foreground mb-6">
        <div className="container mx-auto flex items-center gap-4">
          <Link href="/profile" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
            <ChevronLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Gestionar Voces Amigas</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 max-w-2xl space-y-8">
        {/* Sección: Mis VozNotas */}
        <section className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Mis VozNotas</h2>
          {userVoiceNotes.length > 0 ? (
            <div className="space-y-4">
              {userVoiceNotes.map((voiceNote) => (
                <div key={voiceNote.id} className="flex items-center justify-between p-3 rounded-md bg-muted">
                  <div className="flex items-center gap-3">
                    <Volume2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{voiceNote.title}</p>
                      <p className="text-sm text-muted-foreground">{voiceNote.duration} - {voiceNote.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePlayAudio(voiceNote.url)}
                      className="px-3 py-1 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300 text-sm"
                    >
                      Reproducir
                    </button>
                    <button
                      onClick={() => handleEditAudio(voiceNote.id)}
                      className="px-3 py-1 rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity duration-300 text-sm"
                    >
                      Editar Voz
                    </button>
                    <button
                      onClick={() => handleDeleteAudio(voiceNote.id)}
                      className="px-3 py-1 rounded-md bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity duration-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">Aún no tienes VozNotas publicadas.</p>
          )}
          <div className="mt-6 text-center">
            <Link href="/record-voice" className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity duration-300">
              <Mic className="mr-2 h-5 w-5" /> Grabar Nueva VozNota
            </Link>
          </div>
        </section>

        {/* Sección: Opciones de Voz (para cambiar la voz de mis audios y seleccionar entre una variedad) */}
        <section className="bg-card p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Opciones de Voz</h2>
          <div className="space-y-4">
            {/* Opción: Seleccionar Tipo de Voz por Defecto */}
            <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-border">
              <span className="text-lg">Voz por Defecto para Grabaciones</span>
              <select className="px-3 py-1 rounded-md bg-input text-foreground border border-border">
                <option value="original">Mi Voz Original</option>
                <option value="pitch-shift">Voz Aguda</option>
                <option value="robot">Voz de Robot</option>
                <option value="echo">Voz con Eco</option>
                {/* Más opciones de voz aquí */}
              </select>
            </div>
            <p className="text-muted-foreground text-sm">
              Elige el efecto de voz que se aplicará a tus nuevas grabaciones.
            </p>

            {/* Opción: Gestionar Amigos Bloqueados/Silenciados (si aplica aquí o en Privacidad) */}
            <div className="flex items-center justify-between py-2 border-b last:border-b-0 border-border">
              <span className="text-lg">Amigos Bloqueados/Silenciados</span>
              <button
                // onClick={() => alert('Gestionar amigos bloqueados/silenciados por implementar')}
                className="px-4 py-2 rounded-md bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity duration-300"
              >
                Ver Lista
              </button>
            </div>
            <p className="text-muted-foreground text-sm">
              Administra las voces de amigos que has bloqueado o silenciado.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
