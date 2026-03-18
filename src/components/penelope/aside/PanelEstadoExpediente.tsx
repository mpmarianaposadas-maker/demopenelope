import { useLanguage } from '@/hooks/useLanguage';
import { useTipoTramite } from '@/contexts/TipoTramiteContext';
import { CheckCircle2, Clock, FileText, AlertCircle, User } from 'lucide-react';

const steps = [
  { id: 'ingreso', icon: FileText, status: 'completed' as const },
  { id: 'verificacion', icon: CheckCircle2, status: 'completed' as const },
  { id: 'analisis', icon: Clock, status: 'current' as const },
  { id: 'decision', icon: AlertCircle, status: 'pending' as const },
  { id: 'notificacion', icon: User, status: 'pending' as const },
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

      {/* Timeline */}
      <div className="space-y-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="flex items-start gap-3 group">
              {/* Icon container */}
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
              
              {/* Text */}
              <div className="pt-1.5">
                <div className={`text-xs font-medium ${step.status === 'current' ? 'text-primary' : step.status === 'completed' ? 'text-green-700' : 'text-muted-foreground'}`}>
                  {t(`aside.estado.step.${step.id}`)}
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
