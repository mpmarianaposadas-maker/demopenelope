import { useState, useCallback, useRef } from 'react';

export type EstadoPaso = 'pendiente' | 'activo' | 'completado';
export type EstadoExpediente = 'sin_iniciar' | 'en_proceso' | 'apto' | 'incompleto';

export interface PasoFlujo {
  id: string;
  numero: number;
  tituloKey: string;
  tooltipKey: string;
  icono: string;
  estado: EstadoPaso;
}

export interface ExpedienteSimulado {
  numero: string;
  fechaIngreso: Date;
  tipoTramite: string;
  estado: EstadoExpediente;
  diasRestantes: number;
  alertaActiva: boolean;
}

const PASO_DELAY_MS = 1200;

const pasosIniciales: PasoFlujo[] = [
  {
    id: 'ingreso',
    numero: 1,
    tituloKey: 'simulador.paso1.titulo',
    tooltipKey: 'simulador.paso1.tooltip',
    icono: '📝',
    estado: 'pendiente',
  },
  {
    id: 'verificacion',
    numero: 2,
    tituloKey: 'simulador.paso2.titulo',
    tooltipKey: 'simulador.paso2.tooltip',
    icono: '📁',
    estado: 'pendiente',
  },
  {
    id: 'clasificacion',
    numero: 3,
    tituloKey: 'simulador.paso3.titulo',
    tooltipKey: 'simulador.paso3.tooltip',
    icono: '🗂️',
    estado: 'pendiente',
  },
  {
    id: 'plazos',
    numero: 4,
    tituloKey: 'simulador.paso4.titulo',
    tooltipKey: 'simulador.paso4.tooltip',
    icono: '⏳',
    estado: 'pendiente',
  },
  {
    id: 'estado_final',
    numero: 5,
    tituloKey: 'simulador.paso5.titulo',
    tooltipKey: 'simulador.paso5.tooltip',
    icono: '✅',
    estado: 'pendiente',
  },
];

function generarNumeroExpediente(): string {
  const año = new Date().getFullYear();
  const numero = Math.floor(Math.random() * 90000) + 10000;
  return `EX-${año}-${numero}-APN-ENACOM`;
}

export function useSimuladorFlujo() {
  const [pasos, setPasos] = useState<PasoFlujo[]>(pasosIniciales);
  const [expediente, setExpediente] = useState<ExpedienteSimulado>({
    numero: '',
    fechaIngreso: new Date(),
    tipoTramite: 'Licencia TIC - Alta',
    estado: 'sin_iniciar',
    diasRestantes: 30,
    alertaActiva: false,
  });
  const [simulando, setSimulando] = useState(false);
  const [alertaVisible, setAlertaVisible] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const limpiarTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const iniciarSimulacion = useCallback(() => {
    limpiarTimeouts();
    setSimulando(true);
    setAlertaVisible(false);
    
    // Generar nuevo expediente
    setExpediente({
      numero: generarNumeroExpediente(),
      fechaIngreso: new Date(),
      tipoTramite: 'Licencia TIC - Alta',
      estado: 'en_proceso',
      diasRestantes: 30,
      alertaActiva: false,
    });

    // Reiniciar todos los pasos
    setPasos(pasosIniciales.map(p => ({ ...p, estado: 'pendiente' as EstadoPaso })));

    // Animar cada paso secuencialmente
    pasosIniciales.forEach((_, index) => {
      // Activar paso
      const activarTimeout = setTimeout(() => {
        setPasos(prev => prev.map((p, i) => 
          i === index ? { ...p, estado: 'activo' as EstadoPaso } : p
        ));
      }, index * PASO_DELAY_MS);
      timeoutsRef.current.push(activarTimeout);

      // Completar paso
      const completarTimeout = setTimeout(() => {
        setPasos(prev => prev.map((p, i) => 
          i === index ? { ...p, estado: 'completado' as EstadoPaso } : p
        ));

        // Si es el último paso, determinar resultado
        if (index === pasosIniciales.length - 1) {
          const esApto = Math.random() > 0.3; // 70% probabilidad de ser apto
          setExpediente(prev => ({
            ...prev,
            estado: esApto ? 'apto' : 'incompleto',
          }));
          setSimulando(false);
        }
      }, (index + 1) * PASO_DELAY_MS - 200);
      timeoutsRef.current.push(completarTimeout);
    });
  }, [limpiarTimeouts]);

  const reiniciarSimulacion = useCallback(() => {
    limpiarTimeouts();
    setSimulando(false);
    setAlertaVisible(false);
    setPasos(pasosIniciales.map(p => ({ ...p, estado: 'pendiente' as EstadoPaso })));
    setExpediente({
      numero: '',
      fechaIngreso: new Date(),
      tipoTramite: 'Licencia TIC - Alta',
      estado: 'sin_iniciar',
      diasRestantes: 30,
      alertaActiva: false,
    });
  }, [limpiarTimeouts]);

  const simularAlerta = useCallback(() => {
    setAlertaVisible(true);
    setExpediente(prev => ({
      ...prev,
      alertaActiva: true,
      diasRestantes: 3,
    }));
  }, []);

  const cerrarAlerta = useCallback(() => {
    setAlertaVisible(false);
  }, []);

  const pasoActual = pasos.find(p => p.estado === 'activo')?.numero || 
                     (expediente.estado !== 'sin_iniciar' && expediente.estado !== 'en_proceso' ? 5 : 0);

  return {
    pasos,
    expediente,
    simulando,
    alertaVisible,
    pasoActual,
    iniciarSimulacion,
    reiniciarSimulacion,
    simularAlerta,
    cerrarAlerta,
  };
}
