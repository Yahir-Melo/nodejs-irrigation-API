# 🔐 Microservicio de Autenticación

![Versión](https://img.shields.io/badge/version-0.0.1-blue.svg) ![Licencia](https://img.shields.io/badge/license-ISC-green.svg)

Este proyecto es un **microservicio de autenticación** para la aplicación móvil del **Sistema de Riego**, desarrollada en `***Flutter***`. Su única responsabilidad es gestionar el registro, inicio de sesión y validación de usuarios de forma segura y eficiente.

---

## ✨ Características Principales

*   **✅ Gestión de Usuarios:** Endpoints dedicados para el registro (`/register`) e inicio de sesión (`/login`).
*   **✉️ Validación de Email:** Flujo incorporado para verificar la autenticidad del correo electrónico de los nuevos usuarios.
*   **🔧 Arquitectura de Microservicio:** Diseñado como un componente independiente y escalable dentro del ecosistema del Sistema de Riego.
*   **🛠️ Base Tecnológica Moderna:** Construido con `***TypeScript***`, `***Express***` y `***Prisma***` para un rendimiento robusto y seguro.

## 🛠️ Tecnologías Utilizadas

| Categoría         | Tecnología                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Backend**       | `***Node.js***`, `***Express***`                                                                            |
| **Lenguaje**      | `***TypeScript***`                                                                                          |
| **Base de Datos** | `***PostgreSQL***`                                                                                          |
| **ORM**           | `***Prisma***`                                                                                              |
| **Entorno**       | `***dotenv***` para variables de entorno, `***Nodemon***` para el desarrollo.                                 |

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno local.

### 1. Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   [Node.js](https://nodejs.org/) (versión 18.x o superior)
*   [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)
*   Una instancia de [PostgreSQL](https://www.postgresql.org/download/) corriendo.

### 2. Clonar el Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd telemetry-service
```

### 3. Instalar Dependencias

Este comando instalará todas las librerías y paquetes necesarios para el proyecto.

```bash
npm install
```

### 4. Configurar Variables de Entorno

Necesitas crear un archivo `.env` para almacenar las credenciales de la base de datos y otras variables.

1.  Copia el archivo de plantilla:

    ```bash
    cp .env.template .env
    ```

2.  Abre el nuevo archivo `.env` y modifica la variable `DATABASE_URL` con tu cadena de conexión de PostgreSQL. Debe seguir este formato:

    ```
    DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_DB"
    ```

### 5. Aplicar las Migraciones de la Base de Datos

Este comando leerá tu `schema.prisma` y creará las tablas necesarias en la base de datos que configuraste en el paso anterior.

```bash
npx prisma migrate dev
```

> **Nota:** Si haces cambios en el `schema.prisma` en el futuro, deberás ejecutar este comando de nuevo para aplicar esos cambios a la base de datos.

### 6. ¡Ejecutar la Aplicación!

¡Ya está todo listo! Ahora puedes iniciar el servidor.

| Modo                | Comando         | Descripción                                                                        |
| ------------------- | --------------- | ---------------------------------------------------------------------------------- |
| **🏠 Desarrollo**   | `npm run dev`   | Inicia el servidor con **Nodemon**, que se reiniciará automáticamente con cada cambio. |
| **🚢 Producción**  | `npm run start` | Primero compila el código a JavaScript (`build`) y luego ejecuta la versión optimizada. |


## 🚀 Uso de la API

Una vez que la aplicación esté corriendo, puedes interactuar con la API utilizando herramientas como Postman, Insomnia o `curl`.

### 1. Registrar un Usuario

**Endpoint:** `POST /api/auth/register`
**Body (JSON):**
```json
{
  "name": "Tu Nombre",
  "email": "tu_email@example.com",
  "password": "tu_contraseña_segura"
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "user": {
    "id": "...",
    "name": "Tu Nombre",
    "email": "tu_email@example.com",
    "emailValidated": false,
    "role": "USER"
  },
  "message": "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico."
}
```

### 2. Iniciar Sesión

**Endpoint:** `POST /api/auth/login`
**Body (JSON):**
```json
{
  "email": "tu_email@example.com",
  "password": "tu_contraseña_segura"
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "user": {
    "id": "...",
    "name": "Tu Nombre",
    "email": "tu_email@example.com",
    "emailValidated": true,
    "role": "USER"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### 3. Refrescar Token de Acceso

**Endpoint:** `POST /api/auth/refresh-token`
**Body (JSON):**
```json
{
  "refreshToken": "eyJ..."
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

### 4. Validar Email

Este endpoint se accede a través de un enlace enviado al correo electrónico del usuario después del registro.

**Endpoint:** `GET /api/auth/validate-email/:token`
(El `:token` será proporcionado en el enlace del correo electrónico.)

**Respuesta Exitosa (Redirección):**
Redirige a `/validation-success.html` en el frontend.

### 5. Olvidé mi Contraseña

**Endpoint:** `POST /api/auth/forgot-password`
**Body (JSON):**
```json
{
  "email": "tu_email@example.com"
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Si el email existe, se ha enviado un enlace para restablecer la contraseña."
}
```

### 6. Restablecer Contraseña

**Endpoint:** `POST /api/auth/reset-password`
**Body (JSON):**
```json
{
  "token": "el_token_recibido_por_email",
  "newPassword": "tu_nueva_contraseña_segura"
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Contraseña restablecida exitosamente."
}
```

### 7. Cerrar Sesión (Logout)

**Endpoint:** `POST /api/auth/logout`
**Body (JSON):**
```json
{
  "refreshToken": "eyJ..."
}
```
**Respuesta Exitosa (200 OK):**
```json
{
  "message": "Logout exitoso"
}
```

## 📜 Scripts Disponibles en `package.json`

| Script        | Acción                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Ejecuta la aplicación en modo desarrollo usando `ts-node` y `nodemon`.                               |
| `npm run build` | Limpia la carpeta `dist/` y compila el código de TypeScript (`.ts`) a JavaScript (`.js`).          |
| `npm run start` | Ejecuta el script `build` y luego inicia la aplicación desde el código JavaScript compilado en `dist/`. |

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo `LICENSE` para más detalles.
