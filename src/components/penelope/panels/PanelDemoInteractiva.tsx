import { useState, useCallback } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { ChatRupeco, AsistenteRupecoTAD } from '../chat';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiguientePaso } from './SiguientePaso';
import { useTabNavigation } from '@/contexts/TabNavigationContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ScenarioType } from '@/hooks/useChatRupecoSimulado';

const EXPEDIENTES_SUGERIDOS: Array<{
  id: string;
  numero: string;
  label: string;
  descripcion: string;
  mensaje: string;
  scenario: ScenarioType;
}> = [
  {
    id: 'completo',
    numero: 'EX-2026-10045678-APN-ENACOM',
    label: '📗 Documentación completa',
    descripcion: 'Licencia TIC nueva — todos los documentos presentados',
    mensaje: 'Licencia TIC nueva para persona jurídica',
    scenario: 'completo',
  },
  {
    id: 'incompleto',
    numero: 'EX-2026-20098321-APN-ENACOM',
    label: '📕 Documentación incompleta',
    descripcion: 'Autorización Audiovisual — faltan documentos obligatorios',
    mensaje: 'Autorización audiovisual para empresa',
    scenario: 'incompleto',
  },
  {
    id: 'subsanacion',
    numero: 'EX-2026-30012456-APN-ENACOM',
    label: '📙 Subsanación pendiente',
    descripcion: 'Habilitación Postal — documentos con baja confianza de detección',
    mensaje: 'Habilitación servicio postal para empresa',
    scenario: 'subsanacion',
  },
  {
    id: 'vencimiento',
    numero: 'EX-2026-40076543-APN-ENACOM',
    label: '⏰ Plazo próximo a vencer',
    descripcion: 'Modificación societaria TIC — documentación completa, plazo crítico',
    mensaje: 'Modificación societaria TIC para empresa',
    scenario: 'vencimiento',
  },
];

export function PanelDemoInteractiva() {
  const { t } = useLanguage();
  const { goToTab } = useTabNavigation();
  const [selectedExpediente, setSelectedExpediente] = useState<string | null>(null);
  const [externalMessage, setExternalMessage] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('random');
  const [activeTab, setActiveTab] = useState('verificacion');

  const handleSelectExpediente = useCallback((expedienteId: string) => {
    const exp = EXPEDIENTES_SUGERIDOS.find(e => e.id === expedienteId);
    if (!exp) return;

    setSelectedExpediente(expedienteId);
    setActiveScenario(exp.scenario);
    setExternalMessage(exp.mensaje);
    setActiveTab('verificacion');
  }, []);

  const handleMessageConsumed = useCallback(() => {
    setExternalMessage(null);
  }, []);

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

      {/* Caja de expedientes sugeridos */}
      <div className="p-4 bg-muted/40 border border-border rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">📂 Expedientes de prueba</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">PoC ilustrativa</span>
        </div>

        <Select onValueChange={handleSelectExpediente} value={selectedExpediente || undefined}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Seleccionar un expediente de ejemplo…" />
          </SelectTrigger>
          <SelectContent>
            {EXPEDIENTES_SUGERIDOS.map((exp) => (
              <SelectItem key={exp.id} value={exp.id}>
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">{exp.label}</span>
                  <span className="text-xs text-muted-foreground">{exp.numero}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedExpediente && (
          <p className="text-xs text-muted-foreground">
            {EXPEDIENTES_SUGERIDOS.find(e => e.id === selectedExpediente)?.descripcion}
          </p>
        )}

        <p className="text-xs text-muted-foreground/70 italic">
          Los expedientes listados son simulados, con fines demostrativos.
          No corresponden a trámites reales ni producen efectos jurídicos.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="verificacion">
            📂 Verificación Documental
          </TabsTrigger>
          <TabsTrigger value="asistente">
            🛠️ Asistente RUPECO/TAD
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="verificacion" className="mt-4">
          <ChatRupeco
            externalMessage={externalMessage}
            scenarioType={activeScenario}
            onMessageConsumed={handleMessageConsumed}
          />
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
