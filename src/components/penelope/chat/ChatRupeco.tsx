import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Bot, AlertTriangle, Radio, Tv, Mail, RefreshCw, ClipboardList, ArrowRight } from 'lucide-react';
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

const QUICK_ACTION_ICONS: Record<string, React.ReactNode> = {
  'Licencia TIC nueva': <Radio size={14} className="inline mr-1" />,
  'Autorización Audiovisual': <Tv size={14} className="inline mr-1" />,
  'Habilitación Postal': <Mail size={14} className="inline mr-1" />,
  'Modificación societaria TIC': <RefreshCw size={14} className="inline mr-1" />,
  'Actualización RUPECO': <ClipboardList size={14} className="inline mr-1" />,
};

const QUICK_ACTIONS = [
  { label: 'Licencia TIC nueva', message: 'Licencia TIC nueva para persona jurídica' },
  { label: 'Autorización Audiovisual', message: 'Autorización audiovisual para empresa' },
  { label: 'Habilitación Postal', message: 'Habilitación servicio postal para empresa' },
  { label: 'Modificación societaria TIC', message: 'Modificación societaria TIC para empresa' },
  { label: 'Actualización RUPECO', message: 'Actualización de datos RUPECO persona jurídica' },
];

interface ChatRupecoProps {
  onAprobacionChange?: (aprobado: boolean) => void;
}

export function ChatRupeco({ onAprobacionChange }: ChatRupecoProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const requisitosRef = useRef<HTMLDivElement>(null);
  const clasificacionRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(true);
  const historialRef = useRef<HTMLDivElement>(null);

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
    clasificacionPendiente,
    confirmarClasificacion,
    cancelarClasificacion,
    scrollToTopCounter,
  } = useChatRupecoSimulado();

  // Scroll to top on mount and reset (messages.length === 1 means initial state)
  useEffect(() => {
    if (scrollRef.current && messages.length === 1) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages.length]);

  // Auto-scroll to bottom on new message from assistant
  useEffect(() => {
    if (scrollRef.current && messages.length > 1) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll to top when triggered by actions (confirmar, aprobar, rechazar, etc.)
  useEffect(() => {
    if (scrollToTopCounter > 0 && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = 0;
        }
      }, 150);
    }
  }, [scrollToTopCounter]);

  // Notify parent about approval state changes
  useEffect(() => {
    onAprobacionChange?.(aprobacion?.aprobado === true);
  }, [aprobacion, onAprobacionChange]);

  // Scroll to clasificación panel when it appears (after trámite selection)
  useEffect(() => {
    if (clasificacionPendiente && clasificacionRef.current) {
      setTimeout(() => {
        clasificacionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [clasificacionPendiente]);

  // Scroll to requisitos panel when it first appears (after confirmation)
  const prevRequisitosRef = useRef(false);
  useEffect(() => {
    if (requisitosData && !prevRequisitosRef.current && requisitosRef.current) {
      setTimeout(() => {
        requisitosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    prevRequisitosRef.current = !!requisitosData;
  }, [requisitosData]);

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
                {isMobile && ' Abra el panel lateral con el botón de menú.'}
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
            <div className="bg-muted/60 border border-border/50 rounded-lg px-4 py-3 mb-4">
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
              <p className="text-[11px] text-muted-foreground/80 italic w-full mb-2 leading-snug">
                Ejemplos simulados. Incluyen supuestos actualmente no contemplados reglamentariamente, solo a efectos demostrativos de la propuesta de ampliación del RUPECO.
              </p>
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="default"
                  size="sm"
                  onClick={() => sendMessage(action.message)}
                  disabled={isLoading}
                >
                  {QUICK_ACTION_ICONS[action.label]}{action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Panel de confirmación de clasificación */}
          {clasificacionPendiente && (
            <div className="mt-4" ref={clasificacionRef}>
              <ClasificacionConfirmacion
                clasificacion={clasificacionPendiente}
                onConfirmar={confirmarClasificacion}
                onRechazar={cancelarClasificacion}
              />
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
            <div className="mt-4" ref={historialRef}>
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

      {/* Siguiente paso contextual */}
      {currentStep !== 'inicio' && (
        <div className="flex-shrink-0 border-t border-border px-4 py-2.5 bg-muted/30">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowRight size={12} className="flex-shrink-0 text-primary" />
            <span>
              {currentStep === 'ingreso_recepcion' && 'Procesando ingreso del expediente...'}
              {currentStep === 'clasificacion_ia' && 'Clasificación asistida en curso...'}
              {currentStep === 'confirmacion_clasificacion' && 'Confirmar la clasificación para continuar con la verificación documental RUPECO.'}
              {currentStep === 'validacion_documental' && 'Verificando documentación contra el núcleo RUPECO...'}
              {currentStep === 'resultado' && 'Revisar el informe de verificación y validar cada requisito.'}
              {currentStep === 'evaluacion' && 'Aprobar o rechazar el expediente para completar la admisibilidad formal.'}
            </span>
          </div>
        </div>
      )}

    </Card>
  );
}
