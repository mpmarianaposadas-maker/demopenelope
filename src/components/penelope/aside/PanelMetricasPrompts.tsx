import { useLanguage } from '@/hooks/useLanguage';
import { FileText, CheckCircle, Clock, Shield, Hash, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LedgerEntry } from '@/components/penelope/security/SecurityLedger';
import { useLedger } from '@/contexts/LedgerContext';
import { formatFechaAR, formatHoraSegAR } from '@/lib/formatDate';

const TASK_LABELS: Record<LedgerEntry['taskType'], string> = {
  VERIFICACION_VIGENCIA: 'VERIFICACIÓN-VIGENCIA',
  CLASIFICACION_PRELIMINAR: 'CLASIFICACIÓN-PRELIMINAR',
  GENERACION_PROVIDENCIA: 'GENERACIÓN-PROVIDENCIA',
  DETECCION_FALTANTES: 'DETECCIÓN-FALTANTES',
  CONTROL_PLAZOS: 'CONTROL-PLAZOS',
};

export function PanelMetricasPrompts() {
  const { t } = useLanguage();
  const { entries } = useLedger();

  const formatTimestamp = (date: Date) => `${formatFechaAR(date)} — ${formatHoraSegAR(date)}`;

  return (
    <div className="card-institutional p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-serif font-semibold text-foreground text-sm">
            Prompt Net Ledger
          </h3>
        </div>
        <Badge variant="outline" className="text-[9px]">
          {entries.length} interacciones
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground -mt-3 mb-3">
        Registro de interacciones con el modelo de IA
      </p>
      </div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.slice(-3).map((entry) => (
          <div key={entry.id} className="p-2.5 rounded-lg bg-secondary/40 border border-border/40 space-y-1.5 text-xs">
            {/* PromptID + Estado */}
            <div className="flex items-center justify-between">
              <span className="font-mono font-semibold text-foreground text-[11px]">{entry.promptId}</span>
              <Badge
                variant="outline"
                className={
                  entry.estado === 'convalidado'
                    ? 'text-[8px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300'
                    : 'text-[8px] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300'
                }
              >
                {entry.estado === 'convalidado' ? 'Convalidado' : 'Corregido'}
              </Badge>
            </div>

            {/* CaseID */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileText className="w-3 h-3 shrink-0" />
              <span className="font-mono truncate text-[10px]">{entry.caseId}</span>
            </div>

            {/* Tipo de tarea */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <Hash className="w-3 h-3 shrink-0" />
              <span className="font-medium text-[10px]">{TASK_LABELS[entry.taskType]}</span>
            </div>

            {/* Output IA */}
            <div className="text-[10px] text-muted-foreground leading-relaxed pl-4 border-l-2 border-primary/20">
              {entry.outputIA}
            </div>

            {/* Validación */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <User className="w-3 h-3 shrink-0" />
              <span>{entry.validadorId} — {entry.estado === 'convalidado' ? 'Convalidado' : 'Corregido'}</span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{formatTimestamp(entry.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Registro inmutable */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg py-2">
        <Shield className="w-3 h-3 text-green-600" />
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>Registro inmutable · {entries.length} interacciones</span>
      </div>
    </div>
  );
}
