# Documentación de Middlewares

Este documento detalla los middlewares de Express utilizados en la aplicación, con un enfoque en aquellos que mejoran la seguridad y la robustez de la API.

---

## Estructura de la Documentación

Cada middleware documentado seguirá la siguiente estructura:

-   **Nombre:** El nombre descriptivo del middleware.
-   **Archivo:** La ruta al archivo donde se define el middleware.
-   **Propósito:** Una explicación clara de por qué se utiliza este middleware y qué problema resuelve.
-   **Configuración:** Detalles sobre las reglas y opciones específicas con las que se ha configurado.
-   **Uso:** Cómo y dónde se aplica el middleware dentro de la aplicación (generalmente en las rutas).

---

## Middlewares de Seguridad

### 1. Rate Limiter

-   **Nombre:** `Rate Limiter`
-   **Archivo:** `src/presentation/middlewares/rateLimiter.ts`
-   **Propósito:** Proteger la API contra ataques de fuerza bruta y abuso de servicios, limitando el número de peticiones que una misma dirección IP puede realizar en un período de tiempo determinado.
-   **Configuración:**
    Se han definido dos configuraciones distintas para adaptarse a diferentes casos de uso:

    1.  **`loginLimiter` (Para Inicio de Sesión):**
        -   **Límite:** `5` peticiones.
        -   **Ventana de tiempo:** 15 minutos.
        -   **Objetivo:** Prevenir ataques de fuerza bruta sobre las credenciales de los usuarios. Es una configuración estricta.

    2.  **`registerLimiter` (Para Registro):**
        -   **Límite:** `10` peticiones.
        -   **Ventana de tiempo:** 1 hora.
        -   **Objetivo:** Evitar el registro masivo de cuentas (spam), pero siendo lo suficientemente flexible para no bloquear a usuarios legítimos.

-   **Uso:**
    Los middlewares se aplican directamente en las rutas que necesitan protección, antes de que la petición llegue al controlador.

    *Ejemplo en `src/presentation/routes/routes.ts`:*
    ```typescript
    import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter.js';

    // ...

    router.post('/register', registerLimiter, controller.registerUser);
    router.post('/login', loginLimiter, controller.loginUser);
    ```

---
<!-- 
  **Instrucciones para futuros middlewares:**
  Para añadir un nuevo middleware a esta documentación, copie la plantilla de la sección "Rate Limiter", 
  actualice la información y añádala como una nueva sección numerada bajo "Middlewares de Seguridad".
-->
