import { useState } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { FolderOpen, Wrench, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ChatRupeco, AsistenteRupecoTAD } from '../chat';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiguientePaso } from './SiguientePaso';
import { useTabNavigation } from '@/contexts/TabNavigationContext';

export function PanelDemoInteractiva() {
  const { t } = useLanguage();
  const { goToTab } = useTabNavigation();
  const [expedienteAprobado, setExpedienteAprobado] = useState(false);

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
          <ChatRupeco onAprobacionChange={(aprobado) => setExpedienteAprobado(aprobado)} />
        </TabsContent>
        
        <TabsContent value="asistente" className="mt-4">
          <AsistenteRupecoTAD />
        </TabsContent>
      </Tabs>

      <SiguientePaso
        label="Arquitectura"
        description="Explore los diagramas de flujo del sistema"
        onNavigate={() => goToTab('arquitectura')}
      />
    </div>
  );
}
