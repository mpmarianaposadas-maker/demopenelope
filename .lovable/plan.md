

# Fix: Restaurar validacion manual del operador antes de avanzar a evaluacion

## Problema

En `confirmarClasificacion` (hook `useChatRupecoSimulado.ts`), despues de confirmar la clasificacion, el flujo avanza automaticamente a traves de `validacion_documental` -> `resultado` -> `evaluacion` mediante `setTimeout` encadenados (lineas 510-626). Esto impide que el operador vea y use el panel `RequisitoVerificacion` para validar cada documento manualmente.

## Solucion

### 1. Detener el auto-avance en `confirmarClasificacion`

En `useChatRupecoSimulado.ts`, modificar la funcion `confirmarClasificacion` para que:
- Despues de simular la extraccion documental y actualizar el expediente, se **detenga** en el paso `validacion_documental`
- **NO** avance automaticamente a `resultado` ni `evaluacion`
- **NO** genere el informe de resultado ni la evaluacion JSON en ese momento

Concretamente: eliminar el `setTimeout` interno (lineas 530-626) que genera el informe, setea `resultado` y luego `evaluacion`. En su lugar, dejar el paso en `validacion_documental` y terminar con `setIsLoading(false)`.

### 2. Agregar un `useEffect` para avanzar cuando el operador complete la validacion

Agregar un nuevo `useEffect` en el hook que observe `todosRequisitosValidados` y `currentStep`:
- Cuando `currentStep === 'validacion_documental'` y `todosRequisitosValidados === true`, avanzar automaticamente a `resultado`
- En ese momento, generar el informe de verificacion formal y la evaluacion JSON (la logica que se removio del setTimeout)
- Luego avanzar a `evaluacion`

### 3. Extraer la logica de generacion de informe

Mover la logica de generacion del informe (actualmente en lineas 530-626) a una funcion separada `generarInformeYEvaluacion(expedienteActualizado)` que pueda ser invocada desde el `useEffect`.

## Archivos a modificar

- `src/hooks/useChatRupecoSimulado.ts`
  - Modificar `confirmarClasificacion`: detener en `validacion_documental` despues de cargar documentos
  - Agregar `useEffect` que observe `todosRequisitosValidados` para avanzar a `resultado`/`evaluacion`
  - Extraer logica de informe a funcion reutilizable

## Flujo restaurado

```text
ingreso_recepcion
       |
clasificacion_ia
       |
confirmacion_clasificacion  (operador confirma categoria)
       |
validacion_documental       (operador valida cada requisito - SE DETIENE AQUI)
       |                     RequisitoVerificacion visible con checkboxes
       |                     Operador valida/rechaza cada documento
       |
       v  (cuando todosRequisitosValidados === true, avanza automaticamente)
   resultado + evaluacion    (informe + acciones asistidas)
```

## Sin cambios en

- `ChatRupeco.tsx` (ya renderiza `RequisitoVerificacion` correctamente cuando `requisitosData` existe)
- `PanelDemoInteractiva.tsx` (la condicion `showAccionesAsistidas` ya funciona con `step === 'evaluacion'`)

