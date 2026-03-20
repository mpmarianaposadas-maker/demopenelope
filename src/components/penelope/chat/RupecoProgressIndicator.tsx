import { CheckCircle2, Circle, Loader2, UserCheck, Inbox, Bot, User, Search, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

// Tipos sincronizados con el hook
export type RupecoStep = 
  | 'inicio'
  | 'ingreso_recepcion'
  | 'clasificacion_ia'
  | 'confirmacion_clasificacion'
  | 'validacion_documental'
  | 'resultado'
  | 'evaluacion';

interface StepConfig {
  id: RupecoStep;
  label: string;
  shortLabel: string;
  icon: ReactNode;
}

// Pasos según el diagrama de flujo del documento
const STEPS: StepConfig[] = [
  { id: 'ingreso_recepcion', label: 'Ingreso y Recepción', shortLabel: 'Ingreso', icon: <Inbox size={16} /> },
  { id: 'clasificacion_ia', label: 'Clasificación IA', shortLabel: 'Clasif.', icon: <Bot size={16} /> },
  { id: 'confirmacion_clasificacion', label: 'Confirmación Operador', shortLabel: 'Confirm.', icon: <User size={16} /> },
  { id: 'validacion_documental', label: 'Validación Documental', shortLabel: 'Valid.', icon: <Search size={16} /> },
  { id: 'resultado', label: 'Resultado', shortLabel: 'Result.', icon: <ClipboardList size={16} /> },
  { id: 'evaluacion', label: 'Evaluación', shortLabel: 'Eval.', icon: <CheckCircle2 size={16} /> },
];

interface RupecoProgressIndicatorProps {
  currentStep: RupecoStep;
  esPJ?: boolean;
}

export function RupecoProgressIndicator({ currentStep, esPJ = true }: RupecoProgressIndicatorProps) {
  const getStepIndex = (step: RupecoStep): number => {
    if (step === 'inicio') return -1;
    return STEPS.findIndex(s => s.id === step);
  };

  const currentIndex = getStepIndex(currentStep);
  const isComplete = currentStep === 'evaluacion';

  // No mostrar si estamos en inicio
  if (currentStep === 'inicio') return null;

  return (
    <div className="bg-muted/50 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          Flujo de Verificación RUPECO
        </span>
        <span className="text-xs text-muted-foreground">
          {isComplete ? <><CheckCircle2 size={14} className="inline mr-1" />Completo</> : `Paso ${currentIndex + 1} de ${STEPS.length}`}
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
            width: `${isComplete ? 100 : ((currentIndex + 1) / STEPS.length) * 100}%` 
          }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between gap-1">
        {STEPS.map((step, index) => {
          const isActive = currentIndex === index;
          const isDone = currentIndex > index || isComplete;
          const isConfirmStep = step.id === 'confirmacion_clasificacion';
          
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
                  isActive && isConfirmStep && "bg-amber-500 text-white ring-2 ring-amber-300",
                  !isDone && !isActive && "bg-muted text-muted-foreground"
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : isActive && isConfirmStep ? (
                  <UserCheck className="h-3 w-3" />
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
                  isActive && !isDone && !isConfirmStep && "text-primary font-medium",
                  isActive && isConfirmStep && "text-amber-600 font-medium",
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
      {!isComplete && currentIndex >= 0 && (
        <div className="mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-lg">{STEPS[currentIndex]?.icon || <ClipboardList size={16} />}</span>
            <span className="text-muted-foreground">
              <strong className="text-foreground">{STEPS[currentIndex]?.label}</strong>
              {STEPS[currentIndex]?.id === 'confirmacion_clasificacion' && (
                <span className="ml-2 text-amber-600">— Requiere confirmación del operador</span>
              )}
            </span>
          </div>
        </div>
      )}

      {isComplete && (
        <div className="mt-3 pt-2 border-t border-border/50">
          <div className="flex items-center gap-2 text-xs text-green-600">
            <span className="text-lg"><CheckCircle2 size={16} className="text-green-600" /></span>
            <span>
              <strong>Evaluación generada.</strong> Expediente verificado.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
