import { Card } from '../Card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { ShieldCheck, AlertTriangle, ShieldAlert, Edit, Send, AlertOctagon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export type RiskLevel = 'none' | 'low' | 'medium' | 'high';

interface RiskLevelCardProps {
  riskLevel: RiskLevel;
  canProceed: boolean;
  requiresConfirmation: boolean;
  isBlocked: boolean;
  onEdit: () => void;
  onConfirm: () => void;
  onEscalate?: () => void;
  isLoading?: boolean;
}

export function RiskLevelCard({
  riskLevel,
  canProceed,
  requiresConfirmation,
  isBlocked,
  onEdit,
  onConfirm,
  onEscalate,
  isLoading = false
}: RiskLevelCardProps) {
  const { t } = useLanguage();
  const { isSystemActive } = useKillSwitch();

  const getConfig = () => {
    if (!isSystemActive) {
      return {
        icon: AlertOctagon,
        title: t('security.risk.suspended.title'),
        description: t('security.risk.suspended.description'),
        action: t('security.risk.suspended.action'),
        bgColor: 'bg-muted',
        borderColor: 'border-muted-foreground/30',
        iconColor: 'text-muted-foreground',
        badgeVariant: 'secondary' as const,
        badgeLabel: 'SUSPENDIDO'
      };
    }

    switch (riskLevel) {
      case 'low':
      case 'none':
        return {
          icon: ShieldCheck,
          title: t('security.risk.low.title'),
          description: t('security.risk.low.description'),
          action: t('security.risk.low.action'),
          bgColor: 'bg-green-50 dark:bg-green-950/30',
          borderColor: 'border-green-200 dark:border-green-800',
          iconColor: 'text-green-600',
          badgeVariant: 'default' as const,
          badgeLabel: 'BAJO'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          title: t('security.risk.medium.title'),
          description: t('security.risk.medium.description'),
          action: t('security.risk.medium.action'),
          bgColor: 'bg-orange-50 dark:bg-orange-950/30',
          borderColor: 'border-orange-200 dark:border-orange-800',
          iconColor: 'text-orange-500',
          badgeVariant: 'default' as const,
          badgeLabel: 'MEDIO'
        };
      case 'high':
        return {
          icon: ShieldAlert,
          title: t('security.risk.high.title'),
          description: t('security.risk.high.description'),
          action: t('security.risk.high.action'),
          bgColor: 'bg-red-50 dark:bg-red-950/30',
          borderColor: 'border-red-200 dark:border-red-800',
          iconColor: 'text-destructive',
          badgeVariant: 'destructive' as const,
          badgeLabel: 'ALTO'
        };
      default:
        return {
          icon: ShieldCheck,
          title: '',
          description: '',
          action: '',
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          iconColor: 'text-muted-foreground',
          badgeVariant: 'outline' as const,
          badgeLabel: '--'
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`${config.bgColor} border-2 ${config.borderColor}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${config.bgColor}`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-semibold text-foreground">{config.title}</h3>
              <Badge variant={config.badgeVariant} className="text-xs font-bold">
                Riesgo {config.badgeLabel}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground">
              {config.description}
            </p>
            
            <div className="p-3 bg-background/50 rounded-lg border border-border/50">
              <p className="text-xs font-medium text-foreground mb-1">
                {t('security.risk.suggestedAction')}
              </p>
              <p className="text-xs text-muted-foreground">
                {config.action}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
                className="gap-2"
                disabled={isLoading}
              >
                <Edit className="w-4 h-4" />
                {t('security.risk.edit')}
              </Button>
              
              {canProceed && !isBlocked && isSystemActive && (
                <Button
                  size="sm"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className="gap-2"
                  variant={requiresConfirmation ? 'default' : 'default'}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {requiresConfirmation 
                    ? t('security.risk.confirmWithReview')
                    : t('security.risk.confirm')
                  }
                </Button>
              )}
              
              {(isBlocked || !isSystemActive) && onEscalate && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={onEscalate}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <AlertOctagon className="w-4 h-4" />
                  {t('security.risk.escalate')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
