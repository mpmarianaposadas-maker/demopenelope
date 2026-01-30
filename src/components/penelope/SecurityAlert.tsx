import { AlertTriangle, ShieldAlert, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface SecurityAlertProps {
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  isVisible: boolean;
  onDismiss: () => void;
  matchedPatterns?: string[];
}

export function SecurityAlert({ 
  riskLevel, 
  isVisible, 
  onDismiss,
  matchedPatterns = [] 
}: SecurityAlertProps) {
  const { t } = useLanguage();

  if (riskLevel === 'none') return null;

  const getAlertConfig = () => {
    switch (riskLevel) {
      case 'high':
        return {
          variant: 'destructive' as const,
          icon: ShieldAlert,
          title: t('security.alert.high.title'),
          description: t('security.alert.high.description'),
          bgClass: 'bg-red-50 border-red-300',
          iconClass: 'text-red-600',
        };
      case 'medium':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          title: t('security.alert.medium.title'),
          description: t('security.alert.medium.description'),
          bgClass: 'bg-orange-50 border-orange-300',
          iconClass: 'text-orange-600',
        };
      case 'low':
        return {
          variant: 'default' as const,
          icon: ShieldCheck,
          title: t('security.alert.low.title'),
          description: t('security.alert.low.description'),
          bgClass: 'bg-yellow-50 border-yellow-300',
          iconClass: 'text-yellow-600',
        };
      default:
        return null;
    }
  };

  const config = getAlertConfig();
  if (!config) return null;

  const Icon = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-4 right-4 z-[100] max-w-md"
        >
          <Alert className={`${config.bgClass} shadow-lg border-2 relative pr-10`}>
            <Icon className={`h-5 w-5 ${config.iconClass}`} />
            <AlertTitle className="font-semibold">{config.title}</AlertTitle>
            <AlertDescription className="text-sm mt-1">
              {config.description}
              {matchedPatterns.length > 0 && riskLevel !== 'low' && (
                <div className="mt-2 text-xs opacity-75">
                  {t('security.alert.patternsDetected')}: {matchedPatterns.length}
                </div>
              )}
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 hover:bg-black/10"
              onClick={onDismiss}
              aria-label={t('security.alert.dismiss')}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Inline security indicator for input fields
interface SecurityIndicatorProps {
  riskLevel: 'none' | 'low' | 'medium' | 'high';
  className?: string;
}

export function SecurityIndicator({ riskLevel, className = '' }: SecurityIndicatorProps) {
  const { t } = useLanguage();

  if (riskLevel === 'none') {
    return (
      <div className={`flex items-center gap-1 text-xs text-green-600 ${className}`}>
        <ShieldCheck className="w-3 h-3" />
        <span>{t('security.indicator.safe')}</span>
      </div>
    );
  }

  const getConfig = () => {
    switch (riskLevel) {
      case 'high':
        return { color: 'text-red-600', label: t('security.indicator.high') };
      case 'medium':
        return { color: 'text-orange-600', label: t('security.indicator.medium') };
      case 'low':
        return { color: 'text-yellow-600', label: t('security.indicator.low') };
      default:
        return { color: 'text-muted-foreground', label: '' };
    }
  };

  const config = getConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-1 text-xs ${config.color} ${className}`}
    >
      <AlertTriangle className="w-3 h-3" />
      <span>{config.label}</span>
    </motion.div>
  );
}
