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
*   **2 - Inicialización de Prisma:** Se ejecutó `npx prisma init --datasource-provider PostgreSQL` para crear la carpeta `prisma` y el archivo `.env`.
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

#### **Flujo de Trabajo del Servidor:**

1.  **Inicio:** La ejecución comienza en `src/app.ts`.
2.  **Función `main`:**
    *   Carga las variables de entorno del archivo `.env`.
    *   Crea una instancia de la clase `Server`.
    *   Le pasa dos configuraciones clave: el **puerto** (desde las variables de entorno) y las **rutas** (importadas desde `main_routes.ts`).
3.  **Clase `Server` (`start()`):**
    *   La instancia del servidor configura los middlewares necesarios para parsear JSON y datos de formularios.
    *   Configura la carpeta `public` para ser accesible públicamente.
    *   Registra el enrutador principal (`AppRoutes.routes`) para que todas las peticiones sean manejadas por él.
    *   Finalmente, pone al servidor a escuchar en el puerto especificado.

---

### **Fase 3: Arquitectura de Rutas y Controladores**
$\small \text{ Fecha: 2025-OCT-03} $

Se establece una arquitectura limpia para el manejo de rutas, separando responsabilidades y facilitando la escalabilidad.

*   **1 - Creación de Carpetas de Arquitectura:** 
    Se crean las carpetas que definirán la arquitectura limpia:
    *   `src/presentation`: Para la capa de interacción con el exterior (HTTP).
    *   `src/presentation/routes`: Para los archivos de enrutamiento.
    *   `src/presentation/controllers`: Para los controladores que manejan la lógica de las peticiones.

*   **2 - Enrutador Principal (`main_routes.ts`):** 
    Este archivo actúa como el "distribuidor" principal de rutas. Su única responsabilidad es delegar las peticiones a los enrutadores de características específicas.

    **Ubicación:** `src/main_routes.ts`
    ```typescript
    import { Router } from 'express';
    import { Authroutes } from './presentation/routes/routes.js';

    export class AppRoutes {
      static get routes(): Router {
        const router = Router();

        // Delega cualquier petición que llegue a /api/auth al enrutador de autenticación
        router.use('/api/auth', Authroutes.routes);

        return router;
      }
    }
    ```

*   **3 - Enrutador de Autenticación (`routes.ts`):** 
    Este enrutador, ubicado en la capa de presentación, define las rutas específicas para la autenticación (`/register`, `/login`, etc.) y las asocia con los métodos de un controlador.

    **Ubicación:** `src/presentation/routes/routes.ts`
    ```typescript
    import { Router } from "express";
    import { AuthController } from "../controllers/auth_controller.js";
    import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";
    import { UserPrismaDatasource } from "../../infrastructure/datasources/prisma-user-datasource.js";

    export class Authroutes {
      static get routes(): Router {
        const router = Router();

        // --- INYECCIÓN DE DEPENDENCIAS ---
        const userRepository = new UserPrismaDatasource();
        const registerUseCase = new RegisterUserUseCase(userRepository);
        const controller = new AuthController(registerUseCase);

        // Definir las rutas específicas de autenticación
        router.post('/register', controller.registerUser);
        // router.post('/login', controller.loginUser);

        return router;
      }
    }
    ```

*   **4 - Controlador de Autenticación (`auth_controller.ts`):** 
    El controlador es el "portero". Recibe la petición HTTP, valida los datos de entrada (con ayuda de los DTOs) y orquesta la ejecución del caso de uso correspondiente.

    **Ubicación:** `src/presentation/controllers/auth_controller.ts`
    ```typescript
    import type { Request, Response } from "express"
    import { RegisterUserDto } from "../../domain/dtos/auth/register.user.dto.js";
    import { RegisterUserUseCase } from "../../application/use-cases/register-user.usecase.js";

    export class AuthController{

      constructor(
        private readonly registerUserUseCase: RegisterUserUseCase,
      ){}

      registerUser = async (req: Request, res: Response) => {
        const [err, registerUserDto] = RegisterUserDto.create(req.body);
        if (err) return res.status(400).json({ error: err });
        if (!registerUserDto) return res.status(400).json({ error: "Invalid registration data" });

        try {
          await this.registerUserUseCase.execute(registerUserDto);
          return res.status(201).json({ message: "Usuario registrado correctamente" });
        } catch (error: unknown) {
          // ... manejo de errores ...
        }
      };
    }
    ```

#### **Flujo de Trabajo de una Petición de Registro:**

1.  **Llega una Petición:** Un cliente envía una petición `POST` a `/api/auth/register`.
2.  **`server.ts`:** El servidor Express recibe la petición.
3.  **`main_routes.ts`:** El enrutador principal ve que la URL empieza con `/api/auth` y pasa la petición al enrutador `Authroutes`.
4.  **`presentation/routes/routes.ts`:** El enrutador de autenticación ve que la ruta coincide con `/register` y el método es `POST`. Invoca al método `registerUser` del `AuthController`.
5.  **`presentation/controllers/auth_controller.ts`:**
    *   El método `registerUser` recibe el `req` (petición) y `res` (respuesta).
    *   Utiliza el `RegisterUserDto` para validar el `req.body`. Si hay un error, devuelve una respuesta 400.
    *   Si la validación es exitosa, llama al método `execute` del `RegisterUserUseCase`, pasándole el DTO con los datos limpios.
6.  **(Siguiente Fase)** El caso de uso procesa la lógica de negocio.
7.  **Respuesta:** El controlador recibe el resultado del caso de uso y envía una respuesta al cliente (ej. un 201 Creado o un 500 si hay un error).

---

### **Fase 4: Capas de Dominio, Aplicación e Infraestructura**
$\small \text{ Fecha: 2025-OCT-04} $

Se implementa el núcleo de la Arquitectura Limpia, separando la lógica de negocio (dominio), los casos de uso (aplicación) y los detalles técnicos (infraestructura).

*   **1 - Creación de Carpetas de Arquitectura:** 
    *   `src/domain`: Para la lógica de negocio pura.
    *   `src/application`: Para los casos de uso que orquestan el dominio.
    *   `src/infrastructure`: Para las implementaciones concretas (ej. acceso a base de datos).

*   **2 - Capa de Dominio (`domain`):** 
    Contiene los elementos más puros y centrales de la aplicación.

    *   **DTO (`domain/dtos/auth/register.user.dto.ts`):** Valida los datos de entrada.
        ```typescript
        import { regularExps } from '../../../config/index.js'

        export class RegisterUserDto {
          private constructor(
            public name: string,
            public email: string,
            public password: string,
          ) {}

          static create(object: { [key: string]: any }): [string?, RegisterUserDto?]{
            const { name, email, password } = object;
            if (!name) return ['Missing name'];
            if (!email) return ['Missing email'];
            if (!regularExps.email.test(email)) return ['Invalid email'];
            if (!password || password.length < 6) return ['Password must be at least 6 characters'];
            
            return [, new RegisterUserDto(name, email, password)];
          }
        }
        ```
    *   **Entidad (`domain/entities/user.entity.ts`):** Representa el modelo de negocio.
    *   **Repositorio (Contrato) (`domain/repositories/user.repository.ts`):** Define las operaciones que se deben poder hacer con los usuarios, sin especificar cómo se hacen.
        ```typescript
        import { RegisterUserDto } from '../dtos/auth/register.user.dto.js';
        import { UserEntity } from '../entities/user.entity.js';

        export abstract class UserRepository {
          abstract registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity>;
          abstract findByEmail(email: string): Promise<UserEntity | null>;
        }
        ```

*   **3 - Capa de Aplicación (`application`):** 
    Orquesta la lógica del dominio para cumplir con un caso de uso específico.

    *   **Caso de Uso (`application/use-cases/register-user.usecase.ts`):**
        ```typescript
        import { RegisterUserDto } from '../../domain/dtos/auth/register.user.dto.js';
        import { UserEntity } from '../../domain/entities/user.entity.js';
        import { UserRepository } from '../../domain/repositories/user.repository.js';
        import bcrypt from 'bcryptjs';

        export class RegisterUserUseCase {
          constructor(
            private readonly userRepository: UserRepository // Depende de la abstracción
          ) {}

          async execute(dto: RegisterUserDto): Promise<UserEntity> {
            const existingUser = await this.userRepository.findByEmail(dto.email);
            if (existingUser) {
              throw new Error('El correo electrónico ya está en uso.');
            }

            const salt = await bcrypt.genSalt(10);
            dto.password = await bcrypt.hash(dto.password, salt);

            const newUser = await this.userRepository.registerUser(dto);
            return newUser;
          }
        }
        ```

*   **4 - Capa de Infraestructura (`infrastructure`):** 
    Implementa los contratos definidos en el dominio, conectándose a herramientas externas como la base de datos.

    *   **Datasource (`infrastructure/datasources/prisma-user-datasource.ts`):** Implementa el `UserRepository` utilizando Prisma para interactuar con la base de datos PostgreSQL.
        ```typescript
        import { PrismaClient } from "../../generated/prisma/index.js";
        import { UserEntity } from "../../domain/entities/user.entity.js";
        import { UserRepository } from "../../domain/repositories/user.repository.js";
        import { RegisterUserDto } from "../../domain/dtos/auth/register.user.dto.js";

        const prisma = new PrismaClient();

        export class UserPrismaDatasource implements UserRepository {

          async findByEmail(email: string): Promise<UserEntity | null> {
            const user = await prisma.user.findUnique({ where: { email } });
            // ... mapeo a UserEntity ...
          }

          async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
            const { name, email, password } = registerUserDto;

            const newUser = await prisma.user.create({
              data: {
                name: name,
                email: email,
                passwordHash: password, // La contraseña ya viene hasheada
              }
            });
            // ... mapeo a UserEntity y retorno ...
          }
        }
        ```

#### **Flujo de Trabajo Completo (Continuación):**

6.  **`application/use-cases/register-user.usecase.ts`:** 
    *   El método `execute` recibe el DTO validado.
    *   Llama al método `findByEmail` del `userRepository` (la abstracción) para verificar si el email ya existe.
    *   Hashea la contraseña del DTO usando `bcrypt`.
    *   Llama al método `registerUser` del `userRepository`, pasándole el DTO con la contraseña ya hasheada.
7.  **Inyección de Dependencias:** En `presentation/routes/routes.ts`, se inyectó la implementación concreta (`UserPrismaDatasource`) al constructor del `RegisterUserUseCase`. Por lo tanto, cuando el caso de uso llama a `userRepository.registerUser`, en realidad está llamando al método `registerUser` de la clase `UserPrismaDatasource`.
8.  **`infrastructure/datasources/prisma-user-datasource.ts`:** 
    *   El método `registerUser` recibe los datos.
    *   Usa `prisma.user.create` para guardar el nuevo usuario en la base de datos PostgreSQL.
    *   Mapea el resultado de Prisma a una instancia de `UserEntity`.
9.  **Retorno:** La `UserEntity` viaja de vuelta a través del caso de uso hasta el controlador, que finalmente envía la respuesta HTTP 201 al cliente.
