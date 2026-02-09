
# Plan: 3 mejoras de usabilidad para la demo Penelope

## Resumen

Se implementan 3 mejoras de usabilidad alineadas con heuristicas de Nielsen: (1) sistema de ayuda contextual con banner de bienvenida y tooltips, (2) agrupacion visual de las 12 pestanas en 4 categorias, y (3) navegacion contextual entre pestanas con indicador de progreso.

---

## Archivos nuevos (2)

### 1. `src/components/penelope/panels/SiguientePaso.tsx`
Componente reutilizable de navegacion entre pestanas. Muestra un bloque con fondo `secondary/30`, texto "Siguiente paso sugerido:", boton con el nombre de la pestana destino + flecha, y una breve descripcion. Acepta props: `label`, `description`, `onNavigate`.

### 2. `src/contexts/TabNavigationContext.tsx`
Context de React que expone `goToTab(tabId: string)` y `visitedTabs: Set<string>`. Lo provee `AccessibleTabs` internamente y lo consumen los paneles hijos y `SiguientePaso`.

---

## Archivos modificados (6)

### 3. `src/components/penelope/AccessibleTabs.tsx` (cambios significativos)

**Nuevas props:**
- `groups?: TabGroup[]` (opcional) con interfaz `{ label: string; tabIds: string[] }`
- `tooltips?: Record<string, string>` (opcional) - mapa de tabId a texto de tooltip

**Cambios internos:**
- Crea y provee `TabNavigationContext` con `goToTab` (que busca el index por tabId y llama `setActiveIndex`) y `visitedTabs`
- Trackea pestanas visitadas con un `useState<Set<string>>` que se actualiza en cada click/cambio de tab
- Si `groups` esta definido, renderiza las pestanas agrupadas: etiqueta de grupo (text-[10px], text-muted-foreground/70) arriba de cada grupo, separador vertical (div 1px width, bg-border) entre grupos, oculto en mobile
- Si `tooltips` esta definido, cada boton de tab tiene un div con position relative, y al hacer hover (onMouseEnter/onMouseLeave con useState) aparece un div absolutamente posicionado debajo con el texto del tooltip (bg-gray-900, text-white, text-xs, rounded, px-2 py-1, z-50, animate fade-in). En mobile no se muestra (hidden en `md:block`)
- Indicador de progreso del recorrido: dentro del panel de contenido (antes de `children[activeIndex]`), si el usuario ha visitado entre 1 y 5 de las 6 pestanas del recorrido, muestra un pequeno badge "X/6 del recorrido" con mini barra de progreso en la esquina superior derecha. Cuando llega a 6, muestra "Recorrido completo" en verde que desaparece con setTimeout de 3 segundos. Las 6 pestanas del recorrido: `acerca-de`, `demo-interactiva`, `arquitectura`, `brecha-rupeco`, `propuesta-normativa`, `metricas`

### 4. `src/pages/Index.tsx`

- Reordenar el array `tabs` y los children de `AccessibleTabs` segun los 4 grupos:
  1. acerca-de, arquitectura, brecha-rupeco (Conceptual)
  2. demo-interactiva, borradores, simulador (Operativo)
  3. trazabilidad, propuesta-normativa, seguridad (Gobernanza)
  4. metricas, metricas-operador, trazabilidad-ciudadana (Monitoreo)

- Definir el array `groups` y `tooltips` y pasarlos como props a `AccessibleTabs`

- Los tooltips:
  - acerca-de: "Marco conceptual, pregunta de investigacion y alcance"
  - demo-interactiva: "Simule un tramite completo con verificacion RUPECO"
  - arquitectura: "Diagramas de flujo y modelo de fiabilidad por diseno"
  - brecha-rupeco: "Hallazgo central: cobertura del 57% y principio Once-Only"
  - borradores: "Providencia de pase y nota de intimacion generadas por IA"
  - trazabilidad: "Pilares de compliance y registro de auditoria"
  - metricas: "Proyecciones de impacto basadas en benchmarking internacional"
  - propuesta-normativa: "Articulado propuesto y experiencias comparadas"
  - seguridad: "Validacion contra prompt injection y datos sensibles"
  - simulador: "Simulacion del flujo interno paso a paso"
  - metricas-operador: "Dashboard de rendimiento con exportacion CSV"
  - trazabilidad-ciudadana: "Consulta publica del estado de un expediente"

### 5. `src/components/penelope/panels/PanelAcercaDe.tsx`

- Agregar `useState` para `showWelcome` (default true)
- Importar `Compass`, `X` de lucide-react y `useContext` de react
- Importar `TabNavigationContext`
- Antes de la seccion "El Viaje de Penelope", renderizar condicionalmente el banner de bienvenida:
  - Gradiente `bg-gradient-to-r from-primary/10 to-primary/5`, borde `border border-primary/20`, rounded-lg, p-5
  - Boton X para cerrar (esquina superior derecha)
  - Icono Compass + titulo + texto introductorio
  - Lista numerada de 6 pasos con emojis
  - Boton "Entendido, comenzar" que oculta el banner
  - Nota al pie en text-xs

- Al final, agregar `SiguientePaso` con destino "demo-interactiva", label "Demo Interactiva", description "Pruebe el sistema en accion con un tramite simulado"

### 6. `src/components/penelope/panels/PanelDemoInteractiva.tsx`

- Importar `TabNavigationContext` y `SiguientePaso`
- Agregar al final: SiguientePaso hacia "arquitectura" con descripcion "Explore los diagramas de flujo del sistema"

### 7. `src/components/penelope/panels/PanelArquitectura.tsx`

- Agregar SiguientePaso al final hacia "brecha-rupeco" con descripcion "Visualice el hallazgo central del trabajo"

### 8. `src/components/penelope/panels/PanelBrechaRupeco.tsx`

- Agregar SiguientePaso al final hacia "propuesta-normativa" con descripcion "Revise el articulado propuesto"

### 9. `src/components/penelope/panels/PanelPropuestaNormativa.tsx`

- Agregar SiguientePaso al final hacia "metricas" con descripcion "Consulte las proyecciones de impacto"

### 10. `src/components/penelope/chat/ChatRupeco.tsx`

- Importar `useIsMobile` de `@/hooks/use-mobile`
- En el banner de sistema deshabilitado (lineas 87-94), agregar texto adicional: "Para reactivarlo, use el panel de Kill Switch en la barra lateral." En mobile, agregar tambien: "Abra el panel lateral con el boton ☰."

---

## Seccion Tecnica

### Arquitectura del TabNavigationContext

```text
AccessibleTabs (Provider)
  |-- goToTab(tabId) --> finds index, calls setActiveIndex
  |-- visitedTabs: Set<string> --> tracks visited tabs
  |
  +-- Panel children (Consumers)
       |-- SiguientePaso component calls goToTab on click
       |-- Progress indicator reads visitedTabs
```

### Patron de tooltips
- Se usa un estado local `hoveredTab: string | null` en AccessibleTabs
- Cada tab button tiene un wrapper div con `position: relative`
- onMouseEnter sets hoveredTab, onMouseLeave clears it
- Tooltip div con `position: absolute; top: 100%; left: 50%; transform: translateX(-50%)` y animacion CSS `animate-in fade-in-0` (ya disponible en el proyecto via tailwindcss-animate)
- En mobile (< md), los tooltips no se renderizan

### Patron de agrupacion
- Si `groups` prop existe, se itera sobre groups en lugar de tabs directamente
- Para cada grupo: label div + tabs del grupo + separador (excepto ultimo grupo)
- Los separadores son `<div className="hidden md:block w-px self-stretch bg-border mx-1" />`
- Las etiquetas de grupo: `<span className="text-[10px] text-muted-foreground/70 uppercase tracking-wider px-1">`

### Orden de implementacion
1. Crear TabNavigationContext
2. Crear SiguientePaso
3. Modificar AccessibleTabs (grupos, tooltips, contexto, progreso)
4. Modificar Index.tsx (reorden, grupos, tooltips)
5. Modificar PanelAcercaDe (banner de bienvenida + SiguientePaso)
6. Modificar paneles con SiguientePaso (DemoInteractiva, Arquitectura, BrechaRupeco, PropuestaNormativa)
7. Modificar ChatRupeco (texto adicional en banner KillSwitch)

### Dependencias
No se instalan nuevas dependencias. Se usan:
- lucide-react: Compass, X, ArrowRight (ya importados en otros archivos)
- framer-motion: motion/AnimatePresence (ya en uso en AccessibleTabs)
- React createContext/useContext/useState
- useIsMobile hook (ya existe)
- tailwindcss-animate (ya en el proyecto, provee animate-in/fade-in-0)
