import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { logSecurityEvent } from '@/lib/security';

type KillSwitchStatus = 'active' | 'triggered' | 'cooldown';

interface KillSwitchContextValue {
  status: KillSwitchStatus;
  isSystemActive: boolean;
  triggerKillSwitch: (reason: string) => void;
  reactivateSystem: () => void;
  lastTriggerReason: string | null;
  lastTriggerTime: Date | null;
}

const KillSwitchContext = createContext<KillSwitchContextValue | undefined>(undefined);

interface KillSwitchProviderProps {
  children: ReactNode;
}

export function KillSwitchProvider({ children }: KillSwitchProviderProps) {
  const [status, setStatus] = useState<KillSwitchStatus>('active');
  const [lastTriggerReason, setLastTriggerReason] = useState<string | null>(null);
  const [lastTriggerTime, setLastTriggerTime] = useState<Date | null>(null);

  const triggerKillSwitch = useCallback((reason: string) => {
    setStatus('triggered');
    setLastTriggerReason(reason);
    setLastTriggerTime(new Date());
    
    logSecurityEvent({
      eventType: 'kill_switch',
      details: {
        action: 'triggered',
        reason,
      },
      riskLevel: 'high',
    });
  }, []);

  const reactivateSystem = useCallback(() => {
    setStatus('cooldown');
    
    logSecurityEvent({
      eventType: 'kill_switch',
      details: {
        action: 'reactivation_initiated',
        previousReason: lastTriggerReason,
      },
    });
    
    // Simulated cooldown period before full reactivation
    setTimeout(() => {
      setStatus('active');
      logSecurityEvent({
        eventType: 'kill_switch',
        details: {
          action: 'reactivated',
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
