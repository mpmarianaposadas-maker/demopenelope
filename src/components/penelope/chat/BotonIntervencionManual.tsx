import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Hand, AlertTriangle, UserCheck, Clock } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import type { PasoIntervenido } from '@/hooks/useIntervencionManual';

interface BotonIntervencionManualProps {
  paso: PasoIntervenido;
  onIntervenir: (agenteNombre: string, motivo: string) => void;
  disabled?: boolean;
  className?: string;
}

const pasosLabels: Record<PasoIntervenido, { es: string; en: string }> = {
  clasificacion: { es: 'Clasificación', en: 'Classification' },
  verificacion: { es: 'Verificación Documental', en: 'Document Verification' },
  plazos: { es: 'Control de Plazos', en: 'Deadline Control' }
};

export function BotonIntervencionManual({
  paso,
  onIntervenir,
  disabled = false,
  className = ''
}: BotonIntervencionManualProps) {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [agenteNombre, setAgenteNombre] = useState('');
  const [motivo, setMotivo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!agenteNombre.trim() || !motivo.trim()) return;
    
    setIsSubmitting(true);
    onIntervenir(agenteNombre.trim(), motivo.trim());
    
    // Reset form
    setTimeout(() => {
      setModalOpen(false);
      setAgenteNombre('');
      setMotivo('');
      setIsSubmitting(false);
    }, 500);
  };

  const pasoLabel = pasosLabels[paso][language];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModalOpen(true)}
        disabled={disabled}
        className={`border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-950 ${className}`}
      >
        <Hand className="h-4 w-4 mr-2" />
        {t('intervencion.boton')}
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              {t('intervencion.modal.title')}
            </DialogTitle>
            <DialogDescription className="text-left">
              {t('intervencion.modal.descripcion')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Paso que se interviene */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-800 dark:text-amber-300">
                  {t('intervencion.modal.paso')}: {pasoLabel}
                </span>
              </div>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                {t('intervencion.modal.pasoDesc')}
              </p>
            </div>

            {/* Nombre del agente */}
            <div className="space-y-2">
              <Label htmlFor="agente-nombre" className="text-sm font-medium">
                {t('intervencion.modal.agente')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="agente-nombre"
                placeholder={t('intervencion.modal.agentePlaceholder')}
                value={agenteNombre}
                onChange={(e) => setAgenteNombre(e.target.value)}
                className="bg-background"
              />
            </div>

            {/* Motivo de la intervención */}
            <div className="space-y-2">
              <Label htmlFor="motivo" className="text-sm font-medium">
                {t('intervencion.modal.motivo')} <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="motivo"
                placeholder={t('intervencion.modal.motivoPlaceholder')}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="bg-background resize-none min-h-[100px]"
                rows={4}
              />
            </div>

            {/* Aviso de registro */}
            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <p className="flex items-start gap-2">
                <UserCheck className="h-4 w-4 shrink-0 mt-0.5" />
                {t('intervencion.modal.registro')}
              </p>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
            >
              {t('intervencion.modal.cancelar')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!agenteNombre.trim() || !motivo.trim() || isSubmitting}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Hand className="h-4 w-4 mr-2" />
              {t('intervencion.modal.confirmar')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
