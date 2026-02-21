import { useState } from 'react';
import { AlertTriangle, Power, ShieldCheck, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useKillSwitch } from '@/contexts/KillSwitchContext';
import { useLanguage } from '@/hooks/useLanguage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export function KillSwitchPanel() {
  const { status, triggerKillSwitch, reactivateSystem, lastTriggerReason, lastTriggerTime } = useKillSwitch();
  const { t } = useLanguage();
  const [showReactivationDialog, setShowReactivationDialog] = useState(false);
  const [firmaA, setFirmaA] = useState({ nombre: '', cargo: '' });
  const [firmaB, setFirmaB] = useState({ nombre: '', cargo: '' });

  const canSubmitReactivation = firmaA.nombre.trim() && firmaA.cargo.trim() && firmaB.nombre.trim() && firmaB.cargo.trim();

  const handleReactivationSubmit = () => {
    if (!canSubmitReactivation) return;
    reactivateSystem(firmaA, firmaB);
    setShowReactivationDialog(false);
    setFirmaA({ nombre: '', cargo: '' });
    setFirmaB({ nombre: '', cargo: '' });
  };

  const getStatusColor = () => {
    switch (status) {
      case 'active': return 'bg-green-100 border-green-300 text-green-800';
      case 'triggered': return 'bg-red-100 border-red-300 text-red-800';
      case 'cooldown': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'active': return <ShieldCheck className="w-5 h-5 text-green-600" />;
      case 'triggered': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'cooldown': return <Loader2 className="w-5 h-5 text-yellow-600 animate-spin" />;
    }
  };

  return (
    <div className="card-institutional p-4 transition-all duration-300 ease-out hover:shadow-lg hover:-translate-y-1 hover:border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif font-semibold text-foreground text-sm">
          {t('killSwitch.title')}
        </h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
          {t(`killSwitch.status.${status}`)}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 p-3 bg-secondary/50 rounded-lg">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="text-sm font-medium">
            {t(`killSwitch.statusDesc.${status}`)}
          </div>
          {status === 'triggered' && lastTriggerTime && (
            <div className="text-xs text-muted-foreground mt-1">
              {t('killSwitch.triggeredAt')}: {lastTriggerTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {status === 'triggered' && lastTriggerReason && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="text-xs font-medium text-red-700 mb-1">
              {t('killSwitch.reason')}:
            </div>
            <div className="text-sm text-red-800">{lastTriggerReason}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {status === 'active' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full gap-2" size="sm">
                <Power className="w-4 h-4" />
                {t('killSwitch.triggerButton')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  {t('killSwitch.confirmTitle')}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {t('killSwitch.confirmDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('killSwitch.cancel')}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => triggerKillSwitch('Activación manual por operador')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {t('killSwitch.confirm')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        {status === 'triggered' && (
          <Button
            variant="outline"
            className="w-full gap-2 border-green-300 text-green-700 hover:bg-green-50"
            size="sm"
            onClick={() => setShowReactivationDialog(true)}
          >
            <ShieldCheck className="w-4 h-4" />
            {t('killSwitch.reactivateButton')}
          </Button>
        )}

        {status === 'cooldown' && (
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-yellow-700">
            <Loader2 className="w-4 h-4 animate-spin" />
            {t('killSwitch.cooldownMessage')}
          </div>
        )}
      </div>

      {/* Reactivation Dialog with dual signature */}
      <Dialog open={showReactivationDialog} onOpenChange={setShowReactivationDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              Reactivación del Sistema
            </DialogTitle>
            <DialogDescription>
              Conforme el Anexo III, la reactivación requiere la firma de dos directores. Complete ambos campos para continuar.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="border border-border rounded-lg p-3 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Firma 1 — Director/a</p>
              <div className="space-y-2">
                <Label htmlFor="firma-a-nombre" className="text-xs">Nombre completo</Label>
                <Input
                  id="firma-a-nombre"
                  placeholder="Ej: María García"
                  value={firmaA.nombre}
                  onChange={(e) => setFirmaA(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firma-a-cargo" className="text-xs">Cargo</Label>
                <Input
                  id="firma-a-cargo"
                  placeholder="Ej: Directora Nacional de Desarrollo de Telecomunicaciones"
                  value={firmaA.cargo}
                  onChange={(e) => setFirmaA(prev => ({ ...prev, cargo: e.target.value }))}
                />
              </div>
            </div>

            <div className="border border-border rounded-lg p-3 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Firma 2 — Director/a</p>
              <div className="space-y-2">
                <Label htmlFor="firma-b-nombre" className="text-xs">Nombre completo</Label>
                <Input
                  id="firma-b-nombre"
                  placeholder="Ej: Juan Pérez"
                  value={firmaB.nombre}
                  onChange={(e) => setFirmaB(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firma-b-cargo" className="text-xs">Cargo</Label>
                <Input
                  id="firma-b-cargo"
                  placeholder="Ej: Director Nacional de Servicios Audiovisuales"
                  value={firmaB.cargo}
                  onChange={(e) => setFirmaB(prev => ({ ...prev, cargo: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReactivationDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleReactivationSubmit}
              disabled={!canSubmitReactivation}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirmar reactivación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          {t('killSwitch.securityNote')}
        </p>
      </div>
    </div>
  );
}
