import { motion } from 'framer-motion';
import { PasoFlujo } from './PasoFlujo';
import type { PasoFlujo as PasoFlujoType } from '@/hooks/useSimuladorFlujo';

interface FlujoProcedimientoProps {
  pasos: PasoFlujoType[];
  t: (key: string) => string;
}

export function FlujoProcedimiento({ pasos, t }: FlujoProcedimientoProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
      role="list"
      aria-label={t('simulador.flujo.ariaLabel')}
    >
      {pasos.map((paso, index) => (
        <motion.div
          key={paso.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          role="listitem"
        >
          <PasoFlujo 
            paso={paso} 
            t={t} 
            isLast={index === pasos.length - 1} 
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
