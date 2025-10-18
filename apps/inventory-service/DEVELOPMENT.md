## ✍️ Historial de Desarrollo
Aquí se documentan los pasos y decisiones tomadas durante la construcción de la API, permitiendo reconstruir el proceso mental en el futuro.

### **Fase 1: Configuración Inicial**  
$\small \text{ Fecha: 2025-SEP-23} $

*   **1 - Inicializacion del Proyecto:** Se inicializó el proyecto con `npm init -y` 

*   **2 - Instalación de Nodemon:** Se instalo Nodemon como `devDependencies` con `npm install --save-dev nodemon`.
*   **3 - Creacion de carpetas `docs`, `src`:** Se crearon las carpetas `docs` para la documentación y `src` para el código fuente.
*   **4 - Configuración de TypeScript:** Se instaló (`npm i -D typescript @types/node`) y configuró TypeScript, inicializando `tsconfig.json` con `npx tsc --init --outDir dist/ --rootDir src`.
*   **5 - Scripts de NPM:** Se configuraron los scripts `dev`, `build`, y `start` en `package.json` para el flujo de desarrollo y producción.
*   **6 - Instalación de `dotenv`:** Se instaló `npm install dotenv` para gestionar variables de entorno.

### **🔌 Instalacion y configuracion de ORM-Prisma**  

*   **1 - Instalacion de Prisma CLI:** `npm install prisma --save-dev`.
*   **2 - Inicialización de Prisma:** Se ejecutió `npx prisma init --datasource-provider PostgreSQL` para crear la carpeta `prisma` y el archivo `.env`.
*   **3 - Definición del Esquema:** Se definieron los modelos `User` y `AuthToken` en `prisma/schema.prisma`.
*   **4 - Migración de la Base de Datos:** Se ejecutó `npx prisma migrate dev` para aplicar el esquema a la base de datos.

---

### **Fase 2: Creación del Servidor Web con Express**
$\small \text{ Fecha: 2025-OCT-02} $

En esta fase se sienta la base de la API, creando un servidor web capaz de recibir y responder peticiones HTTP.

*   **1 - Instalación de Express:** 
    Se instaló el framework `Express` y sus tipos de TypeScript.
    ```bash
    npm install express
    npm install -D @types/express
    ```

*   **2 - Creación de la Carpeta `public`:** 
    Se creó la carpeta `public/` para servir archivos estáticos. Dentro, se añadió un `index.html` básico como página de bienvenida.

    **Ubicación:** `/public/index.html`
    ```html
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <h1>Tú eres increíble</h1>
    </body>
    </html>
    ```

*   **3 - Creación de la Clase `Server`:** 
    Se creó el archivo `src/server.ts` para encapsular la lógica del servidor Express. Esta clase es responsable de configurar middlewares, registrar rutas y arrancar el servidor.

    **Ubicación:** `src/server.ts`
    ```typescript
    import express, { Router } from 'express';

    interface Options {
      port: number;
      routes: Router;
      public_path?: string;
    }

    export class Server {
      public readonly app = express();
      private serverListener?: any;
      private readonly port: number;
      private readonly publicPath: string;
      private readonly routes: Router;

      constructor(options: Options) {
        const { port, routes, public_path = 'public' } = options;
        this.port = port;
        this.publicPath = public_path;
        this.routes = routes;
      }

      async start() {
        //* Middlewares
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);

        this.serverListener = this.app.listen(this.port, () => {
          console.log(`Server running on port ${this.port}`);
        });
      }
    }
    ```

*   **4 - Punto de Entrada de la Aplicación (`app.ts`):** 
    Este archivo es el corazón de la aplicación. Orquesta la creación y el inicio del servidor.

    **Ubicación:** `src/app.ts`
    ```typescript
    import { Server } from './server.js';
    import { AppRoutes } from './main_routes.js';
    import 'dotenv/config';

    function main() {
      const server = new Server({
        port: process.env.PORT_API ? parseInt(process.env.PORT_API, 10) : 3000,
        routes: AppRoutes.routes,
      });

      server.start();
    }

    main();
    ```
creacion de la rquitectura limpia 
primero se creo las carptetas 
src y public
dentro de src van las carpetas principales de la architecture
application 
la cual contene las carpetas dtos y use-cases
config que contiene  
la carpeta plugins que contiene la capeta plugins 
la cual se la ia explicaraa su uso en este caso tiene el
rchivo envs.plugins.ts
para lavariables del entorno 
domain que contiene la carpetas entities
y repositories 
infraestructure lacual contiene 
la implementacion de los repositorios enprisma en la 
carpeta datasource 
despuesal carpeta de presentation
la cual contiene la crpeta controllers  la cual tiene
los enpoints con al req y resp
la carpeta middleware para los middlewares del los endpoints
y routes la cualcontiene las rutas principales 
tambiensurgio este error 
En tus archivos estás usando la sintaxis de módulos ECMAScript (ES Modules) (import y export), y la regla verbatimModuleSyntax en tu tsconfig.json está impidiendo que TypeScript lo convierta automáticamente a CommonJS.

Básicamente, estás escribiendo código moderno en un proyecto configurado para un sistema de módulos antiguo, y una regla estricta está deteniendo la "traducción".

Aquí tienes las dos formas principales de solucionarlo, dependiendo de tu objetivo.
Solución 1: Cambiar tu proyecto a ES Modules (Recomendado)
Este es el enfoque moderno y preferido para la mayoría de los proyectos nuevos. Con esto, le indicas a Node.js y a TypeScript que todo tu proyecto debe usar la sintaxis import/export.

Abre tu archivo package.json.

Añade la siguiente línea en el nivel principal del objeto JSON:

JSON

"type": "module"
Tu package.json podría verse así ahora:

JSON

{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "type": "module", // <-- Añade esta línea
  "main": "index.js",
  "scripts": {
    "start": "node dist/index.js"
  },
  "dependencies": { ... }
}
Actualiza tu tsconfig.json para que se alinee con la resolución de módulos moderna. Esto asegura que TypeScript entienda cómo manejar los import en un entorno moderno de Node.js.

JSON

{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    // ... otras configuraciones como target, strict, etc.
    "verbatimModuleSyntax": true // Ahora puedes mantener esto en 'true'
  }
}


