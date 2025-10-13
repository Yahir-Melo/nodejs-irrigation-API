# Tareas Pendientes de la API de Autenticación

Esta es una lista de las mejoras de seguridad y funcionalidades importantes que se deben implementar para llevar la API a un nivel de producción.

### Mejoras de Seguridad Críticas

- [ ] **Implementar Refresh Tokens (Enfoque Universal):**
  - [ ] Modificar el endpoint de `login` para que devuelva `accessToken` (corta vida) y `refreshToken` (larga vida) en el cuerpo JSON.
  - [ ] Crear un endpoint `POST /api/auth/refresh-token` que acepte un `refreshToken` y devuelva un nuevo `accessToken`.
  - [ ] Almacenar los `refreshToken` en la base de datos para poder validarlos.

- [ ] **Implementar Rate Limiting:**
  - [ ] Añadir un middleware (ej. `express-rate-limit`) al endpoint de `login` para prevenir ataques de fuerza bruta.

- [ ] **Usar Manejo de Errores Genérico:**
  - [ ] Asegurarse de que el endpoint de `login` devuelva un único mensaje de error genérico (ej. "Credenciales inválidas") tanto para usuarios no encontrados como para contraseñas incorrectas.

- [ ] **Implementar Revocación de Tokens:**
  - [ ] Crear un endpoint `POST /api/auth/logout`.
  - [ ] Al recibir una petición en `logout`, invalidar el `refreshToken` en la base de datos (ej. poniéndolo a `null`) para que no pueda ser usado de nuevo.

### Funcionalidades Adicionales

- [ ] **Implementar Flujo de "Olvidé mi Contraseña":**
  - [ ] Crear un endpoint `POST /api/auth/forgot-password` que reciba un email.
  - [ ] Generar un token de un solo uso con tiempo de expiración corto.
  - [ ] Enviar el token por email al usuario.
  - [ ] Crear un endpoint `POST /api/auth/reset-password` que reciba el token y la nueva contraseña para completar el reseteo.
