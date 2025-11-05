# Documentación de Middlewares

En este archivo se documentan los middlewares personalizados utilizados en el Servicio de Inventario.

---

## `AuthMiddleware`

El `AuthMiddleware` es una pieza de seguridad fundamental en el servicio. Su principal responsabilidad es proteger las rutas, asegurando que solo las peticiones con un JSON Web Token (JWT) válido puedan acceder a los recursos protegidos.

**Archivo**: `src/presentation/middlewares/auth.middleware.ts`

### Funcionamiento

El middleware sigue un proceso de validación estricto para cada petición entrante a una ruta protegida:

1.  **Lectura del Token**: Inspecciona la cabecera `Authorization` de la petición para encontrar un token.
2.  **Verificación del Formato**: Comprueba que la cabecera siga el esquema `Bearer <token>`.
3.  **Validación del JWT**: Utiliza la clave secreta (`JWT_ACCESS_SECRET`) para verificar la firma y la validez del token.
4.  **Adjuntar Payload**: Si el token es válido, decodifica el *payload* (que contiene la información del usuario) y lo adjunta al objeto `request` (`req.user`). Esto permite que los controladores posteriores accedan a la información del usuario que realiza la petición.
5.  **Paso a la Ruta**: Si todo es correcto, invoca a `next()` para ceder el control al siguiente middleware o al controlador de la ruta.

### Requisitos de la Petición

Para que una petición pase la validación de este middleware, debe incluir la siguiente cabecera:

| Cabecera      | Formato                  |
|---------------|--------------------------|
| `Authorization` | `Bearer <tu-accessToken>`|

*   **`<tu-accessToken>`**: Debe ser un JWT válido generado por el servicio de autenticación (`auth-service`).

### Respuestas de Error

Si la validación falla en cualquier punto, el middleware detiene la ejecución y responde con un código de estado `401 Unauthorized` y un cuerpo JSON que describe el error.

| Condición de Error                      | Respuesta JSON                               |
|-----------------------------------------|----------------------------------------------|
| No se proporciona la cabecera `Authorization`. | `{"error": "No se proporcionó token"}`      |
| La cabecera no comienza con `"Bearer "`.   | `{"error": "Token Bearer inválido"}`       |
| El token es inválido, ha expirado o está malformado. | `{"error": "Token inválido"}`             |

### Ejemplo de Uso

Para proteger una ruta, simplemente se añade `AuthMiddleware.validateJWT` antes del controlador correspondiente en el archivo de rutas.

**`src/presentation/routes/inventory_routes.ts`**

```typescript
import { Router } from 'express';
import { InventoryController } from '../controllers/inventory_controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

// ... (otras importaciones)

export class InventoryRoutes {
   static get routes(): Router {
 
    const router = Router();
    const controller = new InventoryController(/* ... */);

    // Esta ruta está protegida por el middleware.
    // Primero se ejecuta `validateJWT` y, si tiene éxito, se ejecuta `createProduct`.
    router.post('/products', AuthMiddleware.validateJWT, controller.createProduct);

    // Las peticiones a esta ruta sin un token válido serán rechazadas.
    router.get('/products', AuthMiddleware.validateJWT, controller.getProducts);
   
    return router;
   }
}
```
