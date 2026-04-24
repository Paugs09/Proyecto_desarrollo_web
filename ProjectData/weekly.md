*Este documento se ha generado con el objetivo de realizar un seguimiento semanal del proyecto HormiRuta Santandereana.*

# PRIMERA REUNIÓN
=====================
---------------------------

### DEFINICIÓN DEL PROYECTO Y ORGANIZACIÓN INICIAL

#### Tema del proyecto
Se definió el enfoque del proyecto: una tienda virtual de servicios y experiencias turísticas centrada en el municipio de San Gil, Santander, con proyección provincial y departamental.

#### Nombre y slogan
- **Nombre:** HormiRuta Santandereana
- **Slogan:** *¡Marcando un camino de experiencias, aventura y cultura!*

#### Organización del README
Se estructuró el archivo README con los siguientes apartados:
- Descripción del proyecto
- Público objetivo
- Integrantes y roles
- Referencias e inspiraciones
- Tecnologías a utilizar

#### Público objetivo
- Turistas nacionales e internacionales interesados en San Gil y Santander
- Usuarios que buscan profundizar en turismo, naturaleza, cultura y aventura

#### Referencias definidas
| Referencia | Enfoque |
|---|---|
| Google Earth | Exploración geográfica con mapas interactivos |
| Visit Norway | Presentación de destinos turísticos culturales y visuales |
| Culture Trip | Narrativa de experiencias desde un enfoque cultural |
| Tus Guías de Viaje | Organización visual de experiencias por territorio |
| Mapbox | Implementación de mapas dinámicos y geolocalización |
| Google Maps | Navegación mediante puntos de interés |

#### Tecnologías definidas y por qué se van a usar

**Control de versiones**

- **Git** — Herramienta estándar para la gestión del código fuente. Permite llevar un historial de cambios, trabajar en ramas independientes por feature y colaborar en equipo sin riesgo de sobrescribir el trabajo de otros integrantes.

**Frontend**

- **Node.js** — Entorno de ejecución de JavaScript del lado del servidor. Se eligió como base del entorno de desarrollo porque Angular CLI y todas sus dependencias lo requieren. Permite ejecutar herramientas de construcción, gestión de paquetes con npm y el servidor de desarrollo local.

- **Angular** — Framework web desarrollado por Google para construir aplicaciones de una sola página (SPA). Se eligió por su arquitectura basada en componentes reutilizables, su sistema de tipado con TypeScript que reduce errores en tiempo de desarrollo, su integración nativa con herramientas como Angular CLI, y por ser una tecnología trabajada en el curso.

**Backend**

- **.NET** — Framework de Microsoft para el desarrollo de aplicaciones web y APIs REST. Se seleccionó por su robustez, rendimiento y amplio soporte para arquitecturas en capas, facilitando la organización del código en controladores, servicios y repositorios.

- **C#** — Lenguaje de programación orientado a objetos fuertemente tipado, nativo del ecosistema .NET. Se eligió por su sintaxis clara, su soporte para programación asíncrona con `async/await` y por ser el lenguaje trabajado en el curso para el desarrollo del backend.

#### Primeras tareas asignadas
Se organizó el tablero de sprint con las tareas iniciales del proyecto y se repartieron responsabilidades entre los integrantes.

---
---

# SEGUNDA REUNIÓN
=====================
---------------------------

### DEFINICIÓN DE IDENTIDAD VISUAL Y HERRAMIENTAS DE DISEÑO

#### Paleta de colores
Se definió la paleta oficial del proyecto, basada en tonos cálidos que evocan la naturaleza y la cultura santandereana:
#3A6B35 — Verde bosque
#C84B31 — Rojo terracota
#F4A261 — Naranja principal
#2A9D8F — Verde azulado
#F8F4E3 — Crema / fondo.

#### Logo
Se diseñó el logotipo del proyecto, integrando los elementos visuales representativos de San Gil y la identidad de HormiRuta.

#### Personaje distintivo
Se adoptó la **hormiga culona** como mascota y guía del proyecto, representada en diferentes personalidades y acciones según el contexto:
- Hormiga sangileña (personaje principal)
- Hormiga aventurera (sección de actividades)

#### Estilo de diseño
Se definió el estilo visual para los mockups: moderno, cálido y accesible, con componentes card-based y énfasis en imágenes de paisajes y actividades.

#### Herramienta de diseño colaborativo
Se eligió **Figma** como herramienta oficial de diseño colaborativo por las siguientes razones:
- Basada en la nube, accesible desde cualquier dispositivo
- Permite colaboración en tiempo real entre los integrantes
- Facilita la creación de componentes reutilizables y sistemas de diseño
- Soporta prototipado interactivo para simular el flujo de la aplicación

---
---

# TERCERA REUNIÓN
=====================
---------------------------

### DISEÑO RESPONSIVE Y WIREFRAMES EN FIGMA

#### Distribución del trabajo
Se distribuyeron las tareas de diseño entre los integrantes para trabajar en paralelo sobre los wireframes definidos en la semana anterior.

#### Diseño responsive
Se realizó el diseño responsive en Figma para los tres breakpoints principales:
- **Mobile** — hasta 575px
- **Tablet** — 576px a 991px
- **Desktop** — 992px en adelante

#### Vistas diseñadas
- Home (carrusel, buscador, secciones de cards)
- Login
- Registro
- Detalle de lugar / actividad

#### Flujo y navegación
Se definieron los enlaces y el funcionamiento inicial que tendría la página, incluyendo:
- Navegación entre vistas
- Comportamiento del carrusel principal
- Interacción con las tarjetas de productos
- Flujo de registro e inicio de sesión

---
---

# CUARTA REUNIÓN
=====================
---------------------------

### ESTRUCTURA DEL PROYECTO E INICIO DEL DESARROLLO

#### Estructura del proyecto
Se definió la arquitectura de carpetas del proyecto tanto para frontend como para backend:

```
├── Backend/ApiHormiRuta/
  │     ├── API/
  │     ├── Core/
  │     ├── Infraestructure/
  │     ├── .gitignore
  │     └── ApiHormiRuta.slnx
  ├── Frontend/hormi-ruta/
  │     ├── .angular/
  │     ├── .vscode/
  │     ├── node_modules/
  │     ├── public/
  │     └── src/
  │           ├── app/
  │             ├── feature/
  │               ├── components/
  │               ├── interfaces/
  │               ├── services/
  │           ├── shared/
  │           ├── assets/
  │           ├── environments/
  │           ├── index.html
  │           ├── main.server.ts
  │           ├── main.ts
  │           ├── server.ts
  │           └── styles.scss
  ├── ProjectData/
  └── README.md
```

#### Instalación de recursos
Se instalaron y configuraron las herramientas necesarias:
- Angular CLI y dependencias del proyecto
- .NET SDK
- Configuración del entorno de desarrollo local

#### Esquematización de vistas iniciales
Se comenzó la implementación de las vistas base:
- **Home** — estructura con carrusel y secciones de cards
- **Login** — formulario de inicio de sesión
- **Registro** — formulario de creación de cuenta

#### Base de datos y Backend
Se inició el diseño del modelo de base de datos y la estructura del backend:
- Definición de entidades principales (aventuras, lugares, alojamientos)
- Configuración inicial de la API REST con .NET
- Conexión a base de datos PostgreSQL mediante Supabase

---
---

# QUINTA REUNIÓN
=====================
---------------------------

### REFACTORIZACIÓN, INTEGRACIÓN BACKEND-FRONTEND Y REVISIÓN DEL ENFOQUE

#### Refactorización en componentes
Se refactorizó el proyecto separando las responsabilidades en componentes reutilizables:
- `CarouselComponent` — carrusel principal con autoplay y navegación manual
- `CardsComponent` — tarjeta reutilizable con efecto hover, hormiga animada e información de producto
- `HomeComponent` — vista principal que consume y orquesta los componentes
- Interfaces TypeScript definidas: `ICarouselItem`, `IPlaceCard`, `Adventure`

#### Cards de productos
Se implementaron las cards con las siguientes características:
- Imagen, título, descripción (limitada a 3 líneas con `-webkit-line-clamp`)
- Precio formateado en pesos colombianos con `CurrencyPipe`
- Nota de precio (por persona, por noche, etc.)
- Efecto hover con elevación, sombra naranja y gif de hormiga animada

#### Conexión Backend - Frontend
Se realizó la integración entre el frontend Angular y la API REST:
- Configuración del `environment.ts` con la URL del backend
- Creación del `AdventureService` para consumir el endpoint `GET /api/adventures`
- Mapeo de `AdventureDto` a `IPlaceCard` para renderizar los datos en las cards
- Configuración de `provideHttpClient(withFetch())` para compatibilidad con SSR

#### Documento de productos
Se realizó un documento con la búsqueda y definición de todos los productos a utilizar en la plataforma, incluyendo imágenes, descripciones, precios y categorías.

#### Pendiente — Revisión del enfoque de productos
Se identificó la necesidad de replantear algunos enfoques del proyecto en cuanto a la categorización y presentación de productos. **Pendiente de confirmación con el docente.**

---
---

# SEXTA REUNIÓN
=====================
---------------------------

### RETROSPECTIVA SPRINT 3, NUEVAS TAREAS Y MEJORA DE HERRAMIENTAS

#### Retrospectiva Sprint 3
Se llevó a cabo la retrospectiva correspondiente al Sprint 3, en la que el equipo evaluó el trabajo realizado durante el sprint, identificando aspectos positivos, oportunidades de mejora y acciones concretas a implementar en el siguiente ciclo.

#### Nuevas tareas asignadas
A partir de los resultados de la retrospectiva, se fijaron nuevas tareas en el tablero Scrum para el siguiente sprint, distribuyendo responsabilidades entre los integrantes del equipo.

#### Objetivo de mejora — Herramientas para reuniones semanales
Como objetivo de mejora planteado en la retrospectiva, el equipo exploró y probó nuevas herramientas para la realización de las reuniones semanales, con el fin de optimizar la comunicación, la colaboración y el seguimiento del proyecto.

---
---

# SÉPTIMA REUNIÓN
=====================
---------------------------

### REBRANDING Y CAMBIOS EN LA DEFINICIÓN ESTRATÉGICA

#### Rebranding y enfoque del proyecto
Se oficializó el cambio de nombre del proyecto de "HormiRuta" a "HormiGuane". Este proceso incluyó el replanteamiento del enfoque estratégico y la actualización del archivo README.md para alinear la visión del equipo con la nueva identidad y los objetivos del proyecto.

#### Definición y distribución de productos
Se definieron los productos finales que formarán parte de la plataforma, estableciendo su distribución lógica y categorización. Este ajuste asegura que el catálogo sea coherente con el nuevo concepto de marca y las necesidades identificadas.

#### Ajuste de wireframes y mockups
Debido al cambio en el enfoque del proyecto, se actualizaron los wireframes y mockups en Figma. Se realizaron modificaciones en los diseños de baja y alta fidelidad para integrar la nueva estructura de productos y asegurar que la interfaz gráfica responda correctamente al replanteamiento estratégico.

---
---

# OCTAVA REUNIÓN
=====================
---------------------------

### ESTABILIZACIÓN TÉCNICA, RESOLUCIÓN DE BLOQUEOS Y ASIGNACIÓN DE NUEVAS TAREAS

#### Solución de inconsistencias y refactorización
Se realizó una sesión técnica para resolver inconsistencias surgidas al adaptar el nuevo enfoque de HormiGuane con los componentes reutilizados del proyecto anterior. Se aseguró que la lógica de los componentes heredados fuera compatible con la nueva estructura de datos y la identidad de marca actual.

#### Resolución de bloqueos
Se abordaron y solucionaron errores críticos en el código, despejando dudas técnicas y eliminando bloqueos que impedían el avance del equipo. Este proceso permitió estabilizar la rama de desarrollo y garantizar que la integración entre los componentes antiguos y los nuevos sea fluida.

#### Nuevas tareas asignadas
Se definieron y asignaron nuevas tareas en el tablero Scrum. Estas responsabilidades están enfocadas en avanzar con las funcionalidades pendientes del nuevo enfoque, asegurando una distribución equitativa del trabajo para cumplir con los objetivos del sprint actual.

---
---

# NOVENA REUNIÓN
=====================
---------------------------

### NUEVA ESTRATEGIA DE RAMIFICACIÓN Y SEGUIMIENTO DE AVANCES

#### Nueva gestión de ramas en GitHub
Debido a conflictos recurrentes durante los merges, se definió un nuevo manejo de ramificación. Se acordó la creación de ramas específicas por cada Sprint, utilizando una nomenclatura que indique la tarea a realizar. Este enfoque busca evitar que un miembro del equipo sobreescriba el trabajo de otro al editar el mismo componente, estableciendo además que cualquier cambio mayor debe partir de una rama nueva basada siempre en main.

#### Visualización de avances y seguimiento
Se llevó a cabo una revisión de las tareas asignadas en la reunión anterior para monitorear el progreso de cada integrante. El equipo presentó los adelantos en el desarrollo de HormiGuane, permitiendo verificar que el flujo de trabajo se mantiene alineado con los objetivos del sprint.

#### Resolución de dudas en el desarrollo
Se abrió un espacio para despejar interrogantes técnicas surgidas durante la implementación. Esta dinámica facilitó la fluidez en el desarrollo, eliminando bloqueos específicos y asegurando que todos los miembros tengan claridad sobre la lógica de los componentes y la integración con el nuevo sistema de ramas.

---
---

# DÉCIMA REUNIÓN
=====================
---------------------------

### RETROSPECTIVA DEL SPRINT 4 Y CIERRE DE OBJETIVOS

#### Retrospectiva del sprint 4
El equipo llevó a cabo la sesión de retrospectiva correspondiente al Sprint 4. Durante la reunión, se analizaron los puntos fuertes de la iteración, especialmente la eficacia de la nueva estrategia de ramificación en GitHub, y se identificaron áreas de mejora en la comunicación técnica para seguir optimizando los tiempos de entrega en el próximo sprint.

#### Revisión de tareas terminadas
Se realizó una revisión de los entregables para verificar el cumplimiento de los objetivos planteados. Se confirmó que todas las tareas definidas para este sprint se encuentran completamente terminadas y funcionales, cumpliendo con los criterios de aceptación establecidos para el desarrollo de la plataforma.

#### Validación de objetivos alcanzados
Se compararon los resultados finales con el plan inicial del sprint, validando que el equipo logró estabilizar el nuevo enfoque del proyecto y la integración de componentes. Con esta revisión, se da por concluido formalmente el sprint 4, dejando el proyecto listo para la planeación de la siguiente etapa.
