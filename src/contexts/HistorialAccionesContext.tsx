import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AccionAgente, TipoAccion } from '@/components/penelope/chat/HistorialAcciones';

const generateId = () => Math.random().toString(36).substring(2, 9);

interface HistorialContextType {
  historialAcciones: AccionAgente[];
  agregarAccion: (
    tipo: TipoAccion,
    descripcion: string,
    agenteNombre?: string,
    detalles?: string,
    requisitoId?: string,
    requisitoNombre?: string
  ) => void;
  limpiarHistorial: () => void;
}

const HistorialAccionesContext = createContext<HistorialContextType | null>(null);

export function HistorialAccionesProvider({ children }: { children: ReactNode }) {
  const [historialAcciones, setHistorialAcciones] = useState<AccionAgente[]>([]);

  const agregarAccion = useCallback((
    tipo: TipoAccion,
    descripcion: string,
    agenteNombre?: string,
    detalles?: string,
    requisitoId?: string,
    requisitoNombre?: string
  ) => {
    const nuevaAccion: AccionAgente = {
      id: generateId(),
      tipo,
      timestamp: new Date(),
      agenteNombre,
      descripcion,
      detalles,
      requisitoId,
      requisitoNombre,
    };
    setHistorialAcciones(prev => [...prev, nuevaAccion]);
  }, []);

  const limpiarHistorial = useCallback(() => {
    setHistorialAcciones([]);
  }, []);

  return (
    <HistorialAccionesContext.Provider value={{ historialAcciones, agregarAccion, limpiarHistorial }}>
      {children}
    </HistorialAccionesContext.Provider>
  );
}

export function useHistorialAcciones() {
  const ctx = useContext(HistorialAccionesContext);
  if (!ctx) throw new Error('useHistorialAcciones debe usarse dentro de HistorialAccionesProvider');
  return ctx;
}
