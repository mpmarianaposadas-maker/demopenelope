import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type RupecoStep = 
  | 'tipo_tramite'
  | 'identificacion_responsable'
  | 'domicilios_contacto'
  | 'representacion'
  | 'datos_societarios'
  | 'licencia_servicio'
  | 'confirmacion'
  | 'evaluacion';

interface StepConfig {
  id: RupecoStep;
  label: string;
  shortLabel: string;
  icon: string;
}

const STEPS: StepConfig[] = [
  { id: 'tipo_tramite', label: 'Tipo de Trámite', shortLabel: 'Trámite', icon: '📋' },
  { id: 'identificacion_responsable', label: 'Identificación', shortLabel: 'ID', icon: '👤' },
  { id: 'domicilios_contacto', label: 'Domicilios', shortLabel: 'Dom.', icon: '📍' },
  { id: 'representacion', label: 'Representación', shortLabel: 'Rep.', icon: '🤝' },
  { id: 'datos_societarios', label: 'Societarios', shortLabel: 'Soc.', icon: '🏢' },
  { id: 'licencia_servicio', label: 'Licencia', shortLabel: 'Lic.', icon: '📄' },
];

interface RupecoProgressIndicatorProps {
  currentStep: RupecoStep;
  esPJ?: boolean;
}

export function RupecoProgressIndicator({ currentStep, esPJ = true }: RupecoProgressIndicatorProps) {
  const getStepIndex = (step: RupecoStep): number => {
    if (step === 'confirmacion' || step === 'evaluacion') return STEPS.length;
    return STEPS.findIndex(s => s.id === step);
  };

  const currentIndex = getStepIndex(currentStep);
  const isComplete = currentStep === 'confirmacion' || currentStep === 'evaluacion';

  // Filtrar datos societarios si no es PJ
  const visibleSteps = esPJ ? STEPS : STEPS.filter(s => s.id !== 'datos_societarios');

  return (
    <div className="bg-muted/50 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Núcleo RUPECO
        </span>
        <span className="text-xs text-muted-foreground">
          {isComplete ? 'Completo' : `Bloque ${Math.min(currentIndex + 1, visibleSteps.length)} de ${visibleSteps.length}`}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
        <div 
          className={cn(
            "h-full transition-all duration-500 ease-out",
            isComplete ? "bg-green-500" : "bg-primary"
          )}
          style={{ 
            width: `${isComplete ? 100 : ((currentIndex) / visibleSteps.length) * 100}%` 
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between gap-1">
        {visibleSteps.map((step, index) => {
          const stepIndex = STEPS.findIndex(s => s.id === step.id);
          const isActive = currentIndex === stepIndex;
          const isDone = currentIndex > stepIndex || isComplete;
          
          return (
            <div 
              key={step.id}
              className={cn(
                "flex flex-col items-center gap-1 flex-1 min-w-0",
                "transition-all duration-300"
              )}
            >
              <div 
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all",
                  isDone && "bg-green-500 text-white",
                  isActive && !isDone && "bg-primary text-primary-foreground ring-2 ring-primary/30",
                  !isDone && !isActive && "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isActive ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <span 
                className={cn(
                  "text-[10px] text-center truncate w-full",
                  isDone && "text-green-600 font-medium",
                  isActive && !isDone && "text-primary font-medium",
                  !isDone && !isActive && "text-muted-foreground"
                )}
              >
                {step.shortLabel}
              </span>
            </div>
          );
        })}
      </div>

      {/* Current step description */}
      {!isComplete && (
        <div className="mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-lg">{STEPS[currentIndex]?.icon || '✅'}</span>
            <span className="text-muted-foreground">
              Completando: <strong className="text-foreground">{STEPS[currentIndex]?.label || 'Evaluación'}</strong>
            </span>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-green-600">
            <span className="text-lg">✅</span>
            <span>
              <strong>Relevamiento completo.</strong> Escribí "listo" para evaluar.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
