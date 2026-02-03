
# Plan: Mejoras de Visibilidad, Formatos Documentales y Control Humano

## Resumen Ejecutivo

Se implementaran mejoras siguiendo tres ejes principales:
1. **Visibilidad y UX (Nielsen)**: Panel de verificacion responsive para mobile/tablet
2. **Formatos documentales correctos**: Notas para peticionantes (carga en GDE) y Providencias para tramites internos
3. **Transparencia, control humano y rendicion de cuentas**: Metricas, trazabilidad ciudadana y boton de intervencion manual

---

## 1. Formatos Documentales Correctos

### 1.1 Distincion entre tipos de documento

| Destinatario | Tipo Documento | Sistema de Carga | Componente |
|-------------|----------------|------------------|------------|
| Peticionantes externos | **Nota (NO)** | GDE | `ProvidenciaIntimacion.tsx` (renombrar) |
| Tramite interno | **Providencia (PV)** | GDE | `PanelBorradores.tsx` |

### 1.2 Modificacion de `ProvidenciaIntimacion.tsx`

**Cambio principal**: Reformatear como "Nota de Intimacion" para carga en GDE

El documento generado se dirigira al peticionante pero con formato de Nota que requiere:
- Encabezado: "NOTA - BORRADOR PARA CARGA EN GDE"
- Indicacion clara: "Este documento debe ser validado por el operador y cargado manualmente en el sistema GDE"
- Eliminacion del formato de Providencia (VISTO/CONSIDERANDO/RESUELVE)
- Estructura de Nota administrativa

**Texto generado reformateado**:

```text
═══════════════════════════════════════════════════════════════════
          ENTE NACIONAL DE COMUNICACIONES - ENACOM
          NOTA - BORRADOR PARA CARGA EN GDE
═══════════════════════════════════════════════════════════════════

Expediente: EX-2026-XXXXXXXX-APN-ENACOM
Fecha: [fecha actual]

Destinatario: [Razon social / Nombre del peticionante]
Domicilio constituido: [Domicilio TAD]

Ref.: INTIMACION - Subsanacion documental

De mi consideracion:

Me dirijo a Ud. en relacion al expediente de referencia...

[Tabla de documentos faltantes]

Se INTIMA a subsanar dentro de DIEZ (10) DIAS HABILES...

[Control de silencio positivo]

───────────────────────────────────────────────────────────────────
 BORRADOR - REQUIERE VALIDACION Y CARGA MANUAL EN GDE
 Validado por: _________________________ Fecha: ___________
───────────────────────────────────────────────────────────────────
```

### 1.3 Modificacion de `PanelBorradores.tsx`

**Cambios**:
- Mantener el formato de Providencia (PV) para documentos internos (pases entre areas)
- Cambiar "Comunicacion Oficial (CO)" a "Nota (NO)" para comunicaciones a peticionantes
- Agregar indicacion clara de sistema de destino (GDE)

---

## 2. Visibilidad y UX - Panel de Verificacion Responsive

### 2.1 Modificacion de `RequisitoVerificacion.tsx`

**Problema**: La tabla de 6 columnas no es visible en mobile/tablet

**Solucion**: Layout condicional segun breakpoint

```text
Desktop (lg+):              Mobile/Tablet (<lg):
┌─────────────────────┐     ┌─────────────────────┐
│ Tabla 6 columnas    │     │ Card 1              │
│ N | Req | Estado... │ --> │ ○ Requisito 1       │
└─────────────────────┘     │ Estado: 🟢 Verde    │
                            │ Orden: Fojas 1-3    │
                            │ [✓] [✗]             │
                            ├─────────────────────┤
                            │ Card 2              │
                            │ ○ Requisito 2       │
                            │ Estado: 🔴 Rojo     │
                            └─────────────────────┘
```

**Implementacion**:
- Usar hook `useIsMobile()` existente
- Renderizar `<Table>` en desktop, lista de `<Card>` en mobile
- Mantener todas las funcionalidades (validar/rechazar, semaforo, observaciones)
- Badges de estado prominentes en mobile

---

## 3. Panel de Metricas para Operadores

### 3.1 Nuevo componente: `PanelMetricasOperador.tsx`

**Metricas a mostrar** (valores simulados):

| Metrica | Descripcion | Valor Demo |
|---------|-------------|------------|
| Total expedientes procesados | Contador global | 1,247 |
| Silencio positivo evitado | Gestion a tiempo | 892 (71.5%) |
| Alertas de plazo generadas | Notificaciones | 156 |
| Tiempo promedio antes | Sin Penelope | 28 dias |
| Tiempo promedio despues | Con Penelope | 4.2 dias |
| Clasificacion correcta | Precision | 94.3% |

**Funcionalidades**:
- Badge "SOLO OPERADORES HABILITADOS"
- Graficos con Recharts (ya instalado)
- Filtros de periodo (semana/mes/ano)
- Boton de descarga CSV

### 3.2 Utilidad de exportacion: `exportCSV.ts`

```typescript
export function exportToCSV(data: MetricaRow[], filename: string): void {
  // Genera CSV con headers y datos
  // Descarga automatica como archivo
}
```

---

## 4. Modulo de Trazabilidad Ciudadana

### 4.1 Nuevo componente: `ConsultaEstadoTramite.tsx`

**Proposito**: Consulta externa de estado de expediente sin exponer decisiones internas

**Flujo**:
1. Usuario ingresa ID unico de seguimiento
2. Sistema valida formato
3. Muestra informacion publica del estado

**Informacion visible**:
- Estado del expediente: Verificado / En revision / En espera
- Fecha de ingreso del tramite
- Fecha estimada de resolucion
- Documentos adjuntos (solo nombres, sin datos sensibles)
- Historial de pasos automatizados (solo eventos publicos)

**Informacion NO visible**:
- Decisiones internas
- Juicios tecnicos del operador
- Clasificaciones de confianza de la IA
- Observaciones internas

---

## 5. Boton de Intervencion Manual

### 5.1 Nuevo componente: `BotonIntervencionManual.tsx`

**Etiqueta**: "Intervenir manualmente este paso"
**Icono**: Stop (rojo/amarillo prominente)

**Comportamiento**:
1. Detiene temporalmente el flujo automatizado
2. Muestra modal de intervencion con:
   - Campo obligatorio: Nombre del agente
   - Campo obligatorio: Motivo de intervencion
   - Area para revisar/modificar datos
3. Registra en historial de acciones

### 5.2 Integracion

Agregar el boton en:
- `ClasificacionConfirmacion.tsx` - Paso de clasificacion
- `RequisitoVerificacion.tsx` - Paso de verificacion documental
- `PanelSimuladorInterno.tsx` - Paso de control de plazos

### 5.3 Hook de estado: `useIntervencionManual.ts`

```typescript
interface IntervencionManual {
  id: string;
  timestamp: Date;
  agenteNombre: string;
  pasoIntervenido: 'clasificacion' | 'verificacion' | 'plazos';
  motivoIntervencion: string;
  datosModificados?: Record<string, { antes: string; despues: string }>;
}
```

---

## Estructura de Archivos

```text
src/
├── components/penelope/
│   ├── chat/
│   │   ├── RequisitoVerificacion.tsx    [MODIFICAR - responsive]
│   │   ├── ProvidenciaIntimacion.tsx    [MODIFICAR - formato Nota]
│   │   ├── BotonIntervencionManual.tsx  [NUEVO]
│   │   └── index.ts                     [MODIFICAR - exports]
│   ├── panels/
│   │   ├── PanelBorradores.tsx          [MODIFICAR - formatos]
│   │   ├── PanelMetricasOperador.tsx    [NUEVO]
│   │   ├── ConsultaEstadoTramite.tsx    [NUEVO]
│   │   └── index.ts                     [MODIFICAR - exports]
├── hooks/
│   └── useIntervencionManual.ts         [NUEVO]
├── lib/
│   ├── i18n.ts                          [MODIFICAR - traducciones]
│   └── exportCSV.ts                     [NUEVO]
├── pages/
│   └── Index.tsx                        [MODIFICAR - nuevos tabs]
```

---

## Seccion Tecnica

### Modificaciones Detalladas

#### ProvidenciaIntimacion.tsx

1. Renombrar funcion generadora a `generarTextoNota()`
2. Cambiar estructura de VISTO/CONSIDERANDO/RESUELVE a formato Nota
3. Actualizar encabezados y disclaimers
4. Cambiar titulo del Card a "Borrador de Nota de Intimacion"
5. Agregar indicacion de carga en GDE

#### RequisitoVerificacion.tsx - Responsive

1. Importar `useIsMobile` hook
2. Crear componente interno `RequisitoCardMobile` para layout mobile
3. Renderizar condicionalmente:
   - `isMobile ? <RequisitoCardMobile /> : <Table />`
4. Mantener misma logica de validacion/rechazo
5. Usar Cards apilables verticalmente con estados visuales prominentes

#### PanelBorradores.tsx

1. Cambiar "Comunicacion Oficial (CO)" a "Nota (NO)"
2. Actualizar textos para indicar carga en GDE
3. Mantener Providencia (PV) solo para documentos internos
4. Agregar indicadores de sistema de destino

### Nuevas Traducciones (i18n.ts)

Se agregaran aproximadamente 70 nuevas claves:

```typescript
// Nota de Intimacion (reemplazo de CO para peticionantes)
'borr.nota.title': 'Borrador de Nota de Intimacion',
'borr.nota.tipoDoc': 'Nota (NO)',
'borr.nota.destino': 'Para carga en GDE',
'borr.nota.disclaimer': 'Este documento debe ser validado por el operador y cargado manualmente en el sistema GDE antes de notificar al peticionante.',

// Metricas Operador
'metricas.operador.title': 'Panel de Metricas (Uso Interno)',
'metricas.operador.badge': 'SOLO OPERADORES HABILITADOS',
'metricas.operador.totalProcesados': 'Expedientes procesados',
'metricas.operador.silencioEvitado': 'Silencio positivo evitado',
'metricas.operador.alertasGeneradas': 'Alertas de plazo generadas',
'metricas.operador.tiempoAntes': 'Tiempo promedio (antes)',
'metricas.operador.tiempoDespues': 'Tiempo promedio (con Penelope)',
'metricas.operador.clasificacionCorrecta': 'Clasificacion correcta',
'metricas.operador.descargarCSV': 'Descargar CSV',
// ... 15 claves mas

// Trazabilidad Ciudadana
'trazabilidad.ciudadana.title': 'Estado de mi Tramite',
'trazabilidad.ciudadana.buscar': 'Ingrese su ID de seguimiento',
'trazabilidad.ciudadana.estado.verificado': 'Verificado',
'trazabilidad.ciudadana.estado.enRevision': 'En revision',
'trazabilidad.ciudadana.estado.enEspera': 'En espera',
// ... 15 claves mas

// Intervencion Manual
'intervencion.boton': 'Intervenir manualmente este paso',
'intervencion.modal.title': 'Registro de Intervencion Manual',
'intervencion.modal.agente': 'Nombre del agente',
'intervencion.modal.motivo': 'Motivo de la intervencion',
'intervencion.modal.confirmar': 'Registrar intervencion',
// ... 15 claves mas

// Verificacion mobile
'verificacion.mobile.validar': 'Validar requisito',
'verificacion.mobile.rechazar': 'Rechazar requisito',
// ... 5 claves mas
```

### Consideraciones de Accesibilidad

- Cards mobile con roles ARIA apropiados
- Navegacion por teclado en layout responsive
- Contraste adecuado en indicadores de estado
- Labels descriptivos en formularios de intervencion
- Tooltips accesibles con `aria-describedby`

### Restricciones Respetadas

- Sistema NO realiza decisiones sustantivas
- Todas las notas/providencias son borradores que requieren validacion humana
- Boton de intervencion manual garantiza control humano significativo
- Formato documental correcto segun destinatario (Nota para externos, PV para internos)
- Trazabilidad ciudadana no expone decisiones internas

---

## Orden de Implementacion

1. Crear utilidad `exportCSV.ts`
2. Crear hook `useIntervencionManual.ts`
3. Crear componente `BotonIntervencionManual.tsx`
4. Modificar `ProvidenciaIntimacion.tsx` - formato Nota para GDE
5. Modificar `PanelBorradores.tsx` - formatos correctos
6. Modificar `RequisitoVerificacion.tsx` - layout responsive
7. Crear `PanelMetricasOperador.tsx`
8. Crear `ConsultaEstadoTramite.tsx`
9. Agregar traducciones a `i18n.ts`
10. Integrar nuevos paneles en `Index.tsx`
11. Actualizar exports en archivos index
