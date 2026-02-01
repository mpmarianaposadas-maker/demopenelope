import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ExpedienteData {
  expedienteNumero: string;
  tipoTramite: string;
  empresaNombre: string;
}

interface TipoTramiteContextValue {
  tipoTramite: string;
  expedienteNumero: string;
  empresaNombre: string;
  setTipoTramite: (value: string) => void;
  setExpedienteNumero: (value: string) => void;
  setEmpresaNombre: (value: string) => void;
  resetTipoTramite: () => void;
  resetAll: () => void;
}

const DEFAULT_TIPO_TRAMITE = 'Licencia TIC - Alta';
const DEFAULT_EXPEDIENTE_NUMERO = 'EX-2026-01234567-APN-DNLTC';
const DEFAULT_EMPRESA_NOMBRE = 'Telecomunicaciones del Plata S.A.';

const TipoTramiteContext = createContext<TipoTramiteContextValue | undefined>(undefined);

interface TipoTramiteProviderProps {
  children: ReactNode;
}

export function TipoTramiteProvider({ children }: TipoTramiteProviderProps) {
  const [tipoTramite, setTipoTramiteState] = useState(DEFAULT_TIPO_TRAMITE);
  const [expedienteNumero, setExpedienteNumeroState] = useState(DEFAULT_EXPEDIENTE_NUMERO);
  const [empresaNombre, setEmpresaNombreState] = useState(DEFAULT_EMPRESA_NOMBRE);

  const setTipoTramite = useCallback((value: string) => {
    const sanitized = value.trim() || DEFAULT_TIPO_TRAMITE;
    setTipoTramiteState(sanitized);
  }, []);

  const setExpedienteNumero = useCallback((value: string) => {
    const sanitized = value.trim() || DEFAULT_EXPEDIENTE_NUMERO;
    setExpedienteNumeroState(sanitized);
  }, []);

  const setEmpresaNombre = useCallback((value: string) => {
    const sanitized = value.trim() || DEFAULT_EMPRESA_NOMBRE;
    setEmpresaNombreState(sanitized);
  }, []);

  const resetTipoTramite = useCallback(() => {
    setTipoTramiteState(DEFAULT_TIPO_TRAMITE);
  }, []);

  const resetAll = useCallback(() => {
    setTipoTramiteState(DEFAULT_TIPO_TRAMITE);
    setExpedienteNumeroState(DEFAULT_EXPEDIENTE_NUMERO);
    setEmpresaNombreState(DEFAULT_EMPRESA_NOMBRE);
  }, []);

  return (
    <TipoTramiteContext.Provider value={{ 
      tipoTramite, 
      expedienteNumero, 
      empresaNombre,
      setTipoTramite, 
      setExpedienteNumero,
      setEmpresaNombre,
      resetTipoTramite,
      resetAll 
    }}>
      {children}
    </TipoTramiteContext.Provider>
  );
}

export function useTipoTramite() {
  const context = useContext(TipoTramiteContext);
  if (!context) {
    throw new Error('useTipoTramite must be used within a TipoTramiteProvider');
  }
  return context;
}

export { DEFAULT_TIPO_TRAMITE, DEFAULT_EXPEDIENTE_NUMERO, DEFAULT_EMPRESA_NOMBRE };
