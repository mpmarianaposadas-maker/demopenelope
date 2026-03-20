import { useLanguage } from '@/hooks/useLanguage';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { FileInput, FolderSearch, Tag, Clock, UserCheck, Scale, Send } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const steps = [
  { id: 'ingreso', label: 'Ingreso y caratulación', icon: FileInput, status: 'completed' as const },
  { id: 'verificacion', label: 'Verificación documental', icon: FolderSearch, status: 'completed' as const },
  { id: 'clasificacion', label: 'Clasificación preliminar', icon: Tag, status: 'current' as const },
  { id: 'plazos', label: 'Control de plazos', icon: Clock, status: 'pending' as const },
];

const stepsExternos = [
  { id: 'analisis', label: 'Análisis sustantivo — Área técnica', icon: UserCheck, tag: 'Acto humano' },
  { id: 'decision', label: 'Decisión administrativa', icon: Scale, tag: 'Acto humano' },
  { id: 'notificacion', label: 'Notificación al administrado', icon: Send, tag: 'Acto humano' },
];

export function PanelEstadoExpediente() {
  const { t } = useLanguage();
  const { tipoTramite } = useTipoTramite();

  const getStatusClasses = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'current':
        return 'bg-primary/10 text-primary border-primary animate-pulse';
      case 'pending':
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConnectorClasses = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'bg-green-300';
      default:
        return 'bg-border';
    }
  };

  return (
    <div className="card-institutional p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      <h3 className="font-serif font-semibold text-foreground text-sm mb-4">
        {t('aside.estado.title')}
      </h3>
      
      {/* Expediente info */}
      <div className="bg-secondary/50 rounded-lg p-3 mb-4">
        <div className="text-xs text-muted-foreground mb-1">{t('aside.estado.expediente')}</div>
        <div className="font-mono text-sm font-medium text-foreground">EX-2026-89717554-APN-ENACOM</div>
        <div className="text-xs text-muted-foreground mt-2">{t('aside.estado.tramite')}</div>
        <div className="text-sm text-foreground font-medium transition-all duration-300">{tipoTramite}</div>
      </div>

      {/* Timeline — Pasos dentro del alcance */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="flex items-start gap-3 group">
              <div className="flex flex-col items-center">
                <div 
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${getStatusClasses(step.status)}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {!isLast && (
                  <div className={`w-0.5 h-6 ${getConnectorClasses(step.status)} transition-colors duration-300`} />
                )}
              </div>
              
              <div className="pt-1.5">
                <div className={`text-xs font-medium ${step.status === 'current' ? 'text-primary' : step.status === 'completed' ? 'text-green-700' : 'text-muted-foreground'}`}>
                  {step.label}
                </div>
                {step.status === 'current' && (
                  <div className="text-[10px] text-primary/70 mt-0.5">
                    {t('aside.estado.enProceso')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Línea divisoria */}
      <div className="my-3 flex items-center gap-2">
        <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
        <span className="text-[10px] text-muted-foreground/50 italic whitespace-nowrap">
          Límite de intervención de Penélope
        </span>
        <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
      </div>

      {/* Pasos fuera del alcance */}
      <TooltipProvider delayDuration={200}>
        <div className="space-y-1 opacity-50">
          {stepsExternos.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === stepsExternos.length - 1;

            return (
              <Tooltip key={step.id}>
                <TooltipTrigger asChild>
                  <div className="flex items-start gap-3 group cursor-help">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border-2 border-border bg-muted text-muted-foreground flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      {!isLast && (
                        <div className="w-0.5 h-6 bg-border transition-colors duration-300" />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <div className="text-xs font-medium text-muted-foreground">{step.label}</div>
                      <div className="text-[10px] text-muted-foreground/60 italic">{step.tag}</div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="left" className="text-xs">
                  Fuera del alcance del sistema
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Progress indicator */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>{t('aside.estado.progreso')}</span>
          <span className="font-medium">40%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: '40%' }}
          />
        </div>
      </div>
    </div>
  );
}
