import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { FileInput, FolderSearch, Tag, Clock, UserCheck, Scale, Send, AlertTriangle, CalendarDays, Info, User } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function calcularDiasHabilesRestantes(): number {
  const hoy = new Date();
  const limite = new Date(2026, 3, 4); // 04/04/2026
  let dias = 0;
  const current = new Date(hoy);
  current.setHours(0, 0, 0, 0);
  while (current < limite) {
    current.setDate(current.getDate() + 1);
    const dow = current.getDay();
    if (dow !== 0 && dow !== 6) dias++;
  }
  return Math.max(0, dias);
}

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
  const tipoTramite = 'Licencia TIC - Alta nueva';

  const diasRestantes = useMemo(() => calcularDiasHabilesRestantes(), []);

  const semaforoClasses = diasRestantes > 10
    ? { bg: 'bg-green-100', text: 'text-green-800', border: 'border-l-green-500' }
    : diasRestantes >= 5
      ? { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-l-yellow-500' }
      : { bg: 'bg-red-100', text: 'text-red-800', border: 'border-l-red-500' };
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

      {/* Control de Plazo */}
      <div className={`rounded-lg p-3 mb-4 border-l-4 ${semaforoClasses.border} ${semaforoClasses.bg}`}>
        <div className={`flex items-center gap-1.5 text-xs font-semibold ${semaforoClasses.text} mb-2`}>
          <AlertTriangle size={14} />
          <span>Plazo legal de resolución</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mb-2">
          <div className="text-muted-foreground">Ingreso:</div>
          <div className="font-medium text-foreground flex items-center gap-1">
            <CalendarDays size={12} className="text-muted-foreground" />
            05/03/2026
          </div>
          <div className="text-muted-foreground">Límite:</div>
          <div className="font-medium text-foreground flex items-center gap-1">
            <CalendarDays size={12} className="text-muted-foreground" />
            04/04/2026
          </div>
        </div>
        <div className={`text-sm font-bold ${semaforoClasses.text} tabular-nums`}>
          {diasRestantes} días hábiles restantes
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 italic">
          Silencio positivo: Decreto 971/2024
        </div>
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
      <div className="my-3 relative group flex items-center gap-2 cursor-help">
        <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
        <span className="text-[10px] text-muted-foreground/50 italic whitespace-nowrap flex items-center gap-1">
          Límite de intervención de Penélope
          <Info size={12} className="text-muted-foreground/40" />
        </span>
        <div className="flex-1 border-t border-dashed border-muted-foreground/30" />
        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 max-w-xs z-10 text-center">
          Penélope interviene exclusivamente en etapas preliminares no discrecionales — art. 2 Reglamento propuesto
        </div>
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
                      <span className="inline-flex items-center gap-0.5 mt-0.5 border border-amber-300 bg-amber-50 text-amber-800 rounded-sm text-xs font-medium px-1.5 py-0.5">
                        <User size={10} className="inline mr-0.5" />
                        Acto humano exclusivo
                      </span>
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
