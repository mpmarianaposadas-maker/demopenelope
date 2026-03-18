import type { LedgerEntry } from './SecurityLedger';

export const DEMO_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: '1',
    caseId: 'EX-2026-89717554-APN-ENACOM',
    promptId: 'PNL-2026-001234',
    taskType: 'VERIFICACION_VIGENCIA',
    inputHash: 'a3f7c9e2...d41b',
    outputIA: 'Documentación RUPECO vigente. Certificado de cobertura vence en 45 días. Sin faltantes detectados.',
    validadorId: 'AGT-López, M.',
    timestamp: new Date(2026, 2, 18, 9, 15, 30),
    estado: 'convalidado',
  },
  {
    id: '2',
    caseId: 'EX-2026-89717554-APN-ENACOM',
    promptId: 'PNL-2026-001235',
    taskType: 'CLASIFICACION_PRELIMINAR',
    inputHash: 'b8d2e1f4...c72a',
    outputIA: 'Trámite clasificado como Licencia TIC - Resolución ENACOM 40/2020. Área competente: DNTYC.',
    validadorId: 'AGT-López, M.',
    timestamp: new Date(2026, 2, 18, 9, 18, 12),
    estado: 'convalidado',
  },
];
