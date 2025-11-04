# IES_AW2_LATESport

## Descripción General

Este proyecto utiliza **Express.js** y **MongoDB** (a través de Mongoose) para gestionar un sistema de venta de artículos deportivos.

La aplicación está estructurada en torno a cuatro módulos principales, cada uno con sus propias rutas para operaciones:

* **Usuarios** 👤: Gestión de credenciales y perfiles.
* **Productos** 👟: Gestión de inventario de artículos deportivos (activos e inactivos).
* **Ventas** 🛒: Registro de transacciones.
* **Categorías** 🏷️: Estructura y clasificación de productos.

---
### 👤 USUARIOS (`/usuarios`)

* **GET /usuarios/byID/:id**
    Devuelve un usuario según su **MongoDB ID**.
    **Ejemplo URL:** `/usuarios/byID/690a54053e14b9e34f083428`

* **POST /usuarios/login**
    Valida credenciales de acceso (`email`, `pass`).
    **Body JSON:**
    ```json
    {
        "email": "tomimedina@ejemplo.com.ar",
        "pass": "456456"
    }
    ```

* **POST /usuarios/nuevo**
    Crea un nuevo usuario con los datos enviados en el body.
    **Body JSON:**
    ```json
    {
        "nombre": "Javier",
        "apellido": "Perez",
        "usuario": "javiperez",
        "pass": "123456",
        "email": "javier.perez@ejemplo.com"
    }
    ```

* **DELETE /usuarios/eliminar/:id**
    Elimina un usuario por ID. 
    **Ejemplo URL:** `/usuarios/eliminar/690a57192b6b3a3bab651cf5`

---

### 👟 PRODUCTOS (`/productos`)

* **GET /productos/byID/:id**
    Devuelve un producto por su **MongoDB ID**.
    **Ejemplo URL:** `/productos/byID/69079e04729dfe3ebd990d62`

* **GET /productos/**
    Devuelve todos los productos que se encuentran **activos**.

* **GET /productos/byNombre/:nombre**
    Devuelve productos cuyo nombre coincida.
    **Ejemplo URL:** `/productos/byNombre/Campera Nike Oversize`

* **GET /productos/byCategoria/:categoria**
    Devuelve todos los productos activos de una categoría específica (usando el nombre de la categoría).
    **Ejemplo URL:** `/productos/byCategoria/mujer`

* **POST /productos/nuevo**
    Crea un nuevo producto deportivo. (Nota: `categoria` debe ser un ID de categoría válido).
    **Body JSON:**
    ```json
    {
        "nombre": "Camiseta Deportiva Clásica",
        "categoria": "690795597b31815cce88ddd5",
        "desc": "Camiseta de alto rendimiento, ideal para running y entrenamiento.",
        "tipo": "Textil",
        "talla": "L",
        "color": "Azul Marino",
        "precio": 45000,
        "imagen": "/Assets/productos/camiseta-azul.jpg",
        "activo": true
    }
    ```

* **PATCH /productos/modificarPrecio/:id**
    Actualiza solo el precio de un producto por ID.
    **Body JSON:**
    ```json
    {
        "precio": 6000
    }
    ```

* **DELETE /productos/eliminar/:id**
    Elimina un producto por ID. 
    **Ejemplo URL:** `/productos/eliminar/690a55163e14b9e34f08344b`

---

### 🏷️ CATEGORÍAS (`/categorias`)

* **GET /categorias/**
    Devuelve todas las categorías existentes.

* **GET /categorias/:id**
    Devuelve una categoría por su **MongoDB ID**.
    **Ejemplo URL:** `/categorias/690a56bc2d7bcaa8afc4ed62`

* **POST /categorias/nuevo**
    Crea una nueva categoría.
    **Body JSON:**
    ```json
    {"nombre": "zapatilla"}
    ```

* **PUT /categorias/:id**
    Actualiza el nombre de una categoría por ID.
    **Body JSON:**
    ```json
    {"nombre": "zapatillas"}
    ```

---

### 🛒 VENTAS (`/ventas`)

* **GET /ventas/all**
    Devuelve todas las ventas registradas.

* **GET /ventas/byId/:id**
    Devuelve una venta por su **MongoDB ID**.
    **Ejemplo URL:** `/ventas/byId/690a54473e14b9e34f083433`

* **POST /ventas/nueva**
    Crea una nueva venta. El servidor **calcula el `total`** automáticamente.
    **Body JSON:**
    ```json
    {
        "productos": [
            {
                "productoId": "69079d908b47322643fa0273", 
                "cantidad": 2,
                "precioUnitario": 2000,
                "nombre": "Piluso Nike Nuevo",
                "descripcion": "Diseño clásico y urbano con logo bordado.",
                "imagen": "../Assets/productos/accesorio1.avif"
            }
        ],
        "usuario": {
            "id": "6909dc6cab6496bf5b85ebfe", 
            "nombre": "Tomas",
            "email": "tomigi@ejemplo.com"
        }
    }
    ```

* **DELETE /ventas/eliminar/:id**
    Elimina una venta por ID.
    **Ejemplo URL:** `/ventas/eliminar/690a56613e14b9e34f083459`
    