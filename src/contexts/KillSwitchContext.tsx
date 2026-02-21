import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { logSecurityEvent } from '@/lib/security';

type KillSwitchStatus = 'active' | 'triggered' | 'cooldown';

interface DirectorSignature {
  nombre: string;
  cargo: string;
}

interface KillSwitchContextValue {
  status: KillSwitchStatus;
  isSystemActive: boolean;
  triggerKillSwitch: (reason: string) => void;
  reactivateSystem: (firmaA: DirectorSignature, firmaB: DirectorSignature) => void;
  lastTriggerReason: string | null;
  lastTriggerTime: Date | null;
  reactivationSignatures: [DirectorSignature, DirectorSignature] | null;
}

const KillSwitchContext = createContext<KillSwitchContextValue | undefined>(undefined);

interface KillSwitchProviderProps {
  children: ReactNode;
}

export function KillSwitchProvider({ children }: KillSwitchProviderProps) {
  const [status, setStatus] = useState<KillSwitchStatus>('active');
  const [lastTriggerReason, setLastTriggerReason] = useState<string | null>(null);
  const [lastTriggerTime, setLastTriggerTime] = useState<Date | null>(null);
  const [reactivationSignatures, setReactivationSignatures] = useState<[DirectorSignature, DirectorSignature] | null>(null);

  const triggerKillSwitch = useCallback((reason: string) => {
    setStatus('triggered');
    setLastTriggerReason(reason);
    setLastTriggerTime(new Date());
    setReactivationSignatures(null);
    
    logSecurityEvent({
      eventType: 'kill_switch',
      details: {
        action: 'triggered',
        reason,
      },
      riskLevel: 'high',
    });
  }, []);

  const reactivateSystem = useCallback((firmaA: DirectorSignature, firmaB: DirectorSignature) => {
    setStatus('cooldown');
    setReactivationSignatures([firmaA, firmaB]);
    
    logSecurityEvent({
      eventType: 'kill_switch',
      details: {
        action: 'reactivation_initiated',
        previousReason: lastTriggerReason,
        firmaA: `${firmaA.nombre} (${firmaA.cargo})`,
        firmaB: `${firmaB.nombre} (${firmaB.cargo})`,
      },
    });
    
    setTimeout(() => {
      setStatus('active');
      logSecurityEvent({
        eventType: 'kill_switch',
        details: {
          action: 'reactivated',
          authorizedBy: [
            `${firmaA.nombre} (${firmaA.cargo})`,
            `${firmaB.nombre} (${firmaB.cargo})`,
          ],
        },
      });
    }, 3000);
  }, [lastTriggerReason]);

  const isSystemActive = status === 'active';

  return (
    <KillSwitchContext.Provider
      value={{
        status,
        isSystemActive,
        triggerKillSwitch,
        reactivateSystem,
        lastTriggerReason,
        lastTriggerTime,
        reactivationSignatures,
      }}
    >
      {children}
    </KillSwitchContext.Provider>
  );
}

export function useKillSwitch() {
  const context = useContext(KillSwitchContext);
  if (!context) {
    throw new Error('useKillSwitch must be used within a KillSwitchProvider');
  }
  return context;
}
