

# Plan: Alineacion del lenguaje de la demo con las directrices academicas del PoC

## Resumen

La demo utiliza terminos decisorios como "aprobado", "rechazado", "EXPEDIENTE APROBADO", "EXPEDIENTE RECHAZADO", y frases que sugieren capacidad decisoria del sistema. Segun las directrices, toda salida debe usar lenguaje preparatorio y no vinculante. Se actualizan textos en 5 archivos para reemplazar terminologia decisoria por terminologia preparatoria, y se agregan disclaimers PoC visibles donde faltan.

---

## Cambios por archivo

### 1. `src/hooks/useChatRupecoSimulado.ts`

Reemplazar los mensajes generados en el chat:

- Linea 89-93: Cambiar `MENSAJE_INICIAL` de "Módulo de Admisibilidad Formal" a "Módulo de Verificación Formal (PoC Ilustrativa)". Agregar nota: "Esta simulación no emite actos administrativos ni decisiones vinculantes."

- Linea 477: Cambiar `## ✅ Clasificación Confirmada` a `## ✅ Clasificación Confirmada por Operador`

- Linea 515: En el informe, cambiar "INFORME DE VERIFICACIÓN AUTOMÁTICA" a "INFORME DE VERIFICACIÓN FORMAL (Borrador No Vinculante)"

- Linea 540: Cambiar "Requisitos Cumplidos" a "Requisitos Detectados"

- Linea 557: Cambiar "Requisitos Faltantes" a "Documentación No Localizada"

- Linea 569: Cambiar "ACCIÓN AUTOMÁTICA: Generación de Borrador de Intimación" a "ACCIÓN PREPARATORIA: Borrador de Intimación (sujeto a validación humana)"

- Linea 570: Cambiar "ha generado automáticamente un borrador" a "ha generado un borrador no vinculante"

- Linea 579: Cambiar "puede derivarse a la etapa de análisis técnico-jurídico" a "se encuentra en condiciones formales para su derivación a la etapa de análisis técnico-jurídico (requiere supervisión humana)"

- Lineas 691: Cambiar `## ✅ EXPEDIENTE APROBADO` a `## ✅ VERIFICACIÓN FORMAL COMPLETADA`. Cambiar "ha sido verificado y aprobado" a "ha completado la verificación formal preliminar y se encuentra en condiciones de derivarse". Agregar nota: "Esta validación formal no constituye acto administrativo."

- Lineas 738: Cambiar `## ❌ EXPEDIENTE RECHAZADO` a `## ❌ OBSERVACIONES PENDIENTES - Requiere Subsanación`. Cambiar "ha sido rechazado y no puede continuar" a "presenta observaciones formales pendientes de subsanación". Cambiar "motivo del rechazo" a "observaciones detectadas".

- Linea 761: Cambiar `'APROBACIÓN' : 'RECHAZO'` a `'VALIDACIÓN FORMAL' : 'OBSERVACIÓN'`

- Linea 679: Cambiar la descripcion de la accion de "aprobado" a "verificación formal completada"

- Linea 725: Cambiar la descripcion de la accion de "rechazado" a "observaciones pendientes registradas"

### 2. `src/components/penelope/chat/RequisitoVerificacion.tsx`

- Linea 114: Cambiar `'✓ Validado' : '✗ Rechazado'` a `'✓ Conforme' : '✗ Observado'`

- Linea 159: Cambiar "Validar" (boton) a "Conforme"

- Linea 166: Cambiar "Rechazar" (boton) a "Observar"

- Linea 319-320: Idem botones desktop

- Linea 406: Cambiar "✅ Expediente Aprobado" a "✅ Verificación Formal Completada"

- Linea 450: Cambiar "❌ Expediente Rechazado" a "❌ Observaciones Pendientes"

- Linea 461: Cambiar "Motivo de rechazo" a "Observaciones"

- Linea 495: Cambiar "decisión de aprobación/rechazo" a "determinación de validación formal/observación"

- Linea 570: Cambiar boton "Aprobar" a "Validación Formal Conforme"

- Linea 582: Cambiar boton "Rechazar" a "Registrar Observaciones"

- Linea 588: Cambiar "resolver el expediente" a "completar la verificación formal"

- Linea 596: Cambiar "Registro de Aprobación" a "Registro de Validación Formal"

- Linea 647: Cambiar "Confirmar Aprobación" a "Confirmar Validación Formal"

- Linea 655: Cambiar "Registro de Rechazo" a "Registro de Observaciones"

- Linea 675: Cambiar "motivo del rechazo" a "detalle de las observaciones"

- Linea 707: Cambiar "Confirmar Rechazo" a "Confirmar Observaciones"

### 3. `src/components/penelope/chat/HistorialAcciones.tsx`

- Linea 95: Cambiar `'Rechazo Req.'` a `'Observación Req.'`

- Linea 99: Cambiar `'Aprobación'` a `'Validación Formal'`

- Linea 101: Cambiar `'Rechazo Exp.'` a `'Observación Exp.'`

### 4. `src/components/penelope/panels/ConsultaEstadoTramite.tsx` (ya tiene disclaimer pero necesita refuerzo)

- Linea 322-324: Reforzar el disclaimer existente agregando: "La información es orientativa y no constituye acto administrativo ni genera derechos adquiridos. Los datos mostrados son ficticios y simulados con fines demostrativos."

### 5. `src/components/penelope/panels/PanelBorradores.tsx` (verificar)

El panel ya usa el termino "Borrador" y tiene disclaimers. Se agrega un banner visible al inicio con fondo ambar claro que diga: "Los documentos que se muestran a continuación son borradores no vinculantes generados como asistencia IA. Requieren validación, edición y firma humana antes de cualquier uso. No constituyen actos administrativos."

### 6. `src/components/penelope/simulador/EstadoExpedienteResult.tsx`

- Linea 24-26: Cambiar label de estado "APTO" a "VERIFICACIÓN FORMAL COMPLETA (simulación)"

- Linea 26: Cambiar descripcion de "está habilitado para revisión sustantiva" a "se encuentra en condiciones formales para su derivación (simulación ilustrativa)"

- Linea 30-34: Cambiar label "INCOMPLETO" a "DOCUMENTACIÓN INCOMPLETA (simulación)". Cambiar descripcion de "generará intimación automática" a "se generaría un borrador de intimación no vinculante, sujeto a revisión humana"

### 7. `src/lib/i18n.ts`

- Linea 68: Cambiar `demo.title` de "Demo Interactiva · Sistema Penélope" a "Demo Interactiva (PoC Ilustrativa) · Sistema Penélope"

- Linea 375-377: Cambiar etiquetas del simulador:
  - `simulador.estado.apto`: de "APTO" a "VERIFICACIÓN FORMAL COMPLETA"
  - `simulador.estado.aptoDesc`: quitar "habilitado" y usar lenguaje informativo
  - `simulador.estado.incompletoDesc`: quitar "automática" de intimación

- Linea 465: Reforzar el disclaimer de trazabilidad ciudadana

- Actualizar equivalentes en ingles

### 8. `src/components/penelope/panels/PanelDemoInteractiva.tsx`

- Agregar un banner sutil al inicio (despues de la Card introductoria) que diga: "PoC Ilustrativa — Los resultados de esta simulación no tienen valor normativo ni decisorio."

---

## Seccion Tecnica

### Patron de cambio
Todos los cambios son de texto/strings. No hay cambios de logica, estado ni estructura de componentes. El patron es:

```text
Antes: "aprobado/rechazado" (lenguaje decisorio)
Despues: "verificación formal conforme / observaciones pendientes" (lenguaje preparatorio)
```

### Orden de implementacion
1. useChatRupecoSimulado.ts (mensajes del chat - mayor impacto)
2. RequisitoVerificacion.tsx (botones y paneles de decision)
3. HistorialAcciones.tsx (badges de historial)
4. i18n.ts (traducciones del simulador y demo)
5. EstadoExpedienteResult.tsx (etiquetas del simulador)
6. ConsultaEstadoTramite.tsx (disclaimer reforzado)
7. PanelBorradores.tsx (banner PoC)
8. PanelDemoInteractiva.tsx (banner PoC)

### Dependencias
No se instalan nuevas dependencias. Todos son cambios de strings.

### Riesgo
Bajo. Solo se modifican textos visibles. La logica interna (nombres de variables como `aprobacion`, `rechazado`, `aprobarExpediente`) se mantiene intacta para no romper el flujo funcional — solo cambia lo que ve el usuario.

