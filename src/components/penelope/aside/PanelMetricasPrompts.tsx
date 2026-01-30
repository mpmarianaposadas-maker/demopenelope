import { useLanguage } from '@/hooks/useLanguage';
import { Brain, Zap, Clock, Shield } from 'lucide-react';

interface MetricItemProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue?: string;
  color: 'primary' | 'green' | 'amber' | 'blue';
}

function MetricItem({ icon: Icon, label, value, subValue, color }: MetricItemProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg transition-all duration-300 hover:bg-secondary/50 group cursor-default">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${colorClasses[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className="text-sm font-semibold text-foreground flex items-baseline gap-1">
          {value}
          {subValue && <span className="text-xs font-normal text-muted-foreground">{subValue}</span>}
        </div>
      </div>
    </div>
  );
}

export function PanelMetricasPrompts() {
  const { t } = useLanguage();

  return (
    <div className="card-institutional p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      <h3 className="font-serif font-semibold text-foreground text-sm mb-4">
        {t('aside.prompts.title')}
      </h3>

      <div className="space-y-1">
        <MetricItem 
          icon={Brain}
          label={t('aside.prompts.totalPrompts')}
          value="47"
          subValue={t('aside.prompts.hoy')}
          color="primary"
        />
        <MetricItem 
          icon={Zap}
          label={t('aside.prompts.tokens')}
          value="12.4K"
          subValue={t('aside.prompts.consumidos')}
          color="amber"
        />
        <MetricItem 
          icon={Clock}
          label={t('aside.prompts.latencia')}
          value="1.2s"
          subValue={t('aside.prompts.promedio')}
          color="blue"
        />
        <MetricItem 
          icon={Shield}
          label={t('aside.prompts.confianza')}
          value="97.3%"
          color="green"
        />
      </div>

      {/* Recent activity */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="text-xs font-medium text-muted-foreground mb-2">
          {t('aside.prompts.ultimaActividad')}
        </div>
        <div className="space-y-2">
          <div className="text-xs p-2 bg-secondary/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-foreground">{t('aside.prompts.modulo.verificacion')}</span>
              <span className="text-muted-foreground">2m</span>
            </div>
            <div className="text-muted-foreground">235 tokens · 0.8s</div>
          </div>
          <div className="text-xs p-2 bg-secondary/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-foreground">{t('aside.prompts.modulo.redactor')}</span>
              <span className="text-muted-foreground">5m</span>
            </div>
            <div className="text-muted-foreground">1,847 tokens · 2.1s</div>
          </div>
          <div className="text-xs p-2 bg-secondary/50 rounded-lg">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-foreground">{t('aside.prompts.modulo.clasificador')}</span>
              <span className="text-muted-foreground">8m</span>
            </div>
            <div className="text-muted-foreground">156 tokens · 0.4s</div>
          </div>
        </div>
      </div>

      {/* Footer badge */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-lg py-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span>{t('aside.prompts.ledgerActivo')}</span>
      </div>
    </div>
  );
}
