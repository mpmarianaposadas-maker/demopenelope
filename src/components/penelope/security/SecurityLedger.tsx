import { useState } from 'react';
import { formatFechaAR, formatHoraSegAR } from '@/lib/formatDate';
import { Card, CardTitle, CardText } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Clock, User, ChevronDown, ChevronUp, CheckCircle2, PenLine, Hash, Link2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LedgerEntry {
  id: string;
  caseId: string;
  promptId: string;
  taskType: 'VERIFICACION_VIGENCIA' | 'CLASIFICACION_PRELIMINAR' | 'GENERACION_PROVIDENCIA' | 'DETECCION_FALTANTES' | 'CONTROL_PLAZOS';
  inputHash: string;
  outputIA: string;
  validadorId: string;
  timestamp: Date;
  estado: 'convalidado' | 'corregido' | 'rechazado' | 'sistema';
}

interface SecurityLedgerProps {
  entries: LedgerEntry[];
  maxVisible?: number;
  onViewExpediente?: (caseId: string) => void;
}

const TASK_LABELS: Record<LedgerEntry['taskType'], string> = {
  VERIFICACION_VIGENCIA: 'Verificación de vigencia documental',
  CLASIFICACION_PRELIMINAR: 'Clasificación preliminar del trámite',
  GENERACION_PROVIDENCIA: 'Generación de borrador de providencia',
  DETECCION_FALTANTES: 'Detección de documentación faltante',
  CONTROL_PLAZOS: 'Control activo de plazos perentorios',
};

const ESTADO_LABELS: Record<string, { label: string; className: string }> = {
  convalidado: { label: 'Sugerencia validada', className: 'border-green-400 text-green-700 bg-green-50' },
  corregido: { label: 'Sugerencia ajustada por agente', className: 'border-amber-400 text-amber-700 bg-amber-50' },
  rechazado: { label: 'Rechazado', className: 'border-red-400 text-red-700 bg-red-50' },
  sistema: { label: 'Sistema', className: 'border-gray-400 text-gray-600 bg-gray-50' },
};

export function SecurityLedger({ entries, maxVisible = 5, onViewExpediente }: SecurityLedgerProps) {
  const [expanded, setExpanded] = useState(false);

  const visibleEntries = expanded ? entries : entries.slice(0, maxVisible);

  const formatTime = (date: Date) => formatHoraSegAR(date);
  const formatDate = (date: Date) => formatFechaAR(date);

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <CardTitle>Registro de Interacciones Algorítmicas</CardTitle>
        </div>
        <Badge variant="outline" className="text-xs">
          {entries.length} registros
        </Badge>
      </div>

      <CardText className="text-xs mb-1">
        Registro probatorio de cada interacción entre el sistema y los modelos de IA, conforme al modelo de trazabilidad del Anexo III.
      </CardText>
      <p className="text-xs text-muted-foreground italic mb-4 border-l-2 border-primary/30 pl-2">
        Panel de monitoreo técnico del uso de modelos, conforme lo desarrollado en el trabajo. Finalidad probatoria, no analítica.
      </p>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No hay registros de interacciones algorítmicas aún.
        </div>
      ) : (
        <>
          <ScrollArea className={expanded ? 'max-h-[28rem]' : 'max-h-72'}>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {visibleEntries.map((entry, index) => {
                  const estadoInfo = ESTADO_LABELS[entry.estado] ?? ESTADO_LABELS.convalidado;
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.04 }}
                      className="p-3 bg-secondary/30 rounded-lg border border-border/50 text-xs space-y-2"
                    >
                      {/* Header: PromptID + Estado */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className="font-mono font-semibold text-foreground">{entry.promptId}</span>
                        <Badge variant="outline" className={estadoInfo.className}>
                          {entry.estado === 'convalidado' ? (
                            <><CheckCircle2 className="w-3 h-3 mr-1" />{estadoInfo.label}</>
                          ) : (
                            <><PenLine className="w-3 h-3 mr-1" />{estadoInfo.label}</>
                          )}
                        </Badge>
                      </div>

                      {/* Tipo de tarea */}
                      <div className="text-muted-foreground">
                        {TASK_LABELS[entry.taskType]}
                      </div>

                      {/* Grid de campos */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span className="font-medium text-foreground/80">CaseID:</span>
                          <span className="truncate font-mono">{entry.caseId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="font-medium text-foreground/80">Validador:</span>
                          <span>{entry.validadorId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>{formatDate(entry.timestamp)} {formatTime(entry.timestamp)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-3 h-3 shrink-0" />
                          <span className="font-medium text-foreground/80">Hash:</span>
                          <span className="font-mono truncate">{entry.inputHash}</span>
                        </div>
                      </div>

                      {/* Output IA with clearer labeling */}
                      <div className="pt-1.5 border-t border-border/30 space-y-1">
                        <span className="font-medium text-foreground/80 block">Sugerencia emitida por el modelo:</span>
                        <p className="text-muted-foreground leading-relaxed">{entry.outputIA}</p>
                      </div>

                      {/* Validación humana */}
                      <div className="pt-1 border-t border-border/20 flex items-center gap-2 text-[10px]">
                        <User className="w-3 h-3 text-green-600 shrink-0" />
                        <span className="text-muted-foreground">
                          Revisión humana: <span className="font-medium text-foreground">{entry.validadorId}</span> — {estadoInfo.label}
                        </span>
                      </div>

                      {/* Link al expediente */}
                      {onViewExpediente && (
                        <div className="pt-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs text-primary gap-1 px-1"
                            onClick={() => onViewExpediente(entry.caseId)}
                          >
                            <Link2 className="w-3 h-3" />
                            Ver historial del expediente
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {entries.length > maxVisible && (
            <div className="mt-3 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="w-full gap-2 text-xs"
              >
                {expanded ? (
                  <><ChevronUp className="w-4 h-4" />Contraer</>
                ) : (
                  <><ChevronDown className="w-4 h-4" />Ver todos ({entries.length - maxVisible} más)</>
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
