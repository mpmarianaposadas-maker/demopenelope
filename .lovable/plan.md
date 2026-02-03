
# Plan: Simulador Didáctico de Flujo Administrativo Interno - Sistema Penélope

## Resumen Ejecutivo

Se implementara un nuevo panel de simulacion didactica orientado exclusivamente a personal administrativo, mostrando el circuito interno de trabajo del sistema Penélope en sus etapas preliminares y no discrecionales.

---

## Componentes a Crear

### 1. Nuevo Panel Principal: `PanelSimuladorInterno.tsx`

Contenedor principal que mostrara:
- Indicador de acceso restringido (solo personal autorizado)
- Flujo visual de las 5 etapas del proceso
- Botón de simulación de alerta de vencimiento
- Estado actual del expediente (Apto/Incompleto)

### 2. Componente de Timeline: `FlujoProcedimiento.tsx`

Timeline interactivo vertical con las etapas:

```text
[1] Ingreso de Expediente
     ↓
[2] Verificación Documental
     ↓
[3] Clasificación del Trámite
     ↓
[4] Control de Plazos
     ↓
[5] Estado Final
```

Cada paso incluira:
- Icono representativo
- Estado visual (pendiente/en proceso/completado)
- Tooltip explicativo al hacer hover

### 3. Componente de Tooltips: `TooltipPaso.tsx`

Tooltips contextuales con los mensajes especificados:
- Paso 1: "Carga de expediente iniciada por agente administrativo autorizado."
- Paso 2: "Verificación automatizada de requisitos formales iniciada."
- Paso 3: "Trámite clasificado por categoría normativa y tipo de gestión."
- Paso 4: "Plazo de resolución activado. Sistema monitoreará tiempos en segundo plano."
- Paso 5: "El expediente fue procesado. Si está completo, queda habilitado para revisión sustantiva."

### 4. Hook de Estado: `useSimuladorFlujo.ts`

Gestiona:
- Estado actual de cada paso (pendiente/activo/completado)
- Simulación de progreso automático
- Datos del expediente simulado
- Estado de la alerta de vencimiento

### 5. Componente de Alerta: `AlertaVencimiento.tsx`

Boton y modal para simular la alerta interna:
- Botón: "Simular alerta de riesgo de vencimiento"
- Mensaje mostrado al hacer clic:
  - Expediente sin resolución a 72 hs del vencimiento legal
  - Notificación interna generada al área responsable

---

## Estructura de Archivos

```text
src/
├── components/penelope/
│   ├── simulador/
│   │   ├── PanelSimuladorInterno.tsx    [NUEVO]
│   │   ├── FlujoProcedimiento.tsx       [NUEVO]
│   │   ├── PasoFlujo.tsx                [NUEVO]
│   │   ├── AlertaVencimiento.tsx        [NUEVO]
│   │   ├── EstadoExpedienteResult.tsx   [NUEVO]
│   │   └── index.ts                     [NUEVO]
│   ├── panels/
│   │   └── index.ts                     [MODIFICAR - agregar export]
├── hooks/
│   └── useSimuladorFlujo.ts             [NUEVO]
├── lib/
│   └── i18n.ts                          [MODIFICAR - agregar traducciones]
├── pages/
│   └── Index.tsx                        [MODIFICAR - agregar nuevo tab]
```

---

## Detalles de Implementación

### Estructura de Datos del Flujo

```typescript
interface PasoFlujo {
  id: string;
  numero: number;
  titulo: string;
  tooltip: string;
  icono: string; // emoji
  estado: 'pendiente' | 'activo' | 'completado';
}

interface ExpedienteSimulado {
  numero: string;
  fechaIngreso: Date;
  tipoTramite: string;
  estado: 'en_proceso' | 'apto' | 'incompleto';
  diasRestantes: number;
  alertaActiva: boolean;
}
```

### Logica del Simulador

1. Al iniciar simulación:
   - Se genera número de expediente simulado
   - Se activan los pasos secuencialmente con delay visual
   - Cada paso pasa de pendiente a activo a completado

2. Al completar verificación:
   - Se determina aleatoriamente si el expediente es APTO o INCOMPLETO
   - Se muestra badge correspondiente con explicación

3. Al simular alerta:
   - Se muestra modal con mensaje de advertencia
   - Se registra en log interno (Prompt Net Ledger simulado)

### Diseño Visual

- Utiliza componentes existentes: Card, Badge, Button, Tooltip
- Paleta coherente con el resto de la aplicación
- Animaciones suaves con Framer Motion (ya instalado)
- Responsive: adapta layout en móvil

### Internacionalización

Se agregaran las siguientes claves al archivo i18n.ts:

```typescript
// Simulador Interno
'simulador.title': 'Simulador de Flujo Interno',
'simulador.badge': 'SOLO PERSONAL AUTORIZADO',
'simulador.intro': 'Simulación didáctica del circuito de trabajo...',
'simulador.paso1.titulo': 'Ingreso de Expediente',
'simulador.paso1.tooltip': 'Carga de expediente iniciada...',
// ... demás pasos
'simulador.alerta.boton': 'Simular alerta de riesgo de vencimiento',
'simulador.alerta.titulo': 'Alerta de Vencimiento Inminente',
'simulador.alerta.mensaje': 'Expediente sin resolución a 72 hs...',
'simulador.estado.apto': 'APTO',
'simulador.estado.incompleto': 'INCOMPLETO',
'simulador.restriccion': 'Este sistema no realiza decisiones sustantivas...',
```

---

## Flujo de Interacción del Usuario

1. Usuario navega al tab "Simulador Interno"
2. Ve panel con badge de acceso restringido
3. Hace clic en "Iniciar Simulación"
4. Observa progreso animado de cada paso
5. Puede hacer hover en cada paso para ver tooltip
6. Al finalizar, ve estado del expediente
7. Puede hacer clic en "Simular alerta" para ver notificación
8. Puede reiniciar la simulación

---

## Sección Técnica

### Integración con Sistema Existente

- Reutiliza `useLanguage` para traducciones
- Reutiliza componentes UI existentes (Button, Card, Badge, Tooltip, Alert)
- Sigue patrones de estado establecidos en `useChatRupecoSimulado.ts`
- Utiliza Framer Motion para animaciones consistentes

### Modificaciones a Archivos Existentes

1. **`src/pages/Index.tsx`**:
   - Agregar nuevo tab al array `tabs`
   - Importar `PanelSimuladorInterno`

2. **`src/components/penelope/panels/index.ts`**:
   - Exportar nuevo panel

3. **`src/lib/i18n.ts`**:
   - Agregar ~25 nuevas claves de traducción (ES/EN)

### Consideraciones de Accesibilidad

- Tooltips accesibles con `aria-describedby`
- Estados visuales distinguibles sin depender solo del color
- Navegación por teclado en el flujo
- Textos alternativos para iconos

### Restricciones Respetadas

- Sistema NO realiza decisiones sustantivas
- NO sustituye actividad discrecional
- NO emite actos administrativos
- Solo interviene en tareas repetitivas y técnicas
- Mensaje de restricción visible permanentemente en el panel

---

## Orden de Implementación

1. Crear hook `useSimuladorFlujo.ts` con lógica de estado
2. Crear componentes base (`PasoFlujo.tsx`, `FlujoProcedimiento.tsx`)
3. Crear componente `AlertaVencimiento.tsx`
4. Crear componente `EstadoExpedienteResult.tsx`
5. Crear panel contenedor `PanelSimuladorInterno.tsx`
6. Agregar traducciones a `i18n.ts`
7. Integrar en `Index.tsx` como nuevo tab
8. Actualizar exports en `panels/index.ts`

