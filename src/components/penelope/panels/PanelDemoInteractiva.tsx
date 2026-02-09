import { Card, CardTitle, CardText } from '../Card';
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

      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-800 dark:text-amber-300 text-center">
        ℹ️ <strong>PoC Ilustrativa</strong> — Los resultados de esta simulación no tienen valor normativo ni decisorio.
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
