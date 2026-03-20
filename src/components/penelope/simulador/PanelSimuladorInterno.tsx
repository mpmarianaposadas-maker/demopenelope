import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Play, RotateCcw } from 'lucide-react';
import { FlujoProcedimiento } from './FlujoProcedimiento';
import { AlertaVencimiento, BotonAlertaVencimiento } from './AlertaVencimiento';
import { useSimuladorFlujo } from '@/hooks/useSimuladorFlujo';
import { useLanguage } from '@/hooks/useLanguage';
import { useLedger } from '@/contexts/LedgerContext';
import type { LedgerEntry } from '@/components/penelope/security/SecurityLedger';

const STEP_TASK_MAP: Record<string, LedgerEntry['taskType']> = {
  ingreso: 'VERIFICACION_VIGENCIA',
  verificacion: 'DETECCION_FALTANTES',
  clasificacion: 'CLASIFICACION_PRELIMINAR',
  plazos: 'CONTROL_PLAZOS',
  estado_final: 'GENERACION_PROVIDENCIA',
};

const STEP_OUTPUTS: Record<string, string> = {
  ingreso: 'Expediente ingresado correctamente. Carátula generada con número de actuación asignado.',
  verificacion: 'Documentación verificada contra RUPECO. Se comprobó vigencia de certificados y completitud formal.',
  clasificacion: 'Trámite clasificado preliminarmente según matriz normativa. Área competente identificada.',
  plazos: 'Plazo legal perentorio calculado. Cronograma de alertas configurado (10, 5 y 2 días hábiles).',
  estado_final: 'Evaluación formal completada. Borrador de providencia de pase generado para revisión humana.',
};

export function PanelSimuladorInterno() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { agregarEntrada, reiniciarLedger } = useLedger();
  const prevCompletedRef = useRef<Set<string>>(new Set());
  const {
    pasos,
    expediente,
    simulando,
    alertaVisible,
    iniciarSimulacion,
    reiniciarSimulacion,
    simularAlerta,
    cerrarAlerta,
  } = useSimuladorFlujo();

  const pasoActivo = pasos.find(p => p.estado === 'activo');

  // Track completed steps and add ledger entries
  useEffect(() => {
    const completedIds = new Set(pasos.filter(p => p.estado === 'completado').map(p => p.id));
    completedIds.forEach(id => {
      if (!prevCompletedRef.current.has(id) && expediente.numero) {
        const taskType = STEP_TASK_MAP[id];
        if (taskType) {
          const promptNum = String(Math.floor(Math.random() * 900000) + 100000);
          agregarEntrada({
            caseId: expediente.numero,
            promptId: `PNL-${new Date().getFullYear()}-${promptNum}`,
            taskType,
            inputHash: `${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
            outputIA: STEP_OUTPUTS[id] || 'Paso completado.',
            validadorId: 'AGT-López, M.',
            timestamp: new Date(),
            estado: 'convalidado',
          });
        }
      }
    });
    prevCompletedRef.current = completedIds;
  }, [pasos, expediente.numero, agregarEntrada]);

  useEffect(() => {
    if (pasoActivo) {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pasoActivo?.id]);

  const puedeSimularAlerta = expediente.estado !== 'sin_iniciar' && !simulando;

  return (
    <div ref={panelRef} className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{t('simulador.title')}</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('simulador.subtitle')}
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 self-start sm:self-center"
            >
              🔒 {t('simulador.badge')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <p className="text-sm text-muted-foreground">
            {t('simulador.intro')}
          </p>
          {/* Rótulos de supervisión humana */}
          <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-1.5">
            <p className="text-sm text-foreground flex items-center gap-2"><span className="text-green-600">✔</span> Revisión por analista responsable</p>
            <p className="text-sm text-foreground flex items-center gap-2"><span className="text-green-600">✔</span> Validación humana previa obligatoria</p>
            <p className="text-sm text-foreground flex items-center gap-2"><span className="text-green-600">✔</span> Firma y responsabilidad institucional</p>
          </div>
        </CardContent>
      </Card>

      {/* Flujo de procedimiento */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            {t('simulador.flujo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FlujoProcedimiento pasos={pasos} t={t} />
          
          <Separator className="my-4" />
          
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {expediente.estado === 'sin_iniciar' ? (
              <Button onClick={iniciarSimulacion} disabled={simulando}>
                <Play className="w-4 h-4 mr-2" />
                {t('simulador.boton.iniciar')}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={() => { reiniciarSimulacion(); reiniciarLedger(); }} 
                disabled={simulando}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('simulador.boton.reiniciar')}
              </Button>
            )}
            
            <BotonAlertaVencimiento 
              onClick={simularAlerta}
              disabled={!puedeSimularAlerta}
              t={t}
            />
          </div>
        </CardContent>
      </Card>

      {/* Alert dialog */}
      <AlertaVencimiento
        open={alertaVisible}
        onClose={cerrarAlerta}
        expedienteNumero={expediente.numero}
        t={t}
      />
    </div>
  );
}
