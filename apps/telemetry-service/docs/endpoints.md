# Endpoints de la API

Este documento detalla los endpoints disponibles en la API de telemetría.

## Autenticación

### Registro de Usuario

- **Endpoint:** `POST /api/auth/register`
- **Descripción:** Registra un nuevo usuario en el sistema.
- **Flujo:**
  1. El cliente envía una petición `POST` con los datos del usuario en el cuerpo (body).
  2. El `AuthController` recibe la petición.
  3. Se valida la información de entrada utilizando `RegisterUserDto`.
     - Se comprueba que `name`, `email` y `password` no estén vacíos.
     - Se valida que el `email` tenga un formato válido.
     - Se asegura que la `password` tenga al menos 6 caracteres.
  4. Si la validación es exitosa, se ejecuta el caso de uso `RegisterUserUseCase`.
  5. El caso de uso se encarga de la lógica de negocio para crear el usuario (actualmente, guarda en la base de datos a través de `UserPrismaDatasource`).
  6. Si el usuario se crea correctamente, se devuelve un estado `201 Created` con un mensaje de éxito.
  7. En caso de error (ej. validación fallida, error en la base de datos), se devuelven los códigos de estado correspondientes (`400 Bad Request` o `500 Internal Server Error`) con un mensaje descriptivo.
- **Cuerpo de la Petición (Request Body):**

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Respuesta Exitosa (Success Response):**

  ```json
  {
    "message": "Usuario registrado correctamente"
  }
  ```

### Inicio de Sesión

- **Endpoint:** `POST /api/auth/login`
- **Descripción:** Autentica a un usuario y devuelve un token de acceso.
- **Estado:** **No implementado**
- **Flujo (propuesto):**
  1. El cliente envía `email` y `password`.
  2. El controlador valida las credenciales.
  3. Se genera un JSON Web Token (JWT) si las credenciales son correctas.
  4. Se devuelve el token al cliente.
- **Cuerpo de la Petición (Request Body):**

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

### Validar Email

- **Endpoint:** `GET /api/auth/validate-email/:token`
- **Descripción:** Valida el correo electrónico de un usuario a través de un token.
- **Estado:** **No implementado**
- **Flujo (propuesto):**
  1. El usuario hace clic en un enlace de validación enviado a su correo.
  2. La petición `GET` llega a este endpoint con el token en la URL.
  3. El controlador decodifica el token para identificar al usuario.
  4. Se actualiza el estado del usuario en la base de datos a "verificado".
  5. Se redirige al usuario a una página de confirmación.
