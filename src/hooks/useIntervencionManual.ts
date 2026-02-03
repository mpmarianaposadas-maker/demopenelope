import { useState, useCallback } from 'react';

export type PasoIntervenido = 'clasificacion' | 'verificacion' | 'plazos';

export interface IntervencionManual {
  id: string;
  timestamp: Date;
  agenteNombre: string;
  pasoIntervenido: PasoIntervenido;
  motivoIntervencion: string;
  datosModificados?: Record<string, { antes: string; despues: string }>;
  duracionIntervencion?: number; // seconds
}

interface UseIntervencionManualReturn {
  intervenciones: IntervencionManual[];
  intervencionActiva: PasoIntervenido | null;
  iniciarIntervencion: (paso: PasoIntervenido) => void;
  finalizarIntervencion: (
    agenteNombre: string,
    motivoIntervencion: string,
    datosModificados?: Record<string, { antes: string; despues: string }>
  ) => void;
  cancelarIntervencion: () => void;
  getIntervencionesDelPaso: (paso: PasoIntervenido) => IntervencionManual[];
}

export function useIntervencionManual(): UseIntervencionManualReturn {
  const [intervenciones, setIntervenciones] = useState<IntervencionManual[]>([]);
  const [intervencionActiva, setIntervencionActiva] = useState<PasoIntervenido | null>(null);
  const [timestampInicio, setTimestampInicio] = useState<Date | null>(null);

  const iniciarIntervencion = useCallback((paso: PasoIntervenido) => {
    setIntervencionActiva(paso);
    setTimestampInicio(new Date());
  }, []);

  const finalizarIntervencion = useCallback(
    (
      agenteNombre: string,
      motivoIntervencion: string,
      datosModificados?: Record<string, { antes: string; despues: string }>
    ) => {
      if (!intervencionActiva || !timestampInicio) return;

      const ahora = new Date();
      const duracion = Math.round((ahora.getTime() - timestampInicio.getTime()) / 1000);

      const nuevaIntervencion: IntervencionManual = {
        id: `INT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: ahora,
        agenteNombre,
        pasoIntervenido: intervencionActiva,
        motivoIntervencion,
        datosModificados,
        duracionIntervencion: duracion
      };

      setIntervenciones(prev => [...prev, nuevaIntervencion]);
      setIntervencionActiva(null);
      setTimestampInicio(null);
    },
    [intervencionActiva, timestampInicio]
  );

  const cancelarIntervencion = useCallback(() => {
    setIntervencionActiva(null);
    setTimestampInicio(null);
  }, []);

  const getIntervencionesDelPaso = useCallback(
    (paso: PasoIntervenido) => {
      return intervenciones.filter(i => i.pasoIntervenido === paso);
    },
    [intervenciones]
  );

  return {
    intervenciones,
    intervencionActiva,
    iniciarIntervencion,
    finalizarIntervencion,
    cancelarIntervencion,
    getIntervencionesDelPaso
  };
}
