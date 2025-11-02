import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'

const PRODUCTOS_FILE_PATH = './JSON/productos.json';
const VENTAS_FILE_PATH = './JSON/ventas.json';

const router = Router()

const getProductosData = async () => {
    try {
        const file = await readFile(PRODUCTOS_FILE_PATH, 'utf-8');
        return JSON.parse(file);
    } catch (error) {
        console.error("Error al leer productos.json:", error);
        return [];
    }
}
router.get('/byId/:id', async (req, res) => {
    const productosData = await getProductosData(); 
    
    const id = parseInt(req.params.id);
    const result = productosData.find(e => e.id === id);

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: `El producto con ID ${id} no se encuentra en la base de datos` });
    }
});

router.get('/byNombre/:nombre', async (req, res) => {
    const productosData = await getProductosData(); 
    
    const nombre = req.params.nombre;
    const result = productosData.find(e => e.nombre === nombre);

    if (result) {
        res.status(200).json(result);
    } else {
        res.status(404).json({ error: `El producto ${nombre} no se encuentra en la base de datos` });
    }
});

router.get('/', async (req, res) => {
    const productosData = await getProductosData(); 
    
    const productosActivos = productosData.filter(p => p.activo);
    res.status(200).json(productosActivos);
});

router.get('/byCategoria/:categoria', async (req, res) => {
    const productosData = await getProductosData(); 
    
    const categoria = req.params.categoria;
    
    const result = productosData.filter(e => 
        e.categoria === categoria && e.activo === true
    );

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json({
            error: `No se encontraron productos activos en la categoría '${categoria}'.`
        });
    }
});
router.put('/cambiarPrecio', async (req, res) => {
    const productosData = await getProductosData(); 
    
    const id = parseInt(req.body.id);
    const nuevoPrecio = req.body.nuevoPrecio;

    if (!id || nuevoPrecio === undefined || isNaN(Number(nuevoPrecio)) || Number(nuevoPrecio) < 0) {
        return res.status(400).json({ error: "Debe enviar 'id' y un 'nuevoPrecio' válido y positivo." });
    }

    try {
        const index = productosData.findIndex(e => e.id === id);
        if (index === -1) {
            return res.status(404).json({ error: `Producto con ID ${id} no encontrado` });
        }

        productosData[index].precio = Number(nuevoPrecio); 
        await writeFile(PRODUCTOS_FILE_PATH, JSON.stringify(productosData, null, 2));

        res.status(200).json({ 
            mensaje: `Precio de producto ID ${id} actualizado correctamente a ${nuevoPrecio}`,
            producto: productosData[index] 
        });
    } catch (error) {
        console.error("Error al actualizar precio:", error);
        res.status(500).json({ error: "Error interno al actualizar el precio" });
    }
});

router.delete("/eliminar/:id", async (req, res) => {
    const productosData = await getProductosData(); 
    const ventasData = await getVentasData(); 
    
    const id = parseInt(req.params.id);
    const estaEnVenta = ventasData.some(v =>
        v.productos.some(p => p.id === id) 
    );

    if (estaEnVenta) {
        return res.status(409).json({ 
            error: "No se puede eliminar este producto. Está presente en ventas." 
        });
    }

    const index = productosData.findIndex(p => p.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    productosData.splice(index, 1);
    await writeFile(PRODUCTOS_FILE_PATH, JSON.stringify(productosData, null, 2));

    res.status(200).json({ mensaje: `Producto con ID ${id} eliminado correctamente` });
});

router.post("/nuevo", async (req, res) => {
    try {
        const productosData = await getProductosData(); 
        
        const { nombre, categoria, desc, precio, imagen, activo } = req.body;

        if (!nombre || !categoria || !precio) {
            return res.status(400).json({ error: "Faltan datos obligatorios (nombre, categoria, precio)." });
        }
        
        if (isNaN(Number(precio)) || Number(precio) < 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo." });
        }

        const nuevoId = productosData.length ? Math.max(...productosData.map(p => p.id)) + 1 : 1;

        const nuevoProducto = {
            id: nuevoId,
            nombre,
            categoria,
            desc: desc || "",
            precio: Number(precio), 
            imagen: imagen || "",
            activo: activo !== undefined ? Boolean(activo) : true 
        };

        productosData.push(nuevoProducto);

        await writeFile(PRODUCTOS_FILE_PATH, JSON.stringify(productosData, null, 2));

        res.status(201).json({ mensaje: "Producto creado correctamente", producto: nuevoProducto });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el producto" });
    }
});

// exportar las rutas
export default router