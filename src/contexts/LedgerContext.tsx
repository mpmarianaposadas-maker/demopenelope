import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { LedgerEntry } from '@/components/penelope/security/SecurityLedger';
import { DEMO_LEDGER_ENTRIES } from '@/components/penelope/security/demoLedgerEntries';

interface LedgerContextType {
  entries: LedgerEntry[];
  agregarEntrada: (entry: Omit<LedgerEntry, 'id'>) => void;
  reiniciarLedger: () => void;
}

const LedgerContext = createContext<LedgerContextType | null>(null);

let nextId = DEMO_LEDGER_ENTRIES.length + 1;

export function LedgerProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<LedgerEntry[]>(DEMO_LEDGER_ENTRIES);

  const agregarEntrada = useCallback((entry: Omit<LedgerEntry, 'id'>) => {
    setEntries(prev => [...prev, { ...entry, id: String(nextId++) }]);
  }, []);

  const reiniciarLedger = useCallback(() => {
    nextId = DEMO_LEDGER_ENTRIES.length + 1;
    setEntries(DEMO_LEDGER_ENTRIES);
  }, []);

  return (
    <LedgerContext.Provider value={{ entries, agregarEntrada, reiniciarLedger }}>
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const ctx = useContext(LedgerContext);
  if (!ctx) throw new Error('useLedger debe usarse dentro de LedgerProvider');
  return ctx;
}
