import { Card, CardTitle, CardText } from '../Card';
import { ValidationPanel, SecurityRulesPanel } from '../security';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, BookOpen, Info, ShieldAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
export function SecurityDemoPanel() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Introduction */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <CardTitle>{t('security.module.title')}</CardTitle>
        </div>
        <CardText className="mb-4">{t('security.module.description')}</CardText>
        
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-3">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">{t('security.module.roleTitle')}</h4>
              <p className="text-xs text-muted-foreground mt-1">
                {t('security.module.roleDesc')}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium">{t('security.module.objectivesTitle')}</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-1 list-disc list-inside">
                <li>{t('security.module.objective1')}</li>
                <li>{t('security.module.objective2')}</li>
                <li>{t('security.module.objective3')}</li>
                <li>{t('security.module.objective4')}</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Security Rules Panel */}
      <SecurityRulesPanel />

      {/* Responsible Security Notice */}
      <Alert className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20 [&>svg]:text-yellow-600">
        <ShieldAlert className="h-5 w-5" />
        <AlertTitle className="font-semibold">Nota de seguridad responsable</AlertTitle>
        <AlertDescription className="text-sm mt-1">
          Este módulo no incluye ejemplos precargados de inyección de prompt ni datos sensibles (PII). 
          Proveer patrones de ataque listos para usar podría facilitar su replicación maliciosa en otros sistemas. 
          El motor de detección está activo: puede probarse ingresando texto libre en el chat del módulo "Demo Interactiva".
        </AlertDescription>
      </Alert>

      {/* Main Validation Panel with Ledger */}
      <ValidationPanel />
    </div>
  );
}
