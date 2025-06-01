import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RadioTower } from 'lucide-react';

export default function CreateEcosystemPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] text-center">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">Crear un Nuevo Ecosistema</CardTitle>
          <CardDescription>Da vida a tu propia sala de chat de audio temática.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 p-8">
          <RadioTower className="w-24 h-24 text-muted-foreground" />
          <p className="text-lg font-medium">Creación de Ecosistemas</p>
          <p className="text-muted-foreground">
            Esta función está en desarrollo. Pronto podrás configurar y lanzar tus propios Ecosistemas para conectar con otros.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Volver a Descubrir</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
