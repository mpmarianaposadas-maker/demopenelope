import { useState } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { FolderOpen, Wrench, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatRupeco, AsistenteRupecoTAD } from '../chat';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAgente } from '@/contexts/AgenteContext';

export function PanelDemoInteractiva() {
  const { t } = useLanguage();
  const { agenteNombre, setAgenteNombre } = useAgente();
  const [inputNombre, setInputNombre] = useState('');

  const handleConfirmar = () => {
    const nombre = inputNombre.trim();
    if (nombre.length >= 2) {
      setAgenteNombre(nombre);
    }
  };

  // Si no hay agente, mostrar login simulado
  if (!agenteNombre) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <CardTitle>{t('demo.title')}</CardTitle>
            <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50">
              Caso simulado — Datos demostrativos
            </Badge>
          </div>
          <CardText>{t('demo.intro1')}</CardText>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Identificación del agente</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Ingrese su nombre y apellido para iniciar la sesión de verificación. Este dato se registrará en el Prompt Net Ledger para garantizar la trazabilidad de cada intervención.
          </p>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <label htmlFor="agente-nombre" className="text-xs font-medium text-foreground mb-1 block">
                Nombre y apellido del agente
              </label>
              <Input
                id="agente-nombre"
                placeholder="Ej.: López, María"
                value={inputNombre}
                onChange={(e) => setInputNombre(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmar()}
                className="text-sm"
              />
            </div>
            <Button
              onClick={handleConfirmar}
              disabled={inputNombre.trim().length < 2}
              size="sm"
            >
              Iniciar sesión
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            Mínimo 2 caracteres. El nombre se asociará a todas las acciones de esta sesión.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
          <CardTitle>{t('demo.title')}</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-[10px] border-green-300 text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800">
              <User className="h-3 w-3 mr-1 inline" />
              Agente: {agenteNombre}
            </Badge>
            <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 bg-amber-50">
              Caso simulado — Datos demostrativos
            </Badge>
          </div>
        </div>
        <CardText>{t('demo.intro1')}</CardText>
        <CardText>{t('demo.intro2')}</CardText>
      </Card>

      {/* Rótulos de supervisión humana */}
      <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-1.5">
        <p className="text-sm text-foreground flex items-center gap-2"><span className="text-green-600">✔</span> Revisión por analista responsable</p>
        <p className="text-sm text-foreground flex items-center gap-2"><span className="text-green-600">✔</span> Validación humana previa obligatoria</p>
        <p className="text-sm text-foreground flex items-center gap-2"><span className="text-green-600">✔</span> Firma y responsabilidad institucional</p>
      </div>

      <Tabs defaultValue="verificacion" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verificacion">
            <FolderOpen size={16} className="inline mr-1" /> Verificación Documental
          </TabsTrigger>
          <TabsTrigger value="asistente">
            <Wrench size={16} className="inline mr-1" /> Asistente RUPECO/TAD
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verificacion" className="mt-4">
          <ChatRupeco />
        </TabsContent>
        
        <TabsContent value="asistente" className="mt-4">
          <AsistenteRupecoTAD />
        </TabsContent>
      </Tabs>
    </div>
  );
}
