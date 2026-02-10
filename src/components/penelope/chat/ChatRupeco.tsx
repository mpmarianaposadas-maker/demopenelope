import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Bot, AlertTriangle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatMessage } from './ChatMessage';
import { RupecoEvaluation } from './RupecoEvaluation';
import { RupecoProgressIndicator } from './RupecoProgressIndicator';
import { RequisitoVerificacion } from './RequisitoVerificacion';
import { HistorialAcciones } from './HistorialAcciones';
import { ClasificacionConfirmacion } from './ClasificacionConfirmacion';
import { useChatRupecoSimulado, type ScenarioType } from '@/hooks/useChatRupecoSimulado';
import { useLanguage } from '@/hooks/useLanguage';
import type { ExpedienteData, DocumentoFaltante } from './ProvidenciaIntimacion';

export interface ChatFlowState {
  step: string;
  expedienteCompleto: boolean;
  providenciaData: {
    expediente: ExpedienteData;
    documentosFaltantes: DocumentoFaltante[];
  } | null;
  expedienteNumero?: string;
  todosRequisitosValidados: boolean;
  aprobacion: { aprobado: boolean; rechazado?: boolean } | null;
}

interface ChatRupecoProps {
  externalMessage?: string | null;
  scenarioType?: ScenarioType;
  onMessageConsumed?: () => void;
  onFlowStateChange?: (state: ChatFlowState) => void;
}

export function ChatRupeco({ externalMessage, scenarioType = 'random', onMessageConsumed, onFlowStateChange }: ChatRupecoProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    resetChat, 
    evaluation, 
    isSystemActive,
    currentStep,
    esPJ,
    providenciaData,
    requisitosData,
    validarRequisito,
    aprobarExpediente,
    rechazarExpediente,
    revertirDecision,
    aprobacion,
    todosRequisitosValidados,
    historialAcciones,
    expedienteNumero,
    clasificacionPendiente,
    confirmarClasificacion,
    cancelarClasificacion,
  } = useChatRupecoSimulado(scenarioType);

  // Handle external message trigger
  useEffect(() => {
    if (externalMessage && !isLoading && isSystemActive) {
      sendMessage(externalMessage);
      onMessageConsumed?.();
    }
  }, [externalMessage]);

  // Notify parent of flow state changes
  useEffect(() => {
    onFlowStateChange?.({
      step: currentStep,
      expedienteCompleto: !providenciaData && currentStep === 'evaluacion',
      providenciaData: providenciaData ?? null,
      expedienteNumero,
      todosRequisitosValidados,
      aprobacion: aprobacion ? { aprobado: aprobacion.aprobado, rechazado: aprobacion.rechazado } : null,
    });
  }, [currentStep, providenciaData, expedienteNumero, onFlowStateChange, todosRequisitosValidados, aprobacion]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, evaluation, requisitosData, historialAcciones, clasificacionPendiente]);

  const showProgress = currentStep !== 'inicio';

  return (
    <Card className="flex flex-col max-h-[70vh]">
      <CardHeader className="flex-shrink-0 pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{t('chat.title')}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              RUPECO
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetChat}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            {t('chat.reset')}
          </Button>
        </div>
      </CardHeader>

      {!isSystemActive && (
        <div className="flex-shrink-0 bg-destructive/10 border-b border-destructive/20 px-4 py-2">
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertTriangle className="h-4 w-4" />
            <div>
              <span>{t('chat.systemDisabled')}</span>
              <span className="block text-xs mt-0.5 opacity-80">
                Para reactivarlo, use el panel de Kill Switch en la barra lateral.
                {isMobile && ' Abra el panel lateral con el botón ☰.'}
              </span>
            </div>
          </div>
        </div>
      )}

      {showProgress && (
        <div className="flex-shrink-0 px-4 pt-3">
          <RupecoProgressIndicator currentStep={currentStep} esPJ={esPJ} />
        </div>
      )}

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Panel de confirmación de clasificación */}
          {clasificacionPendiente && (
            <div className="mt-4">
              <ClasificacionConfirmacion
                clasificacion={clasificacionPendiente}
                onConfirmar={confirmarClasificacion}
                onRechazar={cancelarClasificacion}
              />
            </div>
          )}

          {/* Panel de verificación de requisitos */}
          {requisitosData && (
            <div className="mt-4">
              <RequisitoVerificacion
                requisitos={requisitosData.requisitos}
                onValidarRequisito={validarRequisito}
                tipoPersona={requisitosData.tipoPersona}
                tramiteNombre={requisitosData.tramiteNombre}
                onAprobarExpediente={aprobarExpediente}
                onRechazarExpediente={rechazarExpediente}
                onRevertirDecision={revertirDecision}
                aprobacion={aprobacion}
                todosValidados={todosRequisitosValidados}
              />
            </div>
          )}

          {evaluation && (
            <div className="mt-4">
              <RupecoEvaluation data={evaluation} />
            </div>
          )}

          {/* Historial de acciones del agente */}
          {historialAcciones.length > 0 && (
            <div className="mt-4">
              <HistorialAcciones 
                acciones={historialAcciones}
                expedienteNumero={expedienteNumero}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
