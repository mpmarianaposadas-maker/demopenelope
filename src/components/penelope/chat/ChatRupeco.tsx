import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Bot, AlertTriangle, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { RupecoEvaluation } from './RupecoEvaluation';
import { RupecoProgressIndicator } from './RupecoProgressIndicator';
import { ProvidenciaIntimacion } from './ProvidenciaIntimacion';
import { RequisitoVerificacion } from './RequisitoVerificacion';
import { HistorialAcciones } from './HistorialAcciones';
import { ClasificacionConfirmacion } from './ClasificacionConfirmacion';
import { useChatRupecoSimulado } from '@/hooks/useChatRupecoSimulado';
import { useLanguage } from '@/hooks/useLanguage';

const QUICK_ACTIONS = [
  { label: '📡 Licencia TIC nueva', message: 'Licencia TIC nueva para persona jurídica' },
  { label: '📺 Autorización Audiovisual', message: 'Autorización audiovisual para empresa' },
  { label: '📮 Habilitación Postal', message: 'Habilitación servicio postal para empresa' },
  { label: '🔄 Modificación societaria TIC', message: 'Modificación societaria TIC para empresa' },
  { label: '📋 Actualización RUPECO', message: 'Actualización de datos RUPECO persona jurídica' },
];

export function ChatRupeco() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const requisitosRef = useRef<HTMLDivElement>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showFade, setShowFade] = useState(true);
  const prevRequisitosRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    setShowFade(!atBottom);
  }, []);
  
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
    // Nuevas funciones para clasificación
    clasificacionPendiente,
    confirmarClasificacion,
    cancelarClasificacion,
  } = useChatRupecoSimulado();

  // Auto-scroll to bottom on new content
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, evaluation, requisitosData, historialAcciones, clasificacionPendiente]);

  // Smooth scroll to requisitos section when it first appears (post-classification)
  useEffect(() => {
    if (requisitosData && !prevRequisitosRef.current) {
      setShowScrollHint(false);
      setTimeout(() => {
        requisitosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
    prevRequisitosRef.current = !!requisitosData;
  }, [requisitosData]);

  // Show scroll hint when clasificación is pending
  useEffect(() => {
    if (clasificacionPendiente) {
      setShowScrollHint(true);
    } else if (!requisitosData) {
      setShowScrollHint(false);
    }
  }, [clasificacionPendiente, requisitosData]);

  const showQuickActions = messages.length === 1;
  const showProgress = currentStep !== 'inicio';

  return (
    <Card
      className="flex flex-col"
      style={{ height: isMobile ? '85vh' : 'min(85vh, 900px)' }}
    >
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

      <div className="relative flex-1 min-h-0">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto p-4 rupeco-scroll"
        >
          {showProgress && (
            <div className="sticky top-0 z-20 bg-card border-b border-border/50 -mx-4 px-4 py-3 mb-4">
              <RupecoProgressIndicator currentStep={currentStep} esPJ={esPJ} />
            </div>
          )}

          <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {showQuickActions && isSystemActive && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground w-full mb-1">
                Seleccioná el tipo de trámite:
              </span>
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="default"
                  size="sm"
                  onClick={() => sendMessage(action.message)}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Panel de confirmación de clasificación */}
          {clasificacionPendiente && (
            <div className="mt-4">
              <ClasificacionConfirmacion
                clasificacion={clasificacionPendiente}
                onConfirmar={confirmarClasificacion}
                onRechazar={cancelarClasificacion}
              />
              {/* Indicador de scroll: más contenido abajo */}
              {showScrollHint && (
                <div className="mt-3 flex flex-col items-center gap-2 animate-bounce">
                  <div className="p-2 rounded-full bg-gray-900 text-white shadow-md">
                    <ChevronDown className="h-5 w-5" />
                  </div>
                  <p className="text-xs text-center max-w-sm font-medium text-primary">
                    Desplazá hacia abajo para ver el informe completo de verificación documental, requisitos, borrador de intimación e historial de acciones.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Panel de verificación de requisitos */}
          {requisitosData && (
            <div className="mt-4" ref={requisitosRef}>
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

          {providenciaData && (
            <div className="mt-4">
              <ProvidenciaIntimacion 
                expediente={providenciaData.expediente}
                documentosFaltantes={providenciaData.documentosFaltantes}
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
        </div>

        {/* Fade inferior indicador de scroll */}
        {showFade && (
          <div
            className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-card to-transparent pointer-events-none z-10"
          />
        )}
      </div>

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={!isSystemActive || !!clasificacionPendiente}
      />
    </Card>
  );
}
