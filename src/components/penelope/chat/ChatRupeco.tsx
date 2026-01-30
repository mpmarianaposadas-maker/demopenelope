import { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Bot, AlertTriangle } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { RupecoEvaluation } from './RupecoEvaluation';
import { RupecoProgressIndicator } from './RupecoProgressIndicator';
import { ProvidenciaIntimacion } from './ProvidenciaIntimacion';
import { useChatRupecoSimulado } from '@/hooks/useChatRupecoSimulado';
import { useLanguage } from '@/hooks/useLanguage';

const QUICK_ACTIONS = [
  { label: '📡 Licencia TIC nueva', message: 'Licencia TIC nueva para persona jurídica' },
  { label: '📺 Autorización Audiovisual', message: 'Autorización audiovisual para empresa' },
  { label: '📮 Habilitación Postal', message: 'Habilitación servicio postal para empresa' },
  { label: '📋 Inscripción RUPECO', message: 'Inscripción RUPECO persona jurídica' },
];

export function ChatRupeco() {
  const { t } = useLanguage();
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
  } = useChatRupecoSimulado();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, evaluation]);

  const showQuickActions = messages.length === 1;
  const showProgress = currentStep !== 'inicio';

  return (
    <Card className="flex flex-col h-[600px] max-h-[70vh]">
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
            {t('chat.systemDisabled')}
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

          {showQuickActions && isSystemActive && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground w-full mb-1">
                Seleccioná el tipo de trámite:
              </span>
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action.message)}
                  disabled={isLoading}
                >
                  {action.label}
                </Button>
              ))}
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
        </div>
      </ScrollArea>

      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        disabled={!isSystemActive}
      />
    </Card>
  );
}
