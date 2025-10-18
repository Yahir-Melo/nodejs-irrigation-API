# Tareas y Evolución de la API de Autenticación

Este documento describe tanto las funcionalidades ya implementadas como las tareas pendientes para convertir esta API en un servicio de autenticación robusto, seguro y listo para producción.

---

### ✅ Funcionalidades Implementadas

- **Arquitectura Limpia (Clean Architecture):**
  - [x] **Separación de Capas:** El código está organizado en `domain`, `application`, `infrastructure` y `presentation`, promoviendo un bajo acoplamiento y alta cohesión.
  - [x] **Inyección de Dependencias:** Se utiliza inyección manual para desacoplar los casos de uso de la base de datos y los controladores de los casos de uso.

- **Endpoints Fundamentales:**
  - [x] **`POST /api/auth/register`:** Registro de nuevos usuarios.
  - [x] **`POST /api/auth/login`:** Inicio de sesión y generación de token.
  - [x] **`GET /api/auth/validate-email/:token`:** Validación de la cuenta de correo electrónico.

- **Gestión de Datos y Seguridad Básica:**
  - [x] **ORM con Prisma:** Se utiliza Prisma para la interacción con la base de datos PostgreSQL.
  - [x] **Hashing de Contraseñas:** Se usa `bcrypt.js` para almacenar las contraseñas de forma segura.
  - [x] **Tokens JWT:** Se generan JSON Web Tokens para gestionar las sesiones de usuario.
  - [x] **Validación con DTOs:** Se emplean Data Transfer Objects para validar y tipar la información de entrada.
  - [x] **Manejo de Errores Personalizado:** Se implementa una clase `CustomError` y un manejador centralizado en el controlador.
  - [x] **Servicio de Email:** Configuración de `Nodemailer` para el envío de correos de validación.

---

### 🚀 Mejoras de Seguridad y Producción (Tareas Pendientes)

#### Mejoras de Seguridad Críticas

- [x] **Implementar Refresh Tokens:**
  - [x] Modificar el `login` para devolver un `accessToken` (corta vida) y un `refreshToken` (larga vida) almacenado en una cookie `httpOnly`.
  - [x] Crear un endpoint `POST /api/auth/refresh` que valide el `refreshToken` y emita un nuevo `accessToken`.
  - [x] Almacenar los `refreshToken` activos en la base de datos para permitir su invalidación.

- [ ] **Implementar Revocación de Tokens (Logout):**
  - [ ] Crear un endpoint `POST /api/auth/logout`.
  - [ ] Al recibir la petición, invalidar el `refreshToken` en la base de datos para que no pueda ser reutilizado.

- [x] **Añadir Rate Limiting:**
  - [x] Implementar `express-rate-limit` en los endpoints más sensibles (`login`, `register`, `forgot-password`) para prevenir ataques de fuerza bruta.

- [ ] **Configurar CORS (Cross-Origin Resource Sharing):**
  - [ ] Añadir el middleware `cors` y configurarlo para permitir peticiones solo desde los dominios del frontend autorizados.

- [ ] **Añadir Cabeceras de Seguridad:**
  - [ ] Utilizar `helmet` para configurar cabeceras HTTP de seguridad (`X-Content-Type-Options`, `Strict-Transport-Security`, etc.) y prevenir ataques comunes (XSS, clickjacking).

#### Funcionalidades Adicionales

- [ ] **Implementar Flujo de "Olvidé mi Contraseña":**
  - [ ] Crear endpoint `POST /api/auth/forgot-password` que reciba un email.
  - [ ] Generar un token de reseteo (un solo uso, corta expiración) y enviarlo por email.
  - [ ] Crear endpoint `POST /api/auth/reset-password` que reciba el token y la nueva contraseña.

- [ ] **Implementar Autenticación de Dos Factores (2FA):**
  - [ ] Permitir al usuario habilitar 2FA (ej. con Google Authenticator).
  - [ ] Modificar el flujo de login para solicitar un código de un solo uso (OTP) si 2FA está activado.

#### Mejoras para Entorno de Producción

- [ ] **Establecer un Sistema de Logging Robusto:**
  - [ ] Reemplazar `console.log` por una librería de logging como `Winston` o `Pino` para registrar eventos y errores en archivos o servicios externos.

- [ ] **Crear un Conjunto de Pruebas (Testing):**
  - [ ] Implementar pruebas unitarias para los casos de uso y pruebas de integración para los endpoints.

- [ ] **Contenerización con Docker:**
  - [ ] Crear un `Dockerfile` para construir una imagen de la aplicación y un `docker-compose.yml` para orquestar el servicio junto a la base de datos.