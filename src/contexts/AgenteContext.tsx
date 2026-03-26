import React, { createContext, useContext, useState } from 'react';

interface AgenteContextType {
  agenteNombre: string;
  setAgenteNombre: (nombre: string) => void;
}

const AgenteContext = createContext<AgenteContextType>({
  agenteNombre: '',
  setAgenteNombre: () => {},
});

export const AgenteProvider = ({ children }: { children: React.ReactNode }) => {
  const [agenteNombre, setAgenteNombre] = useState('');
  return (
    <AgenteContext.Provider value={{ agenteNombre, setAgenteNombre }}>
      {children}
    </AgenteContext.Provider>
  );
};

export const useAgente = () => useContext(AgenteContext);
