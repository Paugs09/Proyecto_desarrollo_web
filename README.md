# HormiGuane
## ¡De la tierrita para ti!

## Descripción

HormiGuane es una moderna tienda virtual enfocada en la comercialización de productos artesanales y gastronómicos originarios de la provincia Guanentina. Nuestro objetivo es ser el puente digital que conecta a los artesanos y productores locales con el mundo, promoviendo el consumo de productos autóctonos y exaltando el trabajo hecho a mano.

El sitio web ofrece un catálogo dinámico y estructurado donde el usuario puede explorar desde piezas artesanales en fibras naturales (fique, iraca, yute) y barro, hasta productos emblemáticos de la región como el sabajón, dulces de feijoa, café de origen y las tradicionales hormigas culonas. Conservando a la hormiga culona como símbolo de nuestra identidad, la tienda permite a los usuarios descubrir la historia, los materiales y el municipio de origen detrás de cada producto antes de su compra.

## Público objetivo

- **Turistas y visitantes:** Personas nacionales e internacionales que desean adquirir un recuerdo auténtico, artesanía o producto gastronómico de la región para llevar un pedazo de Santander consigo.
- **Amantes de la cultura y lo artesanal:** Compradores que valoran la calidad de los productos hechos a mano, las fibras naturales y el apoyo directo a los productores locales.
- **Locales nostálgicos y residentes:** Santandereanos en otras partes del país (o del mundo) que buscan sus sabores tradicionales, así como habitantes locales que desean un canal digital rápido y confiable para comprar lo mejor de su propia tierra.

## Integrantes

- Jefferson Arley Becerra Carreño
- María Paula Gómez Silva
- Angie Maria Moreno Mantilla

## Inspiraciones o referencias

### - Market Colombia
<a href="https://elmarketcolombia.com">
  <img src="ProjectData/img/MarketColombia.png" alt="Market Colombia" width="150">
</a>
Plataforma comercial enfocada en la venta de artesanías, souvenirs, alimentos típicos y regalos que representan la cultura nacional.

### - Artesanías de Colombia
<a href="https://earth.google.com/">
  <img src="ProjectData/img/artesaniaColombia.png" alt="Artesanías de Colombia" width="150">
</a>
Plataforma oficial de comercio electrónico diseñada para comercializar productos artesanales auténticos y resaltar la diversidad cultural de los artesanos del país.

### - Artesanías del Atlántico
<a href="https://artesaniasdelatlantico.com/">
  <img src="ProjectData/img/artesaniasAtantico.png" alt="Artesanías del Atlántico" width="150">
</a>
Sitio web de la Gobernación del Atlántico que funciona como vitrina comercial para venta de productos de artesanos.

### - Caseteja
<a href="https://caseteja.co">
  <img src="ProjectData/img/Casejeta.png" alt="Caseteja" width="150">
</a>
Página oficial dedicada a la comercialización de productos naturales y diversos alimentos artesanales de la región.

### - Ecofibras
<a href="https://www.ecofibrascuriti.com/">
  <img src="ProjectData/img/Ecofibra.png" alt="Ecofibras" width="150">
</a>
Plataforma de comercialización de artesanías en fique e información de historia.

### - Casa Fique
<a href="https://www.casafique.com/">
  <img src="ProjectData/img/casaFique.png" alt="Casa Fique" width="150">
</a>
Plataforma de la marca colombiana de moda artesanal, venta de productos sofisticados en fique.

### - Souvenirs Colombianos
<a href="https://souvenirscolombianos.com">
  <img src="ProjectData/img/souvenirsColombianos.png" alt="Souvenirs Colombianos" width="150">
</a>
Vitrina digital especializada en recuerdos auténticos y artesanías típicas organizadas por ciudades colombianas.

## Tecnologías utilizadas

### Control de versiones
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
- **Git** - Gestión del código fuente y colaboración en equipo

### Frontend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
- **Node.js** - Entorno de ejecución JavaScript
- **Angular** - Framework web para desarrollo de aplicaciones SPA
- **Tailwind CSS** - Framework de utilidades para diseño responsivo y moderno

### Backend
![.NET](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
- **.NET** - Framework para desarrollo del API REST
- **C#** - Lenguaje de programación orientado a objetos

### Base de datos e infraestructura
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)

- **Supabase** - Plataforma backend como servicio (BaaS) basada en PostgreSQL

## Arquitectura del proyecto

El proyecto está construido bajo un enfoque moderno y escalable, pensado para manejar variantes complejas de productos y un flujo de compra seguro.

- **Frontend:** Desarrollo ágil con **Angular 21** utilizando componentes *standalone*, interfaces responsivas y atractivas construidas con **Tailwind CSS**.
- **Backend y Base de Datos:** Arquitectura centrada en **Supabase** (PostgreSQL como motor de base de datos), con un modelo relacional bien definido que soporta atributos dinámicos de productos (SKUs variables), gestión de inventario en tiempo real, almacenamiento de imágenes mediante **Supabase Storage** y autenticación segura para usuarios y clientes.

# Instalación y uso

## Prerrequisitos

Asegúrate de tener instalado lo siguiente:

### 1. **Git**

#### Windows:
1. Descarga el instalador desde [git-scm.com](https://git-scm.com/download/win)
2. Ejecuta el instalador descargado
3. Sigue el asistente de instalación (puedes dejar las opciones por defecto)
4. Verifica la instalación abriendo CMD o PowerShell y ejecutando:
   ```bash
   git --version
   ```

#### macOS:
1. Instala usando Homebrew (recomendado):
   ```bash
   brew install git
   ```
   O descarga el instalador desde [git-scm.com](https://git-scm.com/download/mac)

2. Verifica la instalación:
   ```bash
   git --version
   ```

#### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install git
git --version
```

---

### 2. **Node.js** (versión 18 o superior)

#### Windows y macOS:
1. Descarga el instalador LTS desde [nodejs.org](https://nodejs.org/)
2. Ejecuta el instalador y sigue las instrucciones
3. Verifica la instalación:
   ```bash
   node --version
   npm --version
   ```

#### Linux (Ubuntu/Debian):
```bash
# Usando NodeSource para obtener la versión 18 o superior
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### Alternativa (Cualquier SO) - Usando NVM (Node Version Manager):
```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Cerrar y abrir la terminal, luego:
nvm install 18
nvm use 18
```

---

### 3. **.NET SDK** (versión 6.0 o superior)

#### Windows:
1. Descarga el SDK desde [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
2. Ejecuta el instalador
3. Verifica la instalación:
   ```bash
   dotnet --version
   ```

#### macOS:
```bash
# Usando Homebrew
brew install --cask dotnet-sdk

# O descarga desde dotnet.microsoft.com
```

Verifica la instalación:
```bash
dotnet --version
```

#### Linux (Ubuntu):
```bash
# Agregar el repositorio de Microsoft
wget https://packages.microsoft.com/config/ubuntu/$(lsb_release -rs)/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Instalar el SDK
sudo apt-get update
sudo apt-get install -y dotnet-sdk-8.0

# Verificar instalación
dotnet --version
```

---

### 4. **Angular CLI**

Una vez que Node.js y npm estén instalados, instala Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

Verifica la instalación:
```bash
ng version
```

---

## Verificación de todos los prerrequisitos

Para asegurarte de que todo está correctamente instalado, ejecuta los siguientes comandos:

```bash
git --version
node --version
npm --version
dotnet --version
ng version
```

Todos los comandos deberían devolver sus respectivas versiones sin errores.

## Tablero de Planificación (Scrum)

La planificación y organización del sprint se gestiona mediante **Bitrix24 Scrum**.
> 🔒 **Acceso restringido:** El tablero es privado. Si necesitas acceso, solicítalo al equipo para ser añadido como parte interesada.
[🔗 Ver tablero Scrum - HormiRuta](https://b24-s0ulxn.bitrix24.co/workgroups/group/3/tasks/?scrum=Y&tab=plan)

## Notas Finales

### Herramientas para el Desarrollo

#### Editor Backend
![Visual Studio](https://img.shields.io/badge/Visual_Studio-5C2D91?style=for-the-badge&logo=visualstudio&logoColor=white)
- **Visual Studio** - IDE recomendado para el desarrollo del backend en .NET
- Abre la solución `.sln` ubicada en la carpeta `backend`
- Configura el proyecto de inicio y ejecuta con `F5`

#### Editor Frontend
![Visual Studio Code](https://img.shields.io/badge/Visual_Studio_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)
- **Visual Studio Code** - Editor ligero y potente para el desarrollo del frontend en Angular
- Abre la carpeta `frontend` en VS Code
- Extensiones recomendadas:
  - Angular Language Service
  - ESLint
  - Prettier
- Ejecuta `ng serve` desde la terminal integrada

#### Testing de API
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
- **Postman** - Herramienta para pruebas y testing de endpoints de la API
- Importa la colección de endpoints (si está disponible)
- Configura las variables de entorno necesarias
- Prueba los endpoints del backend antes de integrar con el frontend

---

### 💡 Consejos Adicionales

- **Usa Git Branches**: Trabaja en ramas separadas para cada feature
- **Code Review**: Revisa el código antes de hacer merge a main
- **Testing**: Escribe pruebas unitarias para componentes críticos
- **Documentación**: Mantén actualizada la documentación de la API

---

<div align="center">
  <p>⭐ Si este proyecto te fue útil, considera darle una estrella ⭐</p>
  <p>Hecho con ❤️ y ☕</p>
</div>
