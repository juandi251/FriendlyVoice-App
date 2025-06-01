'use client';

import { EcosystemCard } from '@/components/ecosystem-card';
import type { Ecosystem } from '@/types/friendly-voice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { mockEcosystems as allMockEcosystems } from '@/lib/mock-data'; // Import all mock ecosystems


export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEcosystems = allMockEcosystems.filter(eco => 
    eco.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eco.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (eco.tags && eco.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  
  const activeEcosystems = filteredEcosystems.filter(eco => eco.isActive);
  const inactiveEcosystems = filteredEcosystems.filter(eco => !eco.isActive);


  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-primary">Descubrir Ecosistemas</h1>
        <Link href="/ecosystems/create" passHref>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" /> Crear Ecosistema
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Buscar Ecosistemas por nombre, tema o etiqueta..." 
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {filteredEcosystems.length === 0 && searchTerm && (
        <p className="text-center text-muted-foreground py-8">No se encontraron ecosistemas para "{searchTerm}".</p>
      )}


      {activeEcosystems.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Activos Ahora</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeEcosystems.map((ecosystem) => (
              <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
            ))}
          </div>
        </div>
      )}
      
      {inactiveEcosystems.length > 0 && (
         <div>
          <h2 className="text-2xl font-semibold mb-4 mt-8">Otros Ecosistemas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveEcosystems.map((ecosystem) => (
              <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
            ))}
          </div>
        </div>
      )}

       {filteredEcosystems.length === 0 && !searchTerm && (
        <p className="text-center text-muted-foreground py-8">No hay ecosistemas disponibles en este momento. ¡Intenta crear uno!</p>
      )}

    </div>
  );
}
