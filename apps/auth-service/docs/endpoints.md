# Endpoints de la API

Este documento detalla los endpoints disponibles en el microservicio de Autenticación.


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
- **Flujo:**
  1. El cliente envía una petición `POST` con `email` y `password` en el cuerpo (body).
  2. El `AuthController` recibe la petición.
  3. Se valida la información de entrada utilizando `LoginUserDto`.
     - Se comprueba que `email` y `password` no estén vacíos.
     - Se valida que el `email` tenga un formato válido.
     - Se asegura que la `password` tenga al menos 6 caracteres.
     - El email se convierte a minúsculas.
  4. Si la validación es exitosa, se ejecuta el caso de uso `LoginUserUseCase`.
  5. El caso de uso verifica que el usuario exista en la base de datos.
  6. Se compara la contraseña proporcionada con la almacenada en la base de datos (usando bcrypt).
  7. Si las credenciales son correctas, se genera un JSON Web Token (JWT) con el id, email y rol del usuario.
  8. Se devuelve un estado `201 OK` con un mensaje de éxito y el token.
  9. En caso de error (ej. validación fallida, usuario no encontrado, contraseña incorrecta), se devuelven los códigos de estado correspondientes (`400 Bad Request` o `500 Internal Server Error`) con un mensaje descriptivo.
- **Cuerpo de la Petición (Request Body):**

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```

- **Respuesta Exitosa (Success Response):**

  ```json
  {
    "message": "Usuario verificado Token Generado",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNT..."
  }
  ```

### Validar Email

- **Endpoint:** `GET /api/auth/validate-email/:token`
- **Descripción:** Valida la cuenta de correo electrónico de un usuario utilizando un token único que se envía después del registro.
- **Flujo:**
  1. **Envío de Correo:** Tras un registro exitoso (`POST /api/auth/register`), el sistema genera un token de verificación y envía un correo electrónico al usuario con un enlace único.
  2. **Acción del Usuario:** El usuario hace clic en el enlace de validación en su correo.
  3. **Petición GET:** Se realiza una petición `GET` a este endpoint, incluyendo el token como parte de la URL (ej. `/api/auth/validate-email/xyz123abc`).
  4. **Controlador y Caso de Uso:**
     - El `AuthController` recibe la petición y extrae el token.
     - Invoca al caso de uso `ValidateEmailUseCase`, pasándole el token.
  5. **Lógica de Verificación:**
     - El caso de uso busca al usuario asociado al token de verificación.
     - Comprueba que el token sea válido y no haya expirado.
     - Verifica que el usuario no esté ya verificado.
     - Si todo es correcto, actualiza el estado del usuario en la base de datos a "verificado".
  6. **Respuesta:** El sistema responde con un mensaje indicando que el correo ha sido validado exitosamente. A partir de este momento, el usuario puede iniciar sesión.
- **Parámetros de la URL (URL Parameters):**

  - `token` (string, requerido): El token de verificación enviado al correo del usuario.

- **Respuesta Exitosa (Success Response):**

  - Se muestra una página HTML simple o se devuelve un JSON con un mensaje de éxito.
  ```json
  {
    "success": true,
    "message": "Correo electrónico validado correctamente."
  }
  ```
- **Consideración Adicional:**
  - El endpoint de `login` (`POST /api/auth/login`) ahora requiere que el correo del usuario esté verificado. Si un usuario no verificado intenta iniciar sesión, recibirá un error indicando que su correo no ha sido validado.

### Refrescar Token

- **Endpoint:** `POST /api/auth/refresh-token`
- **Descripción:** Obtiene un nuevo token de acceso (JWT) utilizando un token de refresco válido.
- **Flujo:**
  1. El cliente envía una petición `POST` con el `refreshToken` en el cuerpo (body).
  2. El `AuthController` recibe la petición.
  3. Se ejecuta el caso de uso `RefreshTokenUseCase`.
  4. El caso de uso verifica la validez del `refreshToken`.
  5. Si es válido, se genera un nuevo token de acceso y un nuevo token de refresco.
  6. Se invalida el `refreshToken` anterior y se guarda el nuevo.
  7. Se devuelve un estado `200 OK` con los nuevos tokens.
- **Cuerpo de la Petición (Request Body):**

  ```json
  {
    "refreshToken": "some-refresh-token"
  }
  ```

- **Respuesta Exitosa (Success Response):**

  ```json
  {
    "token": "new-access-token",
    "refreshToken": "new-refresh-token"
  }
  ```

### Cerrar Sesión

- **Endpoint:** `POST /api/auth/logout`
- **Descripción:** Cierra la sesión del usuario invalidando sus tokens de refresco.
- **Flujo:**
  1. El cliente envía una petición `POST` con un token de acceso válido en las cabeceras.
  2. Un middleware de autenticación verifica el token y extrae el `userId`.
  3. El `AuthController` recibe la petición.
  4. Se ejecuta el caso de uso `LogoutUserUseCase`.
  5. El caso de uso elimina todos los `RefreshToken` asociados al `userId`.
  6. Se devuelve un estado `200 OK` con un mensaje de éxito.
- **Respuesta Exitosa (Success Response):**

  ```json
  {
    "message": "Sesión cerrada correctamente"
  }
  ```

### Olvidé mi Contraseña

- **Endpoint:** `POST /api/auth/forgot-password`
- **Descripción:** Inicia el proceso de recuperación de contraseña.
- **Flujo:**
  1. El cliente envía una petición `POST` con el `email` del usuario en el cuerpo (body).
  2. El `AuthController` recibe la petición.
  3. Se ejecuta el caso de uso `ForgotPasswordUseCase`.
  4. El caso de uso genera un token de restablecimiento y lo guarda en la base de datos.
  5. Se envía un correo electrónico al usuario con un enlace para restablecer la contraseña.
  6. Se devuelve un estado `200 OK` con un mensaje de éxito.
- **Cuerpo de la Petición (Request Body):**

  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

- **Respuesta Exitosa (Success Response):**

  ```json
  {
    "message": "Correo de recuperación enviado"
  }
  ```

### Restablecer Contraseña

- **Endpoint:** `POST /api/auth/reset-password`
- **Descripción:** Restablece la contraseña del usuario.
- **Flujo:**
  1. El cliente envía una petición `POST` con el `token` de restablecimiento, la `newPassword` y la `confirmPassword` en el cuerpo (body).
  2. El `AuthController` recibe la petición.
  3. Se ejecuta el caso de uso `ResetPasswordUseCase`.
  4. El caso de uso valida el token, verifica que las contraseñas coincidan, hashea la nueva contraseña y actualiza la contraseña del usuario.
  5. Se devuelve un estado `200 OK` con un mensaje de éxito.
- **Cuerpo de la Petición (Request Body):**

  ```json
  {
    "token": "some-reset-token",
    "newPassword": "new-secure-password",
    "confirmPassword": "new-secure-password"
  }
  ```

- **Respuesta Exitosa (Success Response):**

  ```json
  {
    "message": "Contraseña restablecida correctamente"
  }
  ```

---

## Flujo General de Autenticación de Usuario

El siguiente diagrama describe el ciclo de vida completo de un usuario en el sistema, desde el registro hasta el inicio de sesión.

1.  **Registro de Nuevo Usuario:**
    - El usuario se registra a través del endpoint `POST /api/auth/register`.
    - El sistema crea una nueva cuenta de usuario pero la marca como "no verificada".

2.  **Envío de Correo de Verificación:**
    - Inmediatamente después del registro, el servidor envía un correo electrónico a la dirección proporcionada.
    - Este correo contiene un enlace único de verificación que incluye un token.

3.  **Verificación de Correo Electrónico:**
    - El usuario abre su correo y hace clic en el enlace de verificación.
    - Esta acción dirige al usuario al endpoint `GET /api/auth/validate-email/:token`.
    - El sistema valida el token y, si es correcto, marca la cuenta del usuario como "verificada".

4.  **Inicio de Sesión (Login):**
    - Con la cuenta ya verificada, el usuario puede iniciar sesión usando el endpoint `POST /api/auth/login`.
    - El sistema comprueba que el correo haya sido verificado antes de autenticar al usuario.
    - Si las credenciales son correctas y la cuenta está verificada, el servidor devuelve un token de acceso (JWT) y un token de refresco para que el cliente los use en peticiones posteriores.

5.  **Refrescar Sesión:**
    - Cuando el token de acceso expira, el cliente puede usar el token de refresco para obtener un nuevo par de tokens a través del endpoint `POST /api/auth/refresh-token`.

6.  **Cerrar Sesión:**
    - El usuario puede cerrar su sesión a través del endpoint `POST /api/auth/logout`, que invalida los tokens de refresco.

7.  **Recuperación de Contraseña:**
    - Si el usuario olvida su contraseña, puede solicitar un enlace de recuperación a través de `POST /api/auth/forgot-password`.
    - Luego, puede restablecer su contraseña utilizando el enlace recibido y el endpoint `POST /api/auth/reset-password`.
