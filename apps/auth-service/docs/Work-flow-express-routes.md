# 🌊 Flujo de Funcionamiento de la API 

¡Bienvenido! Esta documentación explica el viaje que realiza una petición a través de nuestra API, desde que llega al servidor hasta que se devuelve una respuesta usando ***Clean Architecture & Clean Code*** ¡Vamos a sumergirnos!

## 🚀 1. El Punto de Partida: `server.ts`

Todo comienza aquí. `server.ts` es el corazón de nuestra aplicación, donde reside la clase `Server`.

### La Clase `Server`

Esta clase es la encargada de levantar y configurar nuestro servidor Express.

```typescript
// src/server.ts

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
    // Middlewares
    this.app.use(express.json()); 
    this.app.use(express.urlencoded({ extended: true })); 

    // Public folder
    this.app.use(express.static(this.publicPath));

    // Routes
    this.app.use(this.routes);
    
    // ... resto del código
```

El **constructor** es como el cerebro de la clase: recibe los argumentos del usuario (puerto, rutas, etc.) y los guarda en variables internas para que la clase pueda usarlos.

El método `start()` es donde la magia sucede. Monta las siguientes funciones en cascada:
1.  **Middlewares esenciales**: Preparan la petición.
2.  **Carpeta de contenido estático**: Define la carpeta `public`.
3.  **Rutas de la API**: Registra todos nuestros endpoints.
4.  **Listener del servidor**: Pone al servidor a escuchar en el puerto especificado.

---

## 🗺️ 2. El Director de Orquesta de Rutas: `main_routes.ts`

Este archivo centraliza y configura el enrutamiento principal de la aplicación usando la clase `AppRoutes`.

```typescript
// src/main_routes.ts

export class AppRoutes {
  static get routes(): Router {
    const router = Router();
    router.use('/api/auth', Authroutes.routes);
    return router;
  }
}
```

La función estática `get routes()` crea una instancia del enrutador de Express y le dice: "Oye, cualquier petición que empiece con `/api/auth` debe ser manejada por `Authroutes.routes`".

---

## 🚦 3. Las Rutas de Autenticación: `routes.ts`

Aquí definimos los endpoints específicos para la autenticación: `/login`, `/register`, etc. También es donde ocurre la **Inyección de Dependencias (DI)**.

```typescript
// src/presentation/routes/routes.ts

export class Authroutes {
  
  static get routes(): Router {
    const router = Router();
    
    // --- INYECCIÓN DE DEPENDENCIAS ---
    const userRepository = new UserPrismaDatasource();
    const registerUseCase = new RegisterUserUseCase(userRepository);
    const controller = new AuthController(registerUseCase);

    // --- DEFINICIÓN DE RUTAS ---
    router.post('/register', controller.registerUser);
    // ... otras rutas

    return router;
  }
}
```

1.  **`UserPrismaDatasource`**: La implementación concreta que habla con nuestra base de datos usando Prisma.
2.  **`RegisterUserUseCase`**: El "caso de uso" que contiene la lógica de negocio para registrar un usuario. Le "inyectamos" el `userRepository` para que sepa cómo hablar con la base de datos.
3.  **`AuthController`**: El controlador que orquesta todo. Recibe la petición y llama al caso de uso correspondiente.

---

## 👨‍⚖️ 4. El Controlador: `auth_controller.ts`

El `AuthController` es el gerente. Recibe los datos del usuario y se asegura de que todo el proceso se ejecute correctamente, devolviendo una respuesta al final.

```typescript
// src/presentation/controllers/auth_controller.ts

export class AuthController{
 
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
  ){}

  registerUser = async (req: Request, res: Response) => {
    const [err, registerUserDto] = RegisterUserDto.create(req.body);
    if (err) return res.status(400).json({ error: err });

    try {
      // Aquí se inicia la ejecución, y se espera el resultado final.
      const newUser = await this.registerUserUseCase.execute(registerUserDto!);
      return res.status(201).json({ 
        message: "Usuario registrado correctamente",
        user: newUser 
      });
    } catch (error: any) {
      // ... manejo de errores
    }
  };
}
```
Inicialmente, mientras se construye la estructura, los métodos pueden ser estáticos para pruebas. Una vez que todo está en su lugar, se usa un constructor para inyectar las dependencias (`RegisterUserUseCase`) y los métodos se vuelven asíncronos para esperar el resultado de todo el flujo.

---

## 🏛️ 5. La Arquitectura de los Datos

### `User.entity.ts` - El Esqueleto 💀

Define la estructura de un usuario en nuestra base de datos. Es el "cascarón" que asegura que los datos tengan el formato correcto.

```typescript
// src/domain/entities/user.entity.ts

export class UserEntity{
  constructor(
    public id: string,
    public email:string,
    public passwordHash:string,
    // ... otras propiedades
  ){}
}
```

### `register.user.dto.ts` - El Mensajero 📮

Un DTO (Data Transfer Object) define los datos que esperamos recibir del usuario. Es similar a una entidad, pero solo para los datos que viajan desde el cliente. Aquí también se realizan validaciones simples.

```typescript
// src/domain/dtos/auth/register.user.dto.ts

export class RegisterUserDto{
 private constructor(
    public name:string,
    public email:string,
    public password:string,
 ){}

 static create(object:{[key:string]:any}):[string?,RegisterUserDto?]{
  // ... validaciones
 }
}
```

### `user.repository.ts` - El Contrato 📜

Esta es una clase abstracta, un "contrato" que define QUÉ se puede hacer con los datos del usuario, pero no CÓMO. Es como el menú de un restaurante: te dice los platos, no la receta.

```typescript
// src/domain/repositories/user.repository.ts

export abstract class UserRepository{
  abstract registerUser(registerUserDto:RegisterUserDto):Promise<UserEntity>;
  abstract findByEmail(email: string): Promise<boolean>;
}
```

---

## 🧠 6. El Cerebro de la Operación: `register-user.usecase.ts`

Aquí vive la lógica de negocio pura. Este archivo no sabe (ni le importa) qué base de datos se está usando. Su única preocupación es orquestar los pasos para registrar un usuario.

1.  Recibe el DTO del controlador.
2.  **Delega la verificación**: Llama a `this.userRepository.findByEmail(dto.email)` para preguntar si el email ya existe. No sabe cómo se hace la búsqueda, solo confía en el contrato del repositorio.
3.  Hashea la contraseña.
4.  **Delega la creación**: Llama a `this.userRepository.registerUser(dto)` para que el repositorio se encargue de crear y guardar al usuario.

```typescript
// src/application/use-cases/register-user.usecase.ts

export class RegisterUserUseCase {

  constructor(
    private readonly userRepository: UserRepository
  ) {}

  async execute(dto: RegisterUserDto): Promise<UserEntity> {
    
    // ... Lógica de hasheo y validación ...

    // El caso de uso le pide al repositorio que guarde el usuario.
    // La magia sucede en la siguiente capa.
    const newUser = await this.userRepository.registerUser(dto);

    // Una vez que el datasource (a través del repositorio) termina,
    // devuelve el newUser creado, y este caso de uso lo retorna
    // hacia arriba, al AuthController.
    return newUser;
  }
}
```

Este archivo es el director de la orquesta. Le dice a los músicos (el repositorio) qué tocar, pero no cómo tocar sus instrumentos.

---

## 🛠️ 7. El Trabajo Pesado: `prisma-user-datasource.ts`

Esta es la implementación concreta, la "receta" que el repositorio no te mostró. **Trabaja en conjunto con el `RegisterUserUseCase`** para completar la tarea.

1.  **Recibe la orden**: Cuando el `RegisterUserUseCase` llama a `registerUser`, la llamada viaja a través de la abstracción del repositorio y aterriza aquí.
2.  **Ejecuta la acción**: Utiliza Prisma para hablar directamente con la base de datos y crear el registro del usuario.
3.  **Devuelve el resultado**: Crea una instancia de `UserEntity` con los datos del usuario recién guardado en la base de datos.
4.  **El Retorno**: Este `newUser` se devuelve al `RegisterUserUseCase`, que a su vez lo pasa hacia arriba al `AuthController`.

```typescript
// src/infrastructure/datasources/prisma-user-datasource.ts

export class UserPrismaDatasource implements UserRepository {
        
  async registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
    const { name, email, password } = registerUserDto;

    // 1. Aquí se ejecuta la consulta a la base de datos.
    const newUserFromDB = await prisma.user.create({
      data: { name, email, passwordHash: password }
    });

    // 2. Se crea la entidad que se devolverá.
    const userEntity = new UserEntity(/* ... */);

    // 3. Se retorna el resultado al `RegisterUserUseCase`.
    return userEntity;
  }
}
```

**Este es un baile perfectamente coordinado**:
- El **Caso de Uso** (`register-user.usecase.ts`) dirige la lógica de negocio.
- El **DataSource** (`prisma-user-datasource.ts`) ejecuta las operaciones de bajo nivel con la base de datos.

El `DataSource` completa su trabajo y devuelve el `newUser` al `UseCase`. El `UseCase` no modifica este resultado, simplemente lo recibe y lo devuelve al `AuthController`, completando así el flujo de la petición.

---

## ✅ 8. El Desenlace

Finalmente, en el `AuthController`, se llama a `this.registerUserUseCase.execute(registerUserDto)` para poner en marcha toda esta maquinaria. Si todo sale bien, el caso de uso devuelve el `newUser`, y el controlador responde al cliente con un mensaje de éxito y los datos del usuario creado.

¡Y ese es todo el flujo! 🎉 Un viaje bien estructurado que asegura que nuestro código sea mantenible, escalable y fácil de entender.
