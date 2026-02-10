import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ExpedienteSimulado } from '@/hooks/useSimuladorFlujo';

interface EstadoExpedienteResultProps {
  expediente: ExpedienteSimulado;
  t: (key: string) => string;
}

export function EstadoExpedienteResult({ expediente, t }: EstadoExpedienteResultProps) {
  const { numero, estado, tipoTramite, diasRestantes, alertaActiva } = expediente;

  if (estado === 'sin_iniciar') {
    return null;
  }

  const getEstadoConfig = () => {
    switch (estado) {
      case 'apto':
        return {
          icon: CheckCircle2,
          label: t('simulador.estado.apto'),
          description: t('simulador.estado.aptoDesc'),
          badgeClass: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
          iconClass: 'text-green-600 dark:text-green-400',
        };
      case 'incompleto':
        return {
          icon: XCircle,
          label: t('simulador.estado.incompleto'),
          description: t('simulador.estado.incompletoDesc'),
          badgeClass: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30',
          iconClass: 'text-amber-600 dark:text-amber-400',
        };
      case 'en_proceso':
      default:
        return {
          icon: Clock,
          label: t('simulador.estado.enProceso'),
          description: t('simulador.estado.enProcesoDesc'),
          badgeClass: 'bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30',
          iconClass: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  const config = getEstadoConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-card border rounded-lg p-4 space-y-3"
    >
      {/* Header with expediente number */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span className="font-mono text-xs">{numero}</span>
        </div>
        <Badge 
          variant="outline" 
          className={cn('font-semibold', config.badgeClass)}
        >
          <Icon className={cn('w-3.5 h-3.5 mr-1.5', config.iconClass)} />
          {config.label}
        </Badge>
      </div>

      {/* Expediente details */}
      <div className="grid gap-2 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t('simulador.expediente.tipo')}:</span>
          <span className="font-medium">{tipoTramite}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t('simulador.expediente.plazo')}:</span>
          <span className={cn(
            'font-medium',
            alertaActiva && 'text-destructive'
          )}>
            {diasRestantes} {t('simulador.expediente.dias')}
            {alertaActiva && ' ⚠️'}
          </span>
        </div>
      </div>

      {/* Status description */}
      <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
        {config.description}
      </p>
    </motion.div>
  );
}
