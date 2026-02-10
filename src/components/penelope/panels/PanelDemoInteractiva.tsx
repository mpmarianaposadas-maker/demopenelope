import { useState, useCallback, useMemo } from 'react';
import { Card, CardTitle, CardText } from '../Card';
import { ChatRupeco, AsistenteRupecoTAD, ProvidenciaIntimacion } from '../chat';
import type { ChatFlowState } from '../chat/ChatRupeco';
import { useLanguage } from '@/hooks/useLanguage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SiguientePaso } from './SiguientePaso';
import { useTabNavigation } from '@/contexts/TabNavigationContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileText, Send, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
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

const MOBILE_STEPS = [
  { num: 1, label: 'Selección de expediente' },
  { num: 2, label: 'Verificación formal' },
  { num: 3, label: 'Resultado' },
  { num: 4, label: 'Acción asistida' },
];

function generarTextoPase(expedienteNumero: string): string {
  const fecha = new Date().toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  return `
═══════════════════════════════════════════════════════════════════
          ENTE NACIONAL DE COMUNICACIONES - ENACOM
          PROVIDENCIA DE PASE - BORRADOR PARA CARGA EN GDE
═══════════════════════════════════════════════════════════════════

Expediente: ${expedienteNumero}
Fecha: ${fecha}

Ref.: PASE A ANÁLISIS TÉCNICO-JURÍDICO

Habiendo completado la verificación formal de la documentación
presentada en el expediente de referencia, y constatando que la
misma se ajusta a los requisitos establecidos por la normativa
vigente (Res. ENACOM N° 3731/2019 - RUPECO), se dispone el
pase del expediente a la etapa de análisis técnico-jurídico.

Se deja constancia de que la presente verificación formal no
constituye pronunciamiento sobre el fondo del trámite ni implica
acto administrativo definitivo.

───────────────────────────────────────────────────────────────────
 BORRADOR - REQUIERE VALIDACIÓN Y CARGA MANUAL EN GDE

 Validado por: _________________________  Fecha: ___________

 □ Verificar completitud documental
 □ Cargar en sistema GDE como PROVIDENCIA (PV)
───────────────────────────────────────────────────────────────────

          Sistema Penélope v1.0 - Generación asistida (PoC)
`.trim();
}

function MobileStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-1 p-3 bg-muted/50 rounded-lg overflow-x-auto">
      {MOBILE_STEPS.map((step) => (
        <div key={step.num} className="flex items-center gap-1 min-w-0">
          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 transition-colors",
              currentStep > step.num && "bg-green-500 text-white",
              currentStep === step.num && "bg-primary text-primary-foreground ring-2 ring-primary/30",
              currentStep < step.num && "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > step.num ? '✓' : step.num}
          </div>
          <span className={cn(
            "text-[10px] truncate",
            currentStep === step.num ? "text-foreground font-medium" : "text-muted-foreground"
          )}>
            {step.label}
          </span>
          {step.num < MOBILE_STEPS.length && (
            <div className={cn(
              "w-3 h-px shrink-0",
              currentStep > step.num ? "bg-green-500" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

export function PanelDemoInteractiva() {
  const { t } = useLanguage();
  const { goToTab } = useTabNavigation();
  const isMobile = useIsMobile();
  const [selectedExpediente, setSelectedExpediente] = useState<string | null>(null);
  const [externalMessage, setExternalMessage] = useState<string | null>(null);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('random');
  const [activeTab, setActiveTab] = useState('verificacion');
  const [flowState, setFlowState] = useState<ChatFlowState | null>(null);
  const [showIntimacionDialog, setShowIntimacionDialog] = useState(false);
  const [showPaseDialog, setShowPaseDialog] = useState(false);

  const handleSelectExpediente = useCallback((expedienteId: string) => {
    const exp = EXPEDIENTES_SUGERIDOS.find(e => e.id === expedienteId);
    if (!exp) return;

    setSelectedExpediente(expedienteId);
    setActiveScenario(exp.scenario);
    setExternalMessage(exp.mensaje);
    setActiveTab('verificacion');
    setFlowState(null);
  }, []);

  const handleMessageConsumed = useCallback(() => {
    setExternalMessage(null);
  }, []);

  const handleFlowStateChange = useCallback((state: ChatFlowState) => {
    setFlowState(state);
  }, []);

  const mobileStep = useMemo(() => {
    if (!selectedExpediente || !flowState) return 1;
    const s = flowState.step;
    if (['ingreso_recepcion', 'clasificacion_ia', 'confirmacion_clasificacion', 'validacion_documental'].includes(s)) return 2;
    if (s === 'resultado') return 3;
    if (s === 'evaluacion') return 4;
    return 1;
  }, [selectedExpediente, flowState]);

  // Solo mostrar acciones asistidas después de que el operador haya validado todos los requisitos
  const showAccionesAsistidas = flowState?.step === 'evaluacion' && flowState.todosRequisitosValidados && !flowState.aprobacion;

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

      {/* Mobile stepper */}
      {isMobile && selectedExpediente && (
        <MobileStepper currentStep={mobileStep} />
      )}

      {/* 1. Selección de expediente (modo demostración) */}
      <div className="p-4 bg-muted/40 border border-border rounded-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">📂 Selección de expediente (modo demostración)</span>
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

      {/* 2-3. Verificación y resultado */}
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
            onFlowStateChange={handleFlowStateChange}
          />
        </TabsContent>
        
        <TabsContent value="asistente" className="mt-4">
          <AsistenteRupecoTAD />
        </TabsContent>
      </Tabs>

      {/* 4. Acciones asistidas disponibles */}
      {showAccionesAsistidas && (
        <div className="p-4 border border-border rounded-lg space-y-4 bg-background">
          <div className="flex items-center gap-2">
            <Send className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Acciones asistidas disponibles</span>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">PoC ilustrativa</span>
          </div>

          <p className="text-xs text-muted-foreground">
            Verificación formal finalizada. El operador ha validado todos los requisitos. El expediente se encuentra en condiciones de continuar su tramitación.
          </p>

          <div className={cn("flex gap-3", isMobile && "flex-col")}>
            {flowState.expedienteCompleto ? (
              <Button
                variant="default"
                className="flex-1"
                onClick={() => setShowPaseDialog(true)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Generar borrador de providencia de pase
              </Button>
            ) : (
              <Button
                variant="default"
                className="flex-1"
                onClick={() => setShowIntimacionDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Generar borrador de Nota de Intimación
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dialog: Nota de Intimación */}
      <Dialog open={showIntimacionDialog} onOpenChange={setShowIntimacionDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Borrador de Nota de Intimación
            </DialogTitle>
            <DialogDescription>
              Documento generado como asistencia IA — requiere validación humana.
            </DialogDescription>
          </DialogHeader>

          {flowState?.providenciaData && (
            <ProvidenciaIntimacion
              expediente={flowState.providenciaData.expediente}
              documentosFaltantes={flowState.providenciaData.documentosFaltantes}
            />
          )}

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 text-center font-medium">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Borrador generado por IA. Sin valor jurídico. Requiere revisión y firma humana.
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Providencia de Pase */}
      <Dialog open={showPaseDialog} onOpenChange={setShowPaseDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Borrador de Providencia de Pase
            </DialogTitle>
            <DialogDescription>
              Documento generado como asistencia IA — requiere validación humana.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-md border p-4">
            <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {generarTextoPase(flowState?.expedienteNumero || 'EX-2026-XXXXXXXX-APN-ENACOM')}
            </pre>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-800 dark:text-amber-300 text-center font-medium">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            Borrador generado por IA. Sin valor jurídico. Requiere revisión y firma humana.
          </div>
        </DialogContent>
      </Dialog>

      <SiguientePaso
        label="Arquitectura"
        description="Explore los diagramas de flujo del sistema"
        onNavigate={() => goToTab('arquitectura')}
      />
    </div>
  );
}
