import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Check, Loader2, FileInput, FolderSearch, Tag, Clock, CheckCircle } from 'lucide-react';
import type { PasoFlujo as PasoFlujoType } from '@/hooks/useSimuladorFlujo';

const STEP_ICONS: Record<string, React.ReactNode> = {
  ingreso: <FileInput size={18} />,
  verificacion: <FolderSearch size={18} />,
  clasificacion: <Tag size={18} />,
  plazos: <Clock size={18} />,
  estado_final: <CheckCircle size={18} />,
};

interface PasoFlujoProps {
  paso: PasoFlujoType;
  t: (key: string) => string;
  isLast?: boolean;
}

export function PasoFlujo({ paso, t, isLast = false }: PasoFlujoProps) {
  const { numero, tituloKey, tooltipKey, icono, estado } = paso;

  return (
    <div className="flex items-start gap-4">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: estado === 'activo' ? 1.1 : 1,
                  opacity: 1,
                }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-lg',
                  'border-2 transition-all duration-300 cursor-help',
                  estado === 'pendiente' && 'bg-muted border-muted-foreground/30 text-muted-foreground',
                  estado === 'activo' && 'bg-primary/20 border-primary text-primary animate-pulse',
                  estado === 'completado' && 'bg-primary border-primary text-primary-foreground'
                )}
                aria-label={`Paso ${numero}: ${t(tituloKey)} - ${estado}`}
              >
                {estado === 'completado' ? (
                  <Check className="w-5 h-5" />
                ) : estado === 'activo' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  STEP_ICONS[paso.id] || <FileInput size={18} />
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent 
              side="right" 
              className="max-w-xs text-sm"
              aria-describedby={`tooltip-${paso.id}`}
            >
              <p id={`tooltip-${paso.id}`}>{t(tooltipKey)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {/* Connector line */}
        {!isLast && (
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: 40 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className={cn(
              'w-0.5 mt-2 transition-colors duration-300',
              estado === 'completado' ? 'bg-primary' : 'bg-border'
            )}
          />
        )}
      </div>

      {/* Step content */}
      <motion.div 
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex-1 pt-2"
      >
        <div className="flex items-center gap-2">
          <span 
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              estado === 'pendiente' && 'bg-muted text-muted-foreground',
              estado === 'activo' && 'bg-primary/20 text-primary',
              estado === 'completado' && 'bg-primary text-primary-foreground'
            )}
          >
            {numero}
          </span>
          <h4 
            className={cn(
              'font-medium transition-colors',
              estado === 'pendiente' && 'text-muted-foreground',
              estado === 'activo' && 'text-primary',
              estado === 'completado' && 'text-foreground'
            )}
          >
            {t(tituloKey)}
          </h4>
        </div>
        
        {/* Tooltip text shown on mobile */}
        <p className="text-xs text-muted-foreground mt-1 md:hidden">
          {t(tooltipKey)}
        </p>
      </motion.div>
    </div>
  );
}
