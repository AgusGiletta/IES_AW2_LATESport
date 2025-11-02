# IES_AW2_LATESport

## Descripción General

Este proyecto implementa un **servidor backend con Express.js** para gestionar tres estructuras principales:

- **Usuarios**
- **Productos deportivos**
- **Ventas**

Cada módulo cuenta con sus propias rutas (`/usuarios`, `/productos`, `/ventas`) que permiten **consultar, crear, modificar y eliminar registros**. Toda la información se almacena en archivos `.json`, que actúan como base de datos local.

---

## Rutas Implementadas

### USUARIOS (`/usuarios`)

- **GET /usuarios/byID/:id**  
  Devuelve un usuario según su ID.  
  **Ejemplo:** `/usuarios/byID/1`

- **POST /usuarios/login**  
  Valida credenciales de acceso (`email`, `pass`).  
  **Body JSON:**
  ```json
  { "email": "juanp", "pass": "123456" }
  ```

- **POST /usuarios/nuevo**  
  Crea un nuevo usuario con los datos enviados en el body.  
  **Body JSON:**
  ```json
  {
    "nombre": "Emma",
    "apellido": "Re",
    "usuario": "emmare",
    "contraseña": "abc123",
    "email": "emmare@example.com"
  }
  ```

- **DELETE /usuarios/eliminar/:id**  
  Elimina un usuario si no tiene ventas asociadas.  
  **Ejemplo:** `/usuarios/eliminar/3`

**Integridad de datos:** Antes de eliminar un usuario, se verifica si existe alguna venta con su `id_usuario`. Si tiene ventas, el sistema devuelve un error y no elimina el registro.

---

### PRODUCTOS (`/productos`)

- **GET /byId/:id**  
  Devuelve un producto por su ID.  
  **Ejemplo:** `/productos/byId/2`

- **GET /byNombre/:nombre**  
  Devuelve un producto según su nombre.  
  **Ejemplo:** `/productos/byNombre/Campera Nike Oversize`

- **GET /byCategoria/:categoria**  
  Devuelve todos los productos activos de una categoría específica.  
  **Ejemplo:** `/productos/byCategoria/hombre`

- **PUT /cambiarPrecio**  
  Actualiza el precio de un producto según su ID.  
  **Body JSON:**
  ```json
  { "id": 2, "nuevoPrecio": 11000 }
  ```

- **POST /nuevo**  
  Crea un nuevo producto deportivo y lo guarda en `productos.json`.  
  **Body JSON:**
  ```json
  {
    "nombre": "Gorra Nike Pro Negra",
    "categoria": "accesorios",
    "precio": 5896,
    "desc": "Gorra deportiva con ventilación óptima."
  }
  ```

- **DELETE /eliminar/:id**  
  Elimina un producto si no forma parte de ninguna venta.  
  **Ejemplo:** `/productos/eliminar/5`

**Coherencia de datos:** No se puede eliminar un producto si está presente en alguna venta registrada.

---

### VENTAS (`/ventas`)

- **GET /all**  
  Devuelve todas las ventas registradas.  
  **Ejemplo:** `/ventas/all`

- **GET /byDate/:from/:to**  
  Devuelve ventas entre dos fechas dadas (por URL).  
  **Ejemplo:** `/ventas/byDate/2025-09-01/2025-09-30`

- **POST /detail**  
  Muestra las ventas entre fechas enviadas por body y los datos del vendedor asociado a cada venta.  
  **Body JSON:**
  ```json
  { "from": "2025-09-01", "to": "2025-09-05" }
  ```

- **DELETE /eliminar/:id**  
  Elimina una venta según su ID.  
  **Ejemplo:** `/ventas/eliminar/2`

---