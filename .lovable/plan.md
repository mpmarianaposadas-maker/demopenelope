
# Plan: 6 cambios para alinear la demo con el trabajo final de posgrado

## Resumen

Se crean 3 nuevos paneles (Acerca de, Brecha RUPECO, Propuesta Normativa), se reescribe Arquitectura con diagramas de flujo, se corrigen los KPIs de Metricas, y se reorganizan las pestanas.

---

## Archivos nuevos (3)

### 1. `src/components/penelope/panels/PanelAcercaDe.tsx`
Panel introductorio con 6 secciones:
- Cita estilizada sobre el mito de Penelope (bloque con fondo primary/5)
- Grilla 2x2 de transformacion institucional (de -> a) con tarjetas
- Pregunta de investigacion e hipotesis
- Dos columnas "ES / NO ES" con checks verdes y cruces rojas (lucide-react icons: Check, X)
- Estadisticas de alcance (4 KPIs: 5, 14, 12, 3)
- Creditos con Badge del posgrado

Usa: Card, CardTitle, CardText de penelope/Card, Badge de ui/badge, Check/X/BookOpen/GraduationCap de lucide-react.

### 2. `src/components/penelope/panels/PanelBrechaRupeco.tsx`
Panel de analisis de brecha RUPECO con 5 secciones:
- Introduccion con datos del decreto 971/2024
- Cobertura por sector con barras de progreso (Progress de ui/progress) y badges verde/rojo
- Nucleo documental comun (dos columnas personas humanas / juridicas)
- Principio Once-Only antes vs despues (dos columnas roja/verde con badges de documentos)
- Tabla de oportunidad de consolidacion (Table/TableRow/TableCell de penelope/Table)

Usa: Card, CardTitle, CardText, Progress, Badge, Table, AlertTriangle icon.

### 3. `src/components/penelope/panels/PanelPropuestaNormativa.tsx`
Panel de propuesta normativa con 5 secciones:
- Introduccion sobre encuadre juridico
- Articulado propuesto: 5 tarjetas con borde izquierdo coloreado (azul/ambar/verde segun categoria)
- Extension del RUPECO con checks
- Responsabilidad del Estado (Ley 26.944, caso Vadell)
- Experiencias internacionales (grilla 2x2 con banderas emoji)

Usa: Card, CardTitle, CardText, Badge, Check/Scale/Globe/Shield icons.

---

## Archivos modificados (4)

### 4. `src/components/penelope/panels/PanelArquitectura.tsx` (reescribir)
Mantiene la intro existente con traducciones i18n, agrega:
- Seccion "Modelo de Fiabilidad Procedimental" con bloque destacado y grilla 2x2 de principios
- Seccion "Diagramas de Flujo" con Tabs internos (Flujo Principal / Flujo de Subsanacion)
  - Flujo Principal: 7 pasos verticales con colores por actor + linea de limite roja punteada
  - Flujo Subsanacion: 6 pasos verticales
- Leyenda de actores (3 badges: azul, verde, ambar)
- Mantiene seccion de componentes principales al final

Usa: Card, CardTitle, CardText, CardList, Tabs/TabsList/TabsTrigger/TabsContent de ui/tabs, Badge.

### 5. `src/components/penelope/panels/PanelMetricas.tsx` (corregir KPIs)
Cambios:
- KPI 1: "35-40%" / "reduccion total" + nota "en etapas preliminares"
- KPI 2: "70-100%" / "overlap RUPECO" + nota "requisitos reutilizables"
- KPI 3: "12-18" / "dias ganados" + nota "para analisis sustantivo"
- KPI 4: "100%" / "supervision humana" + nota "en toda decision"
- Nuevo texto introductorio sobre metodologia (ANATEL, OFCOM, BID, OCDE)
- Fila Argentina en tabla internacional: "35-40% proyectado"
- Nuevo bloque de alerta ambar "Nota metodologica" al final

Se agrega estructura de 3 lineas por KPI (valor, subtitulo, nota en texto mas chico).

### 6. `src/pages/Index.tsx`
- Importar PanelAcercaDe, PanelBrechaRupeco, PanelPropuestaNormativa
- Reordenar tabs array a 12 pestanas en el orden solicitado
- Reordenar children del AccessibleTabs en el mismo orden

### 7. `src/components/penelope/panels/index.ts`
- Agregar exports: PanelAcercaDe, PanelBrechaRupeco, PanelPropuestaNormativa

### 8. `src/lib/i18n.ts`
Agregar traducciones de tabs en ambos idiomas:
- ES: `tabs.acercaDe`, `tabs.brechaRupeco`, `tabs.propuestaNormativa`
- EN: mismas keys con valores en ingles
- Actualizar KPIs de metricas en ambos idiomas (valores, labels, descripciones, intro)

---

## Seccion Tecnica

### Orden de implementacion
1. Agregar traducciones a i18n.ts (tabs + KPIs corregidos)
2. Crear PanelAcercaDe.tsx
3. Crear PanelBrechaRupeco.tsx
4. Crear PanelPropuestaNormativa.tsx
5. Reescribir PanelArquitectura.tsx
6. Corregir PanelMetricas.tsx (KPIs + nota metodologica)
7. Actualizar panels/index.ts
8. Actualizar Index.tsx (imports, tabs, orden)

### Dependencias
No se instalan nuevas dependencias. Se usan:
- lucide-react (ya instalado): Check, X, AlertTriangle, BookOpen, GraduationCap, Shield, Scale, Globe, ArrowRight, FileText, Users, Building
- @radix-ui/react-tabs via ui/tabs (ya instalado)
- @radix-ui/react-progress via ui/progress (ya instalado)
- Badge de ui/badge (ya existe)
- Card/CardTitle/CardText/CardList de penelope/Card (ya existe)
- Table/TableRow/TableCell de penelope/Table (ya existe)

### Patron de estilo
- Textos nuevos en espanol directo (contenido academico-legal)
- useLanguage solo para traducciones de tabs y KPIs existentes
- Tarjetas con borde izquierdo coloreado: `border-l-4 border-l-blue-500`
- Bloques de alerta ambar: `bg-amber-50 border border-amber-200 rounded-lg p-4`
- Grillas responsivas: `grid grid-cols-1 md:grid-cols-2 gap-4`
