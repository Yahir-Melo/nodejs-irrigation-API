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


## 📜 Scripts Disponibles en `package.json`

| Script        | Acción                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`   | Ejecuta la aplicación en modo desarrollo usando `ts-node` y `nodemon`.                               |
| `npm run build` | Limpia la carpeta `dist/` y compila el código de TypeScript (`.ts`) a JavaScript (`.js`).          |
| `npm run start` | Ejecuta el script `build` y luego inicia la aplicación desde el código JavaScript compilado en `dist/`. |

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Consulta el archivo `LICENSE` para más detalles.
