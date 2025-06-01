// src/components/providers.tsx
// Este componente agrupa todos los Context Providers de tu aplicación.

"use client"; // Este es un Client Component ya que contiene Context Providers.

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Ya lo tenías
import { AuthProvider } from '@/contexts/auth-context';                 // Ya lo tenías
import { ThemeProvider } from "@/contexts/theme-provider";             // ¡Importa tu ThemeProvider!
import { useState } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Envuelve la aplicación con AuthProvider y ThemeProvider
    // El orden puede importar si un proveedor depende del otro.
    // Generalmente, AuthProvider va por fuera si otros proveedores
    // necesitan saber si el usuario está autenticado.
    <QueryClientProvider client={queryClient}> {/* Tu QueryClientProvider */}
      <AuthProvider> {/* Tu AuthProvider */}
        <ThemeProvider> {/* ¡Aquí está el ThemeProvider! */}
          {children} {/* Aquí se renderizan todas tus páginas y componentes */}
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
