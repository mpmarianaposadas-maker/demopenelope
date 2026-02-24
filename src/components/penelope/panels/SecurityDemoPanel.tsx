import { Card, CardTitle, CardText } from '../Card';
import { SecurityRulesPanel } from '../security';
import { SecurityLedger, type LedgerEntry } from '../security/SecurityLedger';
import { useLanguage } from '@/hooks/useLanguage';
import { Shield, BookOpen, Info, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const DEMO_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: '1',
    caseId: 'EX-2026-00012345-APN-ENACOM',
    promptId: 'PNL-2026-001234',
    taskType: 'VERIFICACION_VIGENCIA',
    inputHash: 'a3f7c9e2...d41b',
    outputIA: 'Documentación RUPECO vigente. Certificado de cobertura vence en 45 días. Sin faltantes detectados.',
    validadorId: 'AGT-López, M.',
    timestamp: new Date(2026, 1, 24, 9, 15, 30),
    estado: 'convalidado',
  },
  {
    id: '2',
    caseId: 'EX-2026-00012345-APN-ENACOM',
    promptId: 'PNL-2026-001235',
    taskType: 'CLASIFICACION_PRELIMINAR',
    inputHash: 'b8d2e1f4...c72a',
    outputIA: 'Trámite clasificado como Licencia TIC - Resolución ENACOM 40/2020. Área competente: DNTYC.',
    validadorId: 'AGT-López, M.',
    timestamp: new Date(2026, 1, 24, 9, 18, 12),
    estado: 'convalidado',
  },
  {
    id: '3',
    caseId: 'EX-2026-00009871-APN-ENACOM',
    promptId: 'PNL-2026-001240',
    taskType: 'DETECCION_FALTANTES',
    inputHash: 'c1a9b3d7...e58f',
    outputIA: 'Faltante detectado: Certificado de capacidad económica (Art. 12, Res. 40/2020). Último presentado: vencido 15/01/2026.',
    validadorId: 'AGT-Fernández, R.',
    timestamp: new Date(2026, 1, 24, 10, 5, 44),
    estado: 'corregido',
  },
  {
    id: '4',
    caseId: 'EX-2026-00012345-APN-ENACOM',
    promptId: 'PNL-2026-001242',
    taskType: 'GENERACION_PROVIDENCIA',
    inputHash: 'd4f6a8c2...b91e',
    outputIA: 'Atento el resultado favorable de la validación automática de admisibilidad formal, PASE a la DNTYC para prosecución del análisis técnico sustantivo.',
    validadorId: 'AGT-López, M.',
    timestamp: new Date(2026, 1, 24, 10, 22, 8),
    estado: 'convalidado',
  },
  {
    id: '5',
    caseId: 'EX-2026-00009871-APN-ENACOM',
    promptId: 'PNL-2026-001245',
    taskType: 'CONTROL_PLAZOS',
    inputHash: 'e7b3c5a1...f64d',
    outputIA: 'Expediente a 8 días hábiles del vencimiento del plazo perentorio (40 días). Alerta temprana activada.',
    validadorId: 'AGT-Fernández, R.',
    timestamp: new Date(2026, 1, 24, 11, 0, 15),
    estado: 'convalidado',
  },
];

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

      {/* Risk Matrix - Anexo III */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <CardTitle>Matriz de Riesgos</CardTitle>
        </div>
        <CardText className="mb-4">
          Evaluación de riesgos conforme al Anexo III del trabajo final. Cada riesgo incluye su nivel inicial, la estrategia de mitigación implementada por Penélope y el nivel residual resultante.
        </CardText>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-semibold text-foreground">Riesgo</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">Nivel Inicial</th>
                <th className="text-left py-2 px-3 font-semibold text-foreground">Mitigación</th>
                <th className="text-center py-2 px-3 font-semibold text-foreground">Residual</th>
              </tr>
            </thead>
            <tbody>
              {[
                { riesgo: 'Sesgo algorítmico', inicial: 'ALTO', mitigacion: 'Dataset curado + Auditorías periódicas', residual: 'BAJO' },
                { riesgo: 'Alucinaciones', inicial: 'MEDIO', mitigacion: 'Temperatura 0 + Anclaje normativo', residual: 'BAJO' },
                { riesgo: 'Prompt Injection', inicial: 'ALTO', mitigacion: 'Sanitización + Prompt defensivo', residual: 'MEDIO' },
                { riesgo: 'Privacidad (PII)', inicial: 'MEDIO', mitigacion: 'Filtros de entrada + Ley 25.326', residual: 'BAJO' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-2.5 px-3 font-medium text-foreground">{row.riesgo}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge variant="outline" className={row.inicial === 'ALTO' ? 'border-red-300 text-red-700 bg-red-50' : 'border-amber-300 text-amber-700 bg-amber-50'}>
                      {row.inicial}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{row.mitigacion}</td>
                  <td className="py-2.5 px-3 text-center">
                    <Badge variant="outline" className={row.residual === 'BAJO' ? 'border-green-300 text-green-700 bg-green-50' : 'border-amber-300 text-amber-700 bg-amber-50'}>
                      {row.residual}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Registro de Interacciones Algorítmicas - Anexo III */}
      <SecurityLedger entries={DEMO_LEDGER_ENTRIES} />

    </div>
  );
}
