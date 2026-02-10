

# Fix: Mostrar "Acciones asistidas disponibles" en el paso de evaluacion

## Problema

La condicion actual `flowState?.step === 'evaluacion' && flowState.todosRequisitosValidados && !flowState.aprobacion` es demasiado restrictiva. Los flags `todosRequisitosValidados` o `aprobacion` pueden no estar sincronizandose correctamente, lo que impide que las acciones asistidas se muestren.

## Solucion

Cambiar la linea 177 de `PanelDemoInteractiva.tsx`:

**Antes:**
```
const showAccionesAsistidas = flowState?.step === 'evaluacion' && flowState.todosRequisitosValidados && !flowState.aprobacion;
```

**Despues:**
```
const showAccionesAsistidas = flowState?.step === 'evaluacion';
```

Esto hara que las acciones asistidas aparezcan automaticamente cuando el flujo llegue al paso de evaluacion, sin depender de flags adicionales.

## Archivo modificado

- `src/components/penelope/panels/PanelDemoInteractiva.tsx` (1 linea)

## Sin otros cambios

Se mantiene intacto el resto del componente: selector de expedientes, MobileStepper, dialogos de Intimacion y Pase, y toda la estructura actual.

