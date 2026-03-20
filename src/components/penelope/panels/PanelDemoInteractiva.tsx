import { Card, CardTitle, CardText } from '../Card';
import { FolderOpen, Wrench } from 'lucide-react';
import { ChatRupeco, AsistenteRupecoTAD } from '../chat';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiguientePaso } from './SiguientePaso';
import { useTabNavigation } from '@/contexts/TabNavigationContext';

export function PanelDemoInteractiva() {
  const { t } = useLanguage();
  const { goToTab } = useTabNavigation();

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle>{t('demo.title')}</CardTitle>
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
            📂 Verificación Documental
          </TabsTrigger>
          <TabsTrigger value="asistente">
            🛠️ Asistente RUPECO/TAD
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verificacion" className="mt-4">
          <ChatRupeco />
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
