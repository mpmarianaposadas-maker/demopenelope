import { Badge } from '@/components/ui/badge';
import { Cpu, BrainCircuit, UserCheck, User } from 'lucide-react';

type ActorType = 'reglas' | 'llm' | 'validacion' | 'humano-exclusivo';

const config: Record<ActorType, { label: string; icon: React.ReactNode; className: string }> = {
  reglas: {
    label: 'Motor de reglas',
    icon: <Cpu className="w-3 h-3" />,
    className: 'border-blue-300 text-blue-700 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800',
  },
  llm: {
    label: 'Asistencia LLM',
    icon: <BrainCircuit className="w-3 h-3" />,
    className: 'border-purple-300 text-purple-700 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800',
  },
  validacion: {
    label: 'Validación humana obligatoria',
    icon: <UserCheck className="w-3 h-3" />,
    className: 'border-green-300 text-green-700 bg-green-50 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800',
  },
  'humano-exclusivo': {
    label: 'Acto humano exclusivo',
    icon: <User className="w-3 h-3" />,
    className: 'border-amber-400 text-amber-800 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-700',
  },
};

interface ActorLabelProps {
  types: ActorType[];
  size?: 'sm' | 'xs';
}

export function ActorLabels({ types, size = 'xs' }: ActorLabelProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {types.map((type) => {
        const c = config[type];
        return (
          <Badge
            key={type}
            variant="outline"
            className={`${c.className} ${size === 'xs' ? 'text-[10px] px-1.5 py-0' : 'text-xs px-2 py-0.5'} gap-1 font-medium`}
          >
            {c.icon}
            {c.label}
          </Badge>
        );
      })}
    </div>
  );
}

export type { ActorType };
