// importar Router para utilizar funciones propias de las rutas
import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
const fileVentas = await readFile("./JSON/ventas.json", "utf-8");
const ventasData = JSON.parse(fileVentas);

const router = Router()

// RUTAS DE PRODUCTOS
const fileProductos = await readFile ('./JSON/productos.json', 'utf-8')
const productosData = JSON.parse(fileProductos)

router.get('/byId/:id', (req, res) => {
    const id = parseInt (req.params.id)
    const result = productosData.find (e => e.id === id)

    if (result) {
        res.status (200).json (result)
    } else {
        res.status (400).json(`El producto con ID ${id} no se encuentra en la base de datos`)
    }
})

router.get('/byNombre/:nombre', (req, res) => {
    const nombre = req.params.nombre
    const result = productosData.find (e => e.nombre === nombre)

    if (result) {
        res.status (200).json (result)
    } else {
        res.status (400).json(`${nombre} no se encuentra en la base de datos`)
    }
})

router.put('/byCategoria/:categoria', (req, res) => {
    const categoria = req.params.categoria
    const result = productosData.filter(e => e.categoria === categoria)

    if (result.length > 0) {
        res.status(200).json(result)
    } else {
        res.status(404).json({
            error: `No se encontraron productos en la categoría '${categoria}'.`
        })
    }
})

router.put('/cambiarPrecio', async (req, res) => {
    const id = parseInt(req.body.id)
    const nuevoPrecio = req.body.nuevoPrecio

    if (!id || !nuevoPrecio) {
        return res.status(400).json({ error: "Debe enviar 'id' y 'nuevoPrecio' en el body" })
    }

    try {
        const index = productosData.findIndex(e => e.id === id)
        if (index === -1) {
            return res.status(404).json({ error: `Producto con ID ${id} no encontrado` })
        }

        productosData[index].precio = nuevoPrecio
        await writeFile('./JSON/productos.json', JSON.stringify(productosData, null, 2))

        res.status(200).json({ mensaje: `Precio actualizado correctamente` })
    } catch (error) {
        console.error("Error al actualizar precio:", error)
        res.status(500).json({ error: "Error interno al actualizar el precio" })
    }
})

router.delete("/eliminar/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    // Verifica si el producto está en alguna venta
    const estaEnVenta = ventasData.some(v =>
        v.productos.some(p => p.id === id)
    );

    if (estaEnVenta) {
        return res.status(400).json({
            error: "No se puede eliminar este producto. Está presente en ventas."
        });
    }

    const index = productosData.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    productosData.splice(index, 1);
    await writeFile("./JSON/productos.JSON", JSON.stringify(productosData, null, 2));

    res.status(200).json({ mensaje: `Producto con ID ${id} eliminado correctamente` });
});

router.post("/nuevo", async (req, res) => {
    try {
        const { nombre, categoria, desc, precio, imagen, activo } = req.body;

        if (!nombre || !categoria || !precio) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Crear nuevo ID
        const nuevoId = productosData.length ? Math.max(...productosData.map(p => p.id)) + 1 : 1;

        const nuevoProducto = {
            id: nuevoId,
            nombre,
            categoria,
            desc: desc || "",
            precio,
            imagen: imagen || "",
            activo: activo !== undefined ? activo : true
        };

        productosData.push(nuevoProducto);

        await writeFile("./JSON/productos.json", JSON.stringify(productosData, null, 2));

        res.status(201).json({ mensaje: "Producto creado correctamente", producto: nuevoProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

// exportar las rutas
export default router