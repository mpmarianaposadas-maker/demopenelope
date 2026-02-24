## Plan Integral de Ajuste - Sistema Penelope

### Estado actual

Tras las iteraciones previas, varias etapas del plan ya fueron implementadas. Este plan aborda exclusivamente los ajustes pendientes.

### Cambios ya implementados (no requieren trabajo)

- **ETAPA 2** (Prompt Net Ledger como "Registro de Interacciones Algoritmicas"): Completado en SecurityLedger.tsx y SecurityDemoPanel.tsx.
- **ETAPA 3** (Kill Switch con identificacion obligatoria y doble firma): Completado en KillSwitchPanel.tsx.
- **ETAPA 4** (Verificador RUPECO con scroll unificado, 85vh, sin header flotante): Completado en ChatRupeco.tsx.
- **ETAPA 5** (Notas en Experiencias Internacionales y selector de tramite): Completado en PanelPropuestaNormativa.tsx y ChatRupeco.tsx.
- **ETAPA 6** (Encabezado del Articulado Propuesto): Completado en PanelPropuestaNormativa.tsx.
- **ETAPA 7** (Bloque institucional unico): Completado en Index.tsx.
- **ETAPA 8** (Boton flotante como ancla funcional): Completado en ChatRupeco.tsx.

---

### Cambios pendientes

#### 1. Reestructurar el modulo "Borradores Generados" (ETAPA 1)

**Archivo:** `src/components/penelope/panels/PanelBorradores.tsx`

**1.1. Separar los borradores en tres secciones visibles:**

- **Comunicaciones dirigidas al administrado:** Nota de Intimacion (NO).
- **Informacion interna de gestion:** Providencia de pase (PV) comunicacion de pase interno entre area por haberse acreditado todos los requisitos 

Se agregaran encabezados de seccion (`h3`) para distinguir claramente "Comunicaciones al administrado" de "Comunicaciones internas de gestion (GDE)".

**1.2. Limpiar el texto descargable generado por ProvidenciaIntimacion:**

**Archivo:** `src/components/penelope/chat/ProvidenciaIntimacion.tsx`

En la funcion `generarTextoNota` (lineas 56-118), se eliminaran del texto descargable:

- El bloque "CONTROL SILENCIO POSITIVO" (lineas 100-103) -- es una alerta interna, no corresponde al documento dirigido al peticionante.
- El checklist de verificacion interna (lineas 112-114) -- es para uso del agente, no del destinatario.
- Las marcas "BORRADOR" y "Generacion automatica" (lineas 108, 117) -- no deben figurar en el documento que recibe el administrado.

Se mantendran esos elementos solo en la vista previa del agente (interfaz), no en el archivo descargable. Deben incluir la advertencia de control de los resultados del Sistema previo a la carga en el sistema GDE.

**1.3. Incorporar referencia RUPECO y metadatos GDE:**

En ambos borradores de PanelBorradores.tsx:

- Agregar linea "Ref. RUPECO: [Numero de registro vigente]" cuando corresponda.
- Agregar indicacion "Tipo documento GDE: Providencia (PV)" / "Tipo documento GDE: Nota (NO)" como metadato visible.

**1.4. Regla especial para inscripciones RUPECO:**

En PanelBorradores.tsx, agregar una nota condicional:

- Texto: "Tramite de inscripcion RUPECO en curso. El numero RUPECO sera asignado tras el otorgamiento formal."
- Se mostrara como un aviso informativo dentro del bloque de la Providencia, dado que el ejemplo simulado corresponde a un tramite donde el RUPECO ya existe.

#### 2. Depurar el panel lateral "Prompt Net Ledger" (ETAPA 2 - remanente)

**Archivo:** `src/components/penelope/aside/PanelMetricasPrompts.tsx`

Este panel lateral aun muestra metricas genericas no documentadas en el trabajo academico: tokens (12.4K), latencia (1.2s), confianza (97.3%), prompts ejecutados (47), y actividad por modulo con tokens/latencia.

**Accion:** Reconceptualizar el panel como un resumen compacto del Registro de Interacciones Algoritmicas, mostrando:

- Titulo: "Registro de Trazabilidad" (en lugar de "Prompt Net Ledger" con metricas).
- Cantidad de interacciones registradas.
- Ultima interaccion: tipo de tarea, estado (convalidado/corregido), timestamp.
- Indicador de estado del ledger (activo/inmutable).
- Eliminar: tokens, latencia, confianza, contadores diarios.

#### 3. Depurar evento no documentado en Trazabilidad (ETAPA 3 - remanente)

**Archivo:** `src/components/penelope/panels/PanelTrazabilidad.tsx`

El registro integrado de eventos auditables (lineas 86-137) incluye un evento "Ajuste de prompt" / "OVERRIDE PROMPT" que no esta documentado en el trabajo academico. Conforme a la directriz de fidelidad estricta, debe eliminarse.

**Accion:** Remover el segundo evento ("Ajuste de prompt") del array de eventos ilustrativos, conservando unicamente "Validacion humana" y "Kill Switch" como tipos de evento auditables documentados.

---

### Resumen de archivos a modificar


| Archivo                                                  | Cambio                                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/components/penelope/panels/PanelBorradores.tsx`     | Separar secciones, agregar refs RUPECO/GDE, nota inscripcion              |
| `src/components/penelope/chat/ProvidenciaIntimacion.tsx` | Limpiar texto descargable (silencio positivo, checklist, marcas borrador) |
| `src/components/penelope/aside/PanelMetricasPrompts.tsx` | Reemplazar metricas genericas por resumen de trazabilidad                 |
| `src/components/penelope/panels/PanelTrazabilidad.tsx`   | Eliminar evento "Ajuste de prompt" no documentado                         |


### Restricciones respetadas

- No se agrega funcionalidad nueva no documentada.
- No se modifica logica de negocio, hooks ni backend.
- No se alteran flujos del verificador RUPECO ni validaciones.
- Todos los cambios son de layout, rotulacion y depuracion de contenido.