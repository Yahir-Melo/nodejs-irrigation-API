# Documentación de API: Servicio de Inventario

Bienvenido a la documentación de la API del Servicio de Inventario. Este servicio es responsable de gestionar todas las operaciones relacionadas con los productos, incluyendo su creación, consulta y filtrado.

## URL Base

Todos los endpoints de la API son relativos a la siguiente URL base:

```
http://localhost:5901/api/inventory
```

---

## Autenticación

Todas las rutas dentro de este servicio están protegidas y requieren un `accessToken` válido. El token debe ser enviado en la cabecera `Authorization` usando el esquema `Bearer`.

### Cabecera

| Clave         | Valor                     |
|---------------|---------------------------|
| `Authorization` | `Bearer <tu-accessToken>` |

### Respuesta de Error (401 Unauthorized)

Si el token falta, es inválido o ha expirado, la API responderá con un estado `401 Unauthorized` y el siguiente cuerpo:

```json
{
  "error": "No autorizado"
}
```

---

## Endpoints

### 1. Productos

El recurso principal para la gestión de productos del inventario.

---

#### **`POST /products`**

Crea un nuevo producto en la base de datos. Este endpoint se utiliza normalmente para añadir un nuevo artículo al inventario.

**Autenticación**: Requerida (Bearer Token)

**Cuerpo de la Solicitud (Request Body)**:

| Campo         | Tipo   | Requerido | Por Defecto | Descripción                                  |
|---------------|--------|-----------|-------------|----------------------------------------------|
| `name`        | String | Sí        | -           | El nombre del producto.                      |
| `sku`         | String | Sí        | -           | El código único de producto (SKU). Debe ser único. |
| `price`       | Number | Sí        | -           | El precio del producto.                      |
| `stock`       | Number | No        | `0`         | La cantidad disponible en stock.             |
| `description` | String | No        | `null`      | Una breve descripción del producto.          |
| `category`    | String | No        | `null`      | La categoría a la que pertenece el producto. |

**Ejemplo de Solicitud**:

```json
{
  "name": "Camiseta de Algodón",
  "sku": "SKU-ROPA-001",
  "price": 499.50,
  "stock": 100,
  "description": "Camiseta azul, talla M",
  "category": "Ropa"
}
```

**Respuesta Exitosa (201 Created)**:

Retorna el objeto completo del producto, incluyendo el `id` generado por la base de datos y el `status` inicial.

```json
{
  "id": "clxunax9h0000l6d4h2qg7r7d",
  "name": "Camiseta de Algodón",
  "sku": "SKU-ROPA-001",
  "price": 499.5,
  "stock": 100,
  "description": "Camiseta azul, talla M",
  "category": "Ropa",
  "status": "En Stock",
  "createdAt": "2025-11-04T12:00:00.000Z"
}
```

**Respuestas de Error**:

*   **400 Bad Request**: Si faltan campos requeridos (`name`, `sku`, `price`), o si el `sku` proporcionado ya existe.
*   **401 Unauthorized**: Si el `accessToken` es inválido o no se proporciona.

### Cómo Probar el Endpoint

#### Paso 1: Obtener el `accessToken` 🔑

1.  **Realiza una petición de login** al servicio de autenticación para obtener un token.
    *   **Petición**: `POST http://localhost:5900/api/auth/login`
    *   **Body (JSON)**:
        ```json
        {
            "email": "tu-usuario@gmail.com",
            "password": "tu-contraseña"
        }
        ```
2.  **Copia el `accessToken`** de la respuesta.

#### Paso 2: Crear el Producto 📦

1.  **Crea una nueva petición** en Postman o una herramienta similar.
    *   **Petición**: `POST http://localhost:5901/api/inventory/products`
    *   **Authorization**: Selecciona `Bearer Token` y pega el `accessToken`.
    *   **Body (JSON)**: Proporciona los datos del producto a crear.
        ```json
        {
            "name": "Taza de Cerámica",
            "sku": "TAZA-CER-BL-01",
            "price": 150.50,
            "stock": 50,
            "description": "Taza de cerámica blanca de 350ml",
            "category": "Hogar"
        }
        ```
2.  **Envía la petición**.

#### Paso 3: Verificar los Resultados ✅

*   **Si Funciona (201 Created)**:
    *   Recibirás un código de estado `201 Created`.
    *   El cuerpo de la respuesta contendrá el JSON del producto creado, incluyendo su `id` y `createdAt`.

*   **Prueba de Error (401 Unauthorized)**:
    *   Ocurre si el `accessToken` es incorrecto, ha expirado o no se ha incluido en la cabecera `Authorization`.

*   **Prueba de Error (400 Bad Request)**:
    *   Ocurre si falta un campo requerido (como `name` o `sku`) o si el tipo de dato es incorrecto (ej. `price: "hola"`).

#### Verificación Final en Base de Datos 🗄️

1.  Ejecuta `npx prisma studio` en la terminal de este servicio.
2.  En Prisma Studio, navega al modelo `Product`.
3.  Verifica que el nuevo producto ("Taza de Cerámica") se ha guardado correctamente.

#### Prueba Extra (SKU Duplicado)

*   Vuelve a enviar la misma petición `POST` para crear el producto una segunda vez.
*   **Resultado Esperado**: Deberías recibir un error `400 Bad Request` con un mensaje como: `{"error": "Un producto con este SKU ya existe."}`. Esto confirma que la validación de SKU único está funcionando.

---

#### **`GET /products/:id`**

Obtiene los detalles completos de un único producto identificado por su ID.

**Autenticación**: Requerida (Bearer Token)

**Parámetros de Ruta (Path Parameters)**:

| Parámetro | Tipo   | Descripción                               |
|-----------|--------|-------------------------------------------|
| `id`      | String | El identificador único (UUID) del producto. |

**Ejemplo de Solicitud**:

```
GET /api/inventory/products/clxunax9h0000l6d4h2qg7r7d
```

**Respuesta Exitosa (200 OK)**:

Retorna el objeto completo del producto.

```json
{
  "id": "clxunax9h0000l6d4h2qg7r7d",
  "name": "Camiseta de Algodón",
  "sku": "SKU-ROPA-001",
  "price": 499.5,
  "stock": 100,
  "description": "Camiseta azul, talla M",
  "category": "Ropa",
  "status": "En Stock",
  "createdAt": "2025-11-04T12:00:00.000Z"
}
```

**Respuestas de Error**:

*   **404 Not Found**: Si no se encuentra ningún producto con el `id` proporcionado.
*   **401 Unauthorized**: Si el `accessToken` es inválido o no se proporciona.

### Cómo Probar el Endpoint

#### Paso 1: Crea un Producto y Obtén su ID ➕

1.  **Asegúrate de tener un `accessToken` válido**: Si no lo tienes, haz una petición `POST /api/auth/login` (en el puerto `5900`) y copia el `accessToken` de la respuesta.
2.  **Crea un producto**:
    *   **Petición**: `POST http://localhost:5901/api/inventory/products`
    *   **Authorization**: `Bearer <tu-accessToken>`
    *   **Body (JSON)**:
        ```json
        {
            "name": "Producto de Prueba",
            "sku": "PRUEBA-ID-001",
            "price": 99.99,
            "stock": 10
        }
        ```
3.  **Envía la petición**. Recibirás una respuesta `201 Created` con el JSON del producto. **Copia el valor del campo `id`**.

#### Paso 2: Prueba el Endpoint `GET /products/:id` 🔍

1.  Usa el `id` que acabas de copiar para buscar ese producto específico.
2.  **Método**: `GET`
3.  **URL**: `http://localhost:5901/api/inventory/products/<pega_el_id_aqui>`
4.  **Authorization**: `Bearer <tu-accessToken>` (usa el mismo token).
5.  **Envía la petición**.

#### Paso 3: Verifica los Resultados ✅

*   **Si Funciona (200 OK)**:
    *   Recibirás un código de estado `200 OK`.
    *   El cuerpo de la respuesta contendrá el JSON completo del "Producto de Prueba" que creaste.

*   **Prueba de Error (404 Not Found)**:
    *   Cambia el `id` en la URL por uno que no exista (ej. `id-invalido`).
    *   Envía la petición de nuevo.
    *   Deberías recibir un error `404 Not Found` con un mensaje similar a: `{"error": "Producto con ID id-invalido no encontrado."}`.

Si ambas pruebas (éxito y error) funcionan como se describe, ¡tu endpoint está implementado y funcionando correctamente!

---

#### **`GET /products`**

Obtiene una lista de todos los productos, con soporte para filtros y paginación. Este es el endpoint principal para alimentar la pantalla de inventario y el dashboard.

**Autenticación**: Requerida (Bearer Token)

**Parámetros de Consulta (Query Parameters)**:

| Parámetro  | Tipo   | Por Defecto | Descripción                                                                          |
|------------|--------|-------------|--------------------------------------------------------------------------------------|
| `page`     | Number | `1`         | El número de página que se desea obtener.                                            |
| `limit`    | Number | `10`        | El número de productos a retornar por página.                                        |
| `search`   | String | -           | Un término de búsqueda. La API realizará una búsqueda insensible a mayúsculas en `name` y `sku`. |
| `category` | String | -           | Filtra la lista para mostrar solo productos de una categoría exacta.                 |
| `status`   | String | -           | Filtra la lista por el estado del producto (ej. `En Stock`, `Bajo Stock`, `Agotado`).   |

**Ejemplo de Solicitud (Filtros Combinados)**:

```
GET /api/inventory/products?page=2&limit=20&search=camiseta&category=Ropa
```

Esta solicitud busca "camiseta" en la categoría "Ropa" y muestra la página 2 con 20 resultados por página.

**Respuesta Exitosa (200 OK)**:

Retorna un array de objetos de producto que coinciden con los criterios de filtro. Si no se encuentran productos, retorna un array vacío `[]`.

```json
[
  {
    "id": "clxunax9h0000l6d4h2qg7r7d",
    "name": "Camiseta de Algodón",
    "sku": "SKU-ROPA-001",
    "price": 499.5,
    "stock": 100,
    "description": "Camiseta azul, talla M",
    "category": "Ropa",
    "status": "En Stock",
    "createdAt": "2025-11-04T12:00:00.000Z"
  },
  {
    "id": "clxunb32k0001l6d4g8f9e2c3",
    "name": "Camisa de Lino",
    "sku": "SKU-ROPA-002",
    "price": 699.0,
    "stock": 50,
    "description": "Camisa de lino blanca, talla L",
    "category": "Ropa",
    "status": "En Stock",
    "createdAt": "2025-11-03T10:00:00.000Z"
  }
]
```

**Respuestas de Error**:

*   **400 Bad Request**: Si `page` o `limit` se proporcionan en un formato incorrecto (ej. `?page=cero`).
*   **401 Unauthorized**: Si el `accessToken` es inválido o no se proporciona.
