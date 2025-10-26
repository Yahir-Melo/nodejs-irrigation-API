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

---

### **Fase 5: Implementación del Endpoint de Login**
$\small \text{ Fecha: 2025-OCT-09} $

Se implementa la funcionalidad de autenticación de usuarios, permitiendo a los usuarios iniciar sesión y obtener un token de acceso (JWT) para futuras peticiones.

*   **1 - Instalación de Dependencias para JWT:** 
    Se instalaron las librerías `jsonwebtoken` para la generación y firma de tokens, y `bcryptjs` para la comparación de contraseñas.
    ```bash
    npm install jsonwebtoken bcryptjs
    npm install -D @types/jsonwebtoken @types/bcryptjs
    ```

*   **2 - Creación del DTO de Login (`login.user.dto.ts`):** 
    Se creó un DTO específico para validar los datos de entrada del endpoint de login, asegurando que el `email` y la `password` cumplan con el formato y las reglas requeridas.

    **Ubicación:** `src/domain/dtos/auth/login.user.dto.ts`

*   **3 - Extensión del Repositorio de Usuario:** 
    Se actualizó el contrato `UserRepository` en el dominio para incluir dos nuevos métodos abstractos, necesarios para la lógica de login:
    *   `verifyUserPassword(password: string, email: string): Promise<boolean>`: Para comparar la contraseña proporcionada con la almacenada.
    *   `createTokenUser(loginUserDto: LoginUserDto): Promise<string>`: Para generar el token JWT si la autenticación es exitosa.

    **Ubicación:** `src/domain/repositories/user.repository.ts`

*   **4 - Implementación en el Datasource de Prisma:** 
    La clase `UserPrismaDatasource` implementó los nuevos métodos del repositorio:
    *   `verifyUserPassword`: Utiliza `bcrypt.compare` para verificar la contraseña de forma segura.
    *   `createTokenUser`: Busca al usuario, y si la contraseña es correcta, genera un token JWT firmado con una clave secreta (`JWT_SECRET`) y una expiración de 7 días.

    **Ubicación:** `src/infrastructure/datasources/prisma-user-datasource.ts`

*   **5 - Creación del Caso de Uso de Login (`login-user.usecase.ts`):** 
    Este caso de uso orquesta la lógica de negocio para el inicio de sesión:
    1.  Verifica que el usuario exista en la base de datos usando `userRepository.findByEmail`.
    2.  Compara las contraseñas usando `userRepository.verifyUserPassword`.
    3.  Si las credenciales son válidas, solicita la creación del token llamando a `userRepository.createTokenUser`.

    **Ubicación:** `src/application/use-cases/login-user.usecase.ts`

*   **6 - Actualización del Controlador y Rutas:** 
    *   Se inyectó el `LoginUserUseCase` en el `AuthController`.
    *   Se implementó el método `loginUser` en el controlador, que recibe la petición, la valida con `LoginUserDto`, ejecuta el caso de uso y devuelve el token en la respuesta.
    *   Se activó la ruta `POST /api/auth/login` en `presentation/routes/routes.ts`, asociándola con el método `loginUser` del controlador.

#### **Flujo de Trabajo de una Petición de Login:**

1.  **Llega una Petición:** Un cliente envía `email` y `password` a `POST /api/auth/login`.
2.  **Enrutamiento:** La petición sigue el mismo flujo de enrutamiento que el registro, llegando finalmente al `AuthController`.
3.  **Controlador (`loginUser`):**
    *   Valida los datos de entrada con `LoginUserDto`.
    *   Llama a `loginUserUseCase.execute()` con los datos validados.
4.  **Caso de Uso (`execute`):**
    *   Confirma que el email está registrado.
    *   Verifica que la contraseña sea correcta.
    *   Llama al repositorio para generar el token.
5.  **Datasource (`createTokenUser`):**
    *   Genera el token JWT con los datos del usuario (id, email, rol).
6.  **Respuesta:** El token viaja de vuelta a través de las capas hasta el controlador, que lo envía al cliente en una respuesta `200 OK`.

---

### **Fase 6: Verificación de Correo Electrónico**
$\small \text{ Fecha: 2025-OCT-12} $

Se implementa el flujo para que un usuario pueda verificar su cuenta de correo electrónico a través de un enlace único enviado a su email después del registro.

*   **1 - Creación de la Ruta de Verificación:** 
    Se define un nuevo endpoint `GET` que recibe un token como parámetro en la URL para validar al usuario.

    **Ubicación:** `src/presentation/routes/routes.ts`
    ```typescript
    router.get('/validate-email/:token', controller.validateEmail);
    ```

*   **2 - Creación del Caso de Uso (`validate-email.usecase.ts`):** 
    Este caso de uso contiene la lógica para validar el token y marcar el correo del usuario como verificado. No se necesita un DTO ya que el único dato de entrada es el token de la URL.

    **Ubicación:** `src/application/use-cases/validate-email.usecase.ts`
    ```typescript
    // Interfaces de entrada y salida
    export interface ValidateEmailUseCaseInput {
      token: string;
    }
    export interface ValidateEmailUseCaseOutput {
      success: boolean;
      message: string;
    }

    // Clase del caso de uso
    export class ValidateEmailUseCase {
      constructor(
        private readonly userRepository: UserRepository 
      ) {}

      async execute(input: ValidateEmailUseCaseInput): Promise<ValidateEmailUseCaseOutput> {
        // Lógica de validación...
      }
    }
    ```

*   **3 - Extensión del Repositorio de Usuario:** 
    Se añaden tres nuevos métodos abstractos al `UserRepository` para manejar la lógica de verificación.

    **Ubicación:** `src/domain/repositories/user.repository.ts`
    ```typescript
    abstract findVerificationToken(token:string):Promise<UserEntity | null>
    abstract verifyEmail(userId:string):Promise<UserEntity>
    abstract checkVerifyEmail(userId:string):Promise<boolean>
    ```

*   **4 - Implementación en el Datasource:** 
    La clase `UserPrismaDatasource` implementa los nuevos métodos para interactuar con la base de datos.
    *   `findVerificationToken`: Busca un usuario por su token de verificación.
    *   `verifyEmail`: Actualiza el estado del usuario a "verificado".
    *   `checkVerifyEmail`: Comprueba si el correo de un usuario ya ha sido verificado.

*   **5 - Integración con el Registro de Usuario (`register-user.usecase.ts`):** 
    Después de crear un nuevo usuario, se instancia un `EmailService` y se le instruye enviar un correo de verificación.

    **Ubicación:** `src/application/use-cases/register-user.usecase.ts`
    ```typescript
    // ... después de crear newUser
    const emailService = new EmailService();
    await emailService.sendEmailWithValidateAccount(newUser.email, verificationLink, newUser.name || '');
    ```

*   **6 - Servicio de Correo (`email.service.ts`):** 
    Se crea una clase `EmailService` dedicada a enviar correos. El método `sendEmailWithValidateAccount` construye y envía un email con un botón que contiene el enlace de verificación (`GET /api/auth/validate-email/:token`).

*   **7 - Validación en el Login (`login-user.usecase.ts`):** 
    Se añade una comprobación al inicio del flujo de login para asegurar que solo los usuarios con correo verificado puedan iniciar sesión.

    **Ubicación:** `src/application/use-cases/login-user.usecase.ts`
    ```typescript
    // Al inicio del método execute()
    const emailIsVerified = await this.userRepository.checkVerifyEmail(dto.email);
    if (!emailIsVerified) {  
      throw new Error('Correo electrónico no validado'); 
    }
    ```

#### **Flujo de Trabajo de Verificación de Correo:**

1.  **Registro:** Un usuario se registra (`POST /api/auth/register`).
2.  **Envío de Correo:** El `register-user.usecase.ts` llama al `EmailService` para enviar un correo al nuevo usuario. El correo contiene un enlace único (ej: `https://api.example.com/api/auth/validate-email/some-jwt-token`).
3.  **Click en el Enlace:** El usuario hace clic en el enlace de verificación.
4.  **Petición GET:** El navegador realiza una petición `GET` al endpoint `/api/auth/validate-email/:token`.
5.  **Controlador (`validateEmail`):** El `AuthController` recibe la petición y extrae el token.
6.  **Caso de Uso (`execute`):** El controlador invoca al `validate-email.usecase.ts`.
    *   El caso de uso utiliza `userRepository.findVerificationToken` para encontrar al usuario asociado al token.
    *   Verifica que el token no haya expirado y que el usuario no esté ya verificado.
    *   Llama a `userRepository.verifyEmail` para actualizar el estado del usuario en la base de datos.
7.  **Respuesta:** El servidor responde con un mensaje de éxito, y el usuario ya puede iniciar sesión.
8.  **Intento de Login:** Cuando el usuario intenta iniciar sesión, el `login-user.usecase.ts` primero comprueba con `checkVerifyEmail` si su cuenta está verificada antes de proceder.

---

### **Fase 7: Mejoras de Seguridad - Rate Limiting**
$\small \text{ Fecha: 2025-OCT-13} $

Para proteger la API contra ataques de fuerza bruta y abuso, se implementó un mecanismo de limitación de peticiones (rate limiting) en los endpoints más sensibles.

*   **1 - Instalación de Dependencias:** 
    Se instaló la librería `express-rate-limit` y sus tipos de TypeScript.
    ```bash
    # 1. Instala la librería principal
    npm install express-rate-limit

    # 2. Instala los tipos como una dependencia de desarrollo
    npm install --save-dev @types/express-rate-limit
    ```

*   **2 - Creación del Middleware de Rate Limiting:** 
    Se creó un archivo dedicado para configurar las reglas de limitación. Se definieron dos limitadores: uno más estricto para el login y otro más flexible para el registro.

    **Ubicación:** `src/presentation/middlewares/rateLimiter.ts`
    ```typescript
    import rateLimit from 'express-rate-limit';

    // Middleware para la ruta de Login: Más estricto para prevenir fuerza bruta.
    export const loginLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos
        max: 5, // Límite de 5 peticiones por IP durante la ventana de tiempo
        message: {
            status: 429,
            message: 'Demasiados intentos de inicio de sesión desde esta IP. Por favor, inténtelo de nuevo después de 15 minutos.'
        },
        standardHeaders: true, // Devuelve información del límite en las cabeceras `RateLimit-*`
        legacyHeaders: false, // Deshabilita las cabeceras `X-RateLimit-*` (obsoleto)
    });

    // Middleware para la ruta de Registro: Un poco más flexible.
    export const registerLimiter = rateLimit({
        windowMs: 60 * 60 * 1000, // Ventana de tiempo de 1 hora
        max: 10, // Límite de 10 peticiones por IP
        message: {
            status: 429,
            message: 'Demasiadas cuentas creadas desde esta IP. Por favor, inténtelo de nuevo después de una hora.'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });
    ```

*   **3 - Aplicación del Middleware en las Rutas:** 
    Se importaron y aplicaron los middlewares en el archivo de rutas, colocándolos antes de los métodos del controlador para proteger los endpoints correspondientes.

    **Ubicación:** `src/presentation/routes/routes.ts`
    ```typescript
    // ... otras importaciones
    import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter.js';

    // ...
    
    // Se aplican los middlewares a las rutas específicas
    router.post('/register', registerLimiter, controller.registerUser);
    router.post('/login', loginLimiter, controller.loginUser);
    
    // ...
    ```

#### **Flujo de Trabajo del Rate Limiter:**

1.  **Llega una Petición:** Un cliente envía una petición `POST` a `/api/auth/login` o `/api/auth/register`.
2.  **Middleware Actúa:** Antes de que la petición llegue al controlador, `express-rate-limit` la intercepta.
3.  **Verificación:** El middleware comprueba cuántas peticiones ha realizado esa dirección IP en la ventana de tiempo definida.
4.  **Decisión:**
    *   **Si se excede el límite:** El middleware bloquea la petición y responde directamente con un error `429 Too Many Requests`. El código del controlador nunca se ejecuta.
    *   **Si no se excede el límite:** El middleware permite que la petición continúe su flujo normal hacia el controlador.

---

### **Fase 8: Refactorización y Depuración del Flujo de Registro**
$\small \text{ Fecha: 2025-OCT-15} $

Durante las pruebas del flujo de registro, se encontraron una serie de errores en cascada que revelaron debilidades en la implementación inicial. Esta fase documenta la depuración y refactorización realizadas para robustecer el sistema y alinearlo más estrictamente con los principios de Arquitectura Limpia.

*   **1 - Refactorización de la Capa de Dominio (`UserEntity`):**
    *   **Problema:** La entidad de usuario (`UserEntity`) requería un `id` de tipo `string` en su constructor. Esto era incorrecto para usuarios nuevos que aún no han sido persistidos en la base de datos y, por lo tanto, no tienen un ID.
    *   **Solución:** Se modificó la firma del constructor para que la propiedad `id` sea de tipo `string | undefined`. Esto permite representar de forma más precisa el estado de una entidad que aún no ha sido guardada.
        ```typescript
        // Antes
        constructor(public id: string, ...)

        // Después
        constructor(public id: string | undefined, ...)
        ```

*   **2 - Refactorización Profunda de la Capa de Infraestructura (`UserPrismaDatasource`):**
    Esta fue la capa que requirió los cambios más significativos para corregir errores y mejorar su robustez.
    *   **a) Reemplazo de `upsert` por `create`/`update`:**
        *   **Problema:** La lógica inicial usaba `prisma.user.upsert` para manejar tanto la creación como la actualización de usuarios. Esto causaba un error crítico al intentar crear un usuario nuevo, ya que se pasaba un `id` vacío (`''`), lo que corrompía el registro en la base de datos.
        *   **Solución:** Se reemplazó `upsert` por una lógica condicional explícita. Si la `UserEntity` no tiene `id`, se usa `prisma.user.create`. Si tiene `id`, se usa `prisma.user.update`. Esto asegura que la base de datos genere los IDs correctamente.
    *   **b) Mapeo de `Role` (Dominio a Prisma):**
        *   **Problema:** La `UserEntity` del dominio utiliza un `enum` numérico para `Role` (ej. `Role.USER` es `0`), mientras que Prisma espera un `enum` de tipo `string` (ej. `'USER'`). Esto causaba un error de tipos al intentar guardar los datos.
        *   **Solución:** Se implementó un mapeo explícito en el método `save` para convertir el rol del dominio al tipo que Prisma espera antes de enviarlo a la base de datos.
            ```typescript
            const data = {
              // ...
              role: user.role === DomainRole.ADMIN ? PrismaRole.ADMIN : PrismaRole.USER,
              // ...
            };
            ```
    *   **c) Manejo de Propiedades Opcionales (`exactOptionalPropertyTypes`):**
        *   **Problema:** Al tener la opción `exactOptionalPropertyTypes` activa en `tsconfig.json`, pasar propiedades con valor `undefined` (como `name` si es opcional) a los métodos de Prisma causa un error de tipos.
        *   **Solución:** Se utilizó el truco `JSON.parse(JSON.stringify(data))` para crear una copia del objeto de datos que elimina automáticamente cualquier propiedad cuyo valor sea `undefined`, asegurando la compatibilidad con Prisma.

*   **3 - Correcciones en la Capa de Aplicación (`RegisterUserUseCase`):**
    *   **Problema:** Se detectó un bug donde los argumentos `name` y `updatedAt` se pasaban en el orden incorrecto al constructor de `UserEntity`.
    *   **Solución:** Se corrigió el orden de los argumentos, asegurando que el `name` del DTO se asigne a la propiedad `name` de la entidad y no a `updatedAt`.
        ```typescript
        // Antes
        new UserEntity(..., false, dto.name, new Date(), ...)
        // Después
        new UserEntity(..., false, new Date(), dto.name, ...)
        ```

*   **4 - Corrección de Inyección de Dependencias (Capa de Presentación):**
    *   **Problema:** El constructor de `RegisterUserUseCase` requiere dos dependencias: `UserRepository` y `EmailService`. En `presentation/routes/routes.ts`, solo se estaba inyectando la primera.
    *   **Solución:** Se instanció `EmailService` en el archivo de rutas y se inyectó correctamente en el constructor del caso de uso, completando sus dependencias.

#### **Flujo de Trabajo de Depuración y Solución:**

El proceso de depuración reveló una cadena de errores interconectados, donde la solución de uno destapaba el siguiente. Este es un resumen del flujo:

1.  **Error Inicial de Tipos (`Role`):** Un error de tipos entre el `Role` del dominio y el de Prisma llevó a revisar las dependencias.
2.  **Error de Inyección de Dependencias:** Se descubrió que `EmailService` no estaba siendo inyectado en `RegisterUserUseCase`.
3.  **Error en Tiempo de Ejecución (`El ID es requerido`):** Una vez corregido lo anterior, la API arrojaba un error al intentar leer un usuario recién creado. La causa raíz era el uso incorrecto de `upsert`, que generaba registros corruptos en la base de datos sin un ID válido.
4.  **Error de `Unique constraint`:** Tras refactorizar `save` para usar `create`/`update`, la aplicación fallaba al intentar registrar un usuario cuyo email ya existía en un registro corrupto. Esto se solucionó robusteciendo `findByEmail` para que, en lugar de fallar silenciosamente, lanzara un error de servidor (`500 Internal Server Error`), indicando un problema de integridad de datos.
5.  **Error de Datos en la Respuesta (`name` era una fecha):** Finalmente, con el flujo de registro funcionando, se detectó que la respuesta devolvía una fecha en lugar del nombre del usuario. La causa era un simple error de orden en los argumentos pasados al constructor de `UserEntity`.

Este proceso iterativo de depuración y refactorización ha fortalecido significativamente la robustez y fiabilidad del servicio de autenticación, asegurando que cada capa cumpla correctamente con sus responsabilidades.

---

### **Fase 9: Implementación de Refresh Token**
$\small \text{ Fecha: 2025-OCT-17} $

Se añade la capacidad de refrescar tokens de acceso (JWT) para mejorar la seguridad y la experiencia de usuario, evitando que los usuarios tengan que iniciar sesión repetidamente.

*   **1 - Modificación del Esquema de Prisma:** 
    Se añadió un modelo `RefreshToken` en `prisma/schema.prisma` para almacenar los tokens de refresco de forma persistente. Cada token está vinculado a un `User`.
    ```prisma
    model RefreshToken {
      id        String   @id @default(cuid())
      token     String   @unique
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
      userId    String
      user      User     @relation(fields: [userId], references: [id])
    }
    ```
    Posteriormente, se aplicó la migración a la base de datos con `npx prisma migrate dev`.

*   **2 - Extensión de la Entidad de Usuario:** 
    Se actualizó la `UserEntity` en el dominio para incluir una propiedad opcional `refreshTokens` de tipo `RefreshToken[]`, permitiendo que la entidad maneje la relación con los tokens de refresco.

*   **3 - Variables de Entorno para JWT:** 
    Se añadieron `JWT_REFRESH_SECRET` al archivo `.env` y se configuraron en el plugin de `envs` para tener claves separadas para los tokens de acceso y los de refresco, una práctica de seguridad recomendada.

*   **4 - Creación del Caso de Uso (`refresh-token.usecase.ts`):** 
    Este caso de uso orquesta la lógica para refrescar un token:
    1.  Recibe un token de refresco como entrada.
    2.  Verifica la validez del token usando `JWT_REFRESH_SECRET`.
    3.  Busca el token en la base de datos para asegurarse de que no ha sido revocado.
    4.  Si es válido, genera un nuevo token de acceso (JWT) y un nuevo token de refresco.
    5.  Invalida el token de refresco antiguo y guarda el nuevo.

*   **5 - Actualización del Repositorio y Datasource:** 
    Se extendió el `UserRepository` y su implementación `UserPrismaDatasource` para incluir métodos que manejen la creación, búsqueda y eliminación de tokens de refresco en la base de datos.

*   **6 - Creación de la Ruta de Refresh Token:** 
    Se añadió un nuevo endpoint `POST /api/auth/refresh-token` en `presentation/routes/auth_routes.ts`. Este endpoint está protegido y espera un token de refresco en el cuerpo de la petición.

#### **Flujo de Trabajo de Refresh Token:**

1.  **Login Exitoso:** Cuando un usuario inicia sesión, además del token de acceso, recibe un token de refresco.
2.  **Token de Acceso Expira:** El cliente intenta hacer una petición a un recurso protegido con un token de acceso expirado.
3.  **Petición de Refresh:** El cliente envía su token de refresco al endpoint `POST /api/auth/refresh-token`.
4.  **Validación:** El `refresh-token.usecase.ts` valida el token de refresco.
5.  **Generación de Nuevos Tokens:** Si la validación es exitosa, el servidor genera un nuevo token de acceso y un nuevo token de refresco.
6.  **Respuesta:** El servidor devuelve los nuevos tokens al cliente, que puede entonces reintentar la petición original con el nuevo token de acceso.

---

### **Fase 10: Implementación de Recuperación de Contraseña**
$\small \text{ Fecha: 2025-OCT-22} $

Se implementa el flujo completo para que los usuarios puedan solicitar un restablecimiento de contraseña si la han olvidado.

*   **1 - Modificación del Esquema de Prisma:** 
    Se añadieron campos opcionales al modelo `User` para gestionar el proceso de recuperación:
    *   `passwordResetToken`: Almacena un token único para el restablecimiento.
    *   `passwordResetExpires`: Define la fecha de expiración de dicho token.
    ```prisma
    model User {
      // ...
      passwordResetToken   String?
      passwordResetExpires DateTime?
    }
    ```
    Se aplicó la migración con `npx prisma migrate dev`.

*   **2 - Creación de Casos de Uso:** 
    Se crearon dos casos de uso para separar las responsabilidades del flujo:
    *   **`forgot-password.usecase.ts`:**
        1.  Recibe el email del usuario.
        2.  Genera un token de restablecimiento único y su fecha de expiración.
        3.  Guarda el token y la fecha en el registro del usuario en la base de datos.
        4.  Utiliza `EmailService` para enviar un correo al usuario con un enlace para restablecer la contraseña.
    *   **`reset-password.usecase.ts`:**
        1.  Recibe el token de restablecimiento, la nueva contraseña y su confirmación.
        2.  Valida que el token exista y no haya expirado.
        3.  Verifica que las contraseñas coincidan.
        4.  Hashea la nueva contraseña.
        5.  Actualiza la contraseña del usuario y limpia los campos `passwordResetToken` y `passwordResetExpires`.

*   **3 - Creación de las Rutas:** 
    Se añadieron dos nuevos endpoints en `presentation/routes/auth_routes.ts`:
    *   `POST /api/auth/forgot-password`: Para que el usuario solicite el correo de restablecimiento.
    *   `POST /api/auth/reset-password`: Para que el usuario envíe su nueva contraseña junto con el token.

*   **4 - Creación de Páginas HTML:** 
    Se crearon dos archivos HTML simples en la carpeta `public/` para dar feedback visual al usuario:
    *   `reset-password.html`: Un formulario donde el usuario puede introducir su nueva contraseña.
    *   `validation-success.html`: Una página que confirma que la contraseña ha sido cambiada con éxito.

#### **Flujo de Trabajo de Recuperación de Contraseña:**

1.  **Solicitud:** El usuario introduce su email en la página de "olvidé mi contraseña" y envía una petición a `POST /api/auth/forgot-password`.
2.  **Envío de Correo:** El `forgot-password.usecase.ts` genera un token, lo guarda y envía un correo al usuario con un enlace (ej: `https://api.example.com/api/auth/reset-password?token=some-token`).
3.  **Formulario de Restablecimiento:** El usuario hace clic en el enlace y es dirigido a `reset-password.html`, que contiene un formulario para la nueva contraseña.
4.  **Envío de Nueva Contraseña:** El usuario envía el formulario, realizando una petición `POST` a `/api/auth/reset-password` con el token y la nueva contraseña.
5.  **Validación y Actualización:** El `reset-password.usecase.ts` valida el token, hashea la nueva contraseña y actualiza el registro del usuario.
6.  **Confirmación:** Si todo es correcto, el servidor redirige al usuario a `validation-success.html`.

---

### **Fase 11: Implementación de Logout**
$\small \text{ Fecha: 2025-OCT-23} $

Se implementa la funcionalidad de cierre de sesión, invalidando el token de refresco del usuario para asegurar que no pueda ser reutilizado.

*   **1 - Creación del Caso de Uso (`logout-user.usecase.ts`):** 
    Este caso de uso se encarga de la lógica de cierre de sesión:
    1.  Recibe el ID del usuario (extraído del token de acceso en un middleware previo).
    2.  Llama al `UserRepository` para eliminar todos los `RefreshToken` asociados a ese ID de usuario.

*   **2 - Extensión del Repositorio y Datasource:** 
    Se añadió un método `deleteRefreshTokensByUserId(userId: string)` al `UserRepository` y su correspondiente implementación en `UserPrismaDatasource`, que utiliza `prisma.refreshToken.deleteMany()` para borrar los tokens.

*   **3 - Creación de la Ruta de Logout:** 
    Se añadió un endpoint `POST /api/auth/logout` en `presentation/routes/auth_routes.ts`. Esta ruta está protegida por un middleware de autenticación que verifica el token de acceso y extrae el ID del usuario.

#### **Flujo de Trabajo de Logout:**

1.  **Petición de Logout:** El cliente envía una petición `POST` a `/api/auth/logout` con un token de acceso válido en las cabeceras.
2.  **Autenticación:** Un middleware verifica el token de acceso y extrae el `userId`.
3.  **Caso de Uso:** El `logout-user.usecase.ts` es invocado con el `userId`.
4.  **Invalidación de Tokens:** El caso de uso instruye al `UserRepository` que elimine todos los tokens de refresco para ese usuario.
5.  **Respuesta:** El servidor responde con un mensaje de éxito, confirmando que la sesión ha sido cerrada. El token de acceso actual seguirá siendo válido hasta que expire, pero el usuario no podrá obtener uno nuevo sin volver a iniciar sesión.
