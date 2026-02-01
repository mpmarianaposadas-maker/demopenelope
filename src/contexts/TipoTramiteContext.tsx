import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TipoTramiteContextValue {
  tipoTramite: string;
  setTipoTramite: (value: string) => void;
  resetTipoTramite: () => void;
}

const DEFAULT_TIPO_TRAMITE = 'Licencia TIC - Alta';

const TipoTramiteContext = createContext<TipoTramiteContextValue | undefined>(undefined);

interface TipoTramiteProviderProps {
  children: ReactNode;
}

export function TipoTramiteProvider({ children }: TipoTramiteProviderProps) {
  const [tipoTramite, setTipoTramiteState] = useState(DEFAULT_TIPO_TRAMITE);

  const setTipoTramite = useCallback((value: string) => {
    const sanitized = value.trim() || DEFAULT_TIPO_TRAMITE;
    setTipoTramiteState(sanitized);
  }, []);

  const resetTipoTramite = useCallback(() => {
    setTipoTramiteState(DEFAULT_TIPO_TRAMITE);
  }, []);

  return (
    <TipoTramiteContext.Provider value={{ tipoTramite, setTipoTramite, resetTipoTramite }}>
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

export { DEFAULT_TIPO_TRAMITE };
