import { useLanguage } from '@/hooks/useLanguage';
import { FileText, CheckCircle, Clock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PanelMetricasPrompts() {
  const { t } = useLanguage();

  return (
    <div className="card-institutional p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-4 h-4 text-primary" />
        <h3 className="font-serif font-semibold text-foreground text-sm">
          {t('aside.prompts.title') !== 'aside.prompts.title' ? t('aside.prompts.title') : 'Registro de Trazabilidad'}
        </h3>
      </div>

      {/* Resumen compacto */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-secondary/50">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Interacciones registradas</div>
            <div className="text-sm font-semibold text-foreground">5</div>
          </div>
        </div>

        {/* Última interacción */}
        <div className="p-2 rounded-lg bg-secondary/30 space-y-2">
          <div className="text-xs font-medium text-muted-foreground">Última interacción</div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground font-medium">VERIFICACIÓN_VIGENCIA</span>
              <Badge variant="outline" className="text-[9px] bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300">
                Convalidado
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>24/02/2026 — 10:32:15</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <CheckCircle className="w-3 h-3" />
              <span>Validador: agente_demo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Indicador de estado del ledger */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg py-2">
        <Shield className="w-3 h-3 text-green-600" />
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>{t('aside.prompts.ledgerActivo') !== 'aside.prompts.ledgerActivo' ? t('aside.prompts.ledgerActivo') : 'Ledger activo · Registro inmutable'}</span>
      </div>
    </div>
  );
}
