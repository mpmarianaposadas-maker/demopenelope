import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Shield, Play, RotateCcw, Info } from 'lucide-react';
import { FlujoProcedimiento } from './FlujoProcedimiento';
import { AlertaVencimiento, BotonAlertaVencimiento } from './AlertaVencimiento';
import { EstadoExpedienteResult } from './EstadoExpedienteResult';
import { useSimuladorFlujo } from '@/hooks/useSimuladorFlujo';
import { useLanguage } from '@/hooks/useLanguage';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function PanelSimuladorInterno() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
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

  const puedeSimularAlerta = expediente.estado !== 'sin_iniciar' && !simulando;

  return (
    <div className="space-y-6">
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

      {/* Main simulation area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Timeline column */}
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
                  onClick={reiniciarSimulacion} 
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

        {/* Result column */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                {t('simulador.resultado.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {expediente.estado === 'sin_iniciar' ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">{t('simulador.resultado.esperando')}</p>
                </motion.div>
              ) : (
                <EstadoExpedienteResult expediente={expediente} t={t} />
              )}
            </CardContent>
          </Card>

          {/* Restriction notice */}
          <Alert variant="default" className="bg-muted/50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {t('simulador.restriccion')}
            </AlertDescription>
          </Alert>
        </div>
      </div>

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
