import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

interface AlertaVencimientoProps {
  open: boolean;
  onClose: () => void;
  expedienteNumero: string;
  t: (key: string) => string;
}

export function AlertaVencimiento({ 
  open, 
  onClose, 
  expedienteNumero, 
  t 
}: AlertaVencimientoProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            {t('simulador.alerta.titulo')}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 pt-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-destructive/10 border border-destructive/30 rounded-lg p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      {t('simulador.alerta.mensaje')}
                    </p>
                    {expedienteNumero && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{t('simulador.alerta.expediente')}:</span>{' '}
                        {expedienteNumero}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-2">
                  <span className="text-primary">📋</span>
                  {t('simulador.alerta.registro')}
                </p>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end pt-2">
          <Button onClick={onClose} variant="outline">
            {t('simulador.alerta.cerrar')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface BotonAlertaVencimientoProps {
  onClick: () => void;
  disabled?: boolean;
  t: (key: string) => string;
}

export function BotonAlertaVencimiento({ 
  onClick, 
  disabled = false,
  t 
}: BotonAlertaVencimientoProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <AlertTriangle className="w-4 h-4 mr-2" />
      {t('simulador.alerta.boton')}
    </Button>
  );
}
