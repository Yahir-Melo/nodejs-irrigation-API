# Primeros Pasos

Esta guía explica la estructura del proyecto y cómo empezar a trabajar con el código.

## Arquitectura Limpia (Clean Architecture)

El proyecto sigue los principios de la Arquitectura Limpia para separar las responsabilidades y mantener el código desacoplado, testeable y fácil de mantener. Las capas principales son:

- **Domain:** Contiene la lógica de negocio más pura y las reglas del dominio. No depende de ninguna otra capa.
- **Application:** Orquesta los flujos de datos y ejecuta los casos de uso. Depende solo de la capa de Dominio.
- **Infrastructure:** Implementa los detalles técnicos como el acceso a la base de datos o la comunicación con servicios externos. Depende de la capa de Dominio.
- **Presentation:** Es la capa más externa, responsable de la interacción con el usuario (en este caso, la API REST). Depende de la capa de Aplicación.

## Estructura de Carpetas

A continuación se describe la estructura de carpetas y el propósito de cada una:

```
src/
├── application/         # Casos de Uso (Use Cases)
│   └── use-cases/
│       ├── login-user.usecase.ts
│       └── register-user.usecase.ts
├── config/              # Configuración de la aplicación
├── domain/              # Lógica de negocio y entidades
│   ├── dtos/            # Data Transfer Objects para validación
│   │   └── auth/
│   │       ├── login.user.dto.ts
│   │       └── register.user.dto.ts
│   ├── entities/        # Entidades del dominio
│   ├── errors/          # Errores personalizados
│   └── repositories/    # Contratos de los repositorios
├── infrastructure/      # Implementación de la infraestructura
│   └── datasources/     # Orígenes de datos (ej. Prisma)
└── presentation/        # API REST (Express)
    ├── controllers/     # Controladores de las rutas
    ├── middlewares/     # Middlewares de Express
    └── routes/          # Definición de las rutas
```

### Archivos Relevantes del Endpoint de Login

- **`src/domain/dtos/auth/login.user.dto.ts`**: Define la estructura y las reglas de validación para los datos de entrada del login (`email`, `password`).

- **`src/application/use-cases/login-user.usecase.ts`**: Orquesta el flujo de login. Valida que el usuario exista, compara las contraseñas y, si todo es correcto, solicita la creación de un token.

- **`src/domain/repositories/user.repository.ts`**: Contrato que define los métodos que debe implementar un repositorio de usuarios, como `findByEmail`, `verifyUserPassword` y `createTokenUser`.

- **`src/infrastructure/datasources/prisma-user-datasource.ts`**: Implementación concreta del `UserRepository` utilizando Prisma para interactuar con la base de datos.

- **`src/presentation/controllers/auth_controller.ts`**: Contiene el método `loginUser` que recibe la petición HTTP, utiliza el `LoginUserUseCase` para procesar la lógica y envía la respuesta al cliente.

- **`src/presentation/routes/routes.ts`**: Define la ruta `POST /api/auth/login` y la asocia con el método `loginUser` del `AuthController`.
