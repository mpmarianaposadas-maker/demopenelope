import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SiguientePasoProps {
  label: string;
  description: string;
  onNavigate: () => void;
  icon?: React.ReactNode;
}

export function SiguientePaso({ label, description, onNavigate, icon }: SiguientePasoProps) {
  return (
    <div className="mt-6 bg-secondary/30 rounded-lg p-4 border border-border">
      <p className="text-xs text-muted-foreground mb-2">Siguiente paso sugerido:</p>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigate}
          className="flex-shrink-0"
        >
          {label}
          {icon || <ArrowRight size={14} className="ml-1.5" />}
        </Button>
      </div>
    </div>
  );
}
