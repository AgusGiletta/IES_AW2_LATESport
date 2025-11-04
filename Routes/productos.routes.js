import { Router } from "express"
import { crearProductos, encontrarTodosLosProductos, encontrarTodosLosProductosporID, encontrarTodosLosProductosporCategoria, encontrarProductoPorNombre, modificarPrecio, eliminarById } from "../db/actions/productos.action.js";

const router = Router()

router.get('/byId/:id', async (req, res) => {
    const id = req.params.id;
    
    try {
        const result = await encontrarTodosLosProductosporID(id);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `El producto con ID ${id} no se encuentra en la base de datos` });
        }
    } catch (error) {
        console.error("Error en GET /byId/:id:", error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: `El ID proporcionado (${id}) no tiene un formato válido.` });
        }
        
        res.status(500).json({ error: "Error interno del servidor al buscar el producto." });
    }
});

router.get('/byNombre/:nombre', async (req, res) => {
    const nombre = req.params.nombre;
    
    try {
        const result = await encontrarProductoPorNombre(nombre);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `El producto ${nombre} no se encuentra en la base de datos` });
        }
    } catch (error) {
        console.error("Error en GET /byNombre/:nombre:", error);
        res.status(500).json({ error: "Error interno del servidor al buscar el producto por nombre." });
    }
});


router.get('/', async (req, res) => {
    try {
        const productosActivos = await encontrarTodosLosProductos(); 
        
        res.status(200).json(productosActivos);
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar la base de datos." });
    }
});

router.get('/byCategoria/:categoria', async (req, res) => {
    const categoria = req.params.categoria;
    
    try {
        const result = await encontrarTodosLosProductosporCategoria(categoria);
        
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json({
                error: `No se encontraron productos activos en la categoría '${categoria}'.`
            });
        }
    } catch (error) {
        console.error("Error en GET /byCategoria:", error);
        res.status(500).json({ error: "Error interno del servidor al buscar productos por categoría." });
    }
});

router.patch("/modificarPrecio/:id", async (req, res) => {
    const id = req.params.id;
        const {precio} = req.body;

    try {
        const result = await modificarPrecio(id, precio);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al actualizar precio:", error);
        res.status(500).json({ error: "Error interno al actualizar el precio" });
    }
});

router.delete("/eliminar/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        const productoEliminado = await eliminarById(id);

        res.status(200).json({ 
            mensaje: `Producto con ID ${id} eliminado correctamente.`,
            producto: productoEliminado 
        });
        
    } catch (error) {
        console.error("Error en DELETE /eliminar/:id:", error.message);
        
        if (error.message.includes("no encontrado para eliminar")) {
            return res.status(404).json({ error: error.message });
        }
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: `El ID proporcionado (${id}) no tiene un formato válido.` });
        }
        res.status(500).json({ error: "Error interno del servidor al intentar eliminar el producto." });
    }
});

router.post("/nuevo", async (req, res) => {
    try {

        const { nombre, categoria, desc, tipo, talla, color, precio, imagen, activo } = req.body;

        if (!nombre || !categoria || !precio) {
            return res.status(400).json({ error: "Faltan datos obligatorios (nombre, categoria, precio)." });
        }
        
        if (isNaN(Number(precio)) || Number(precio) < 0) {
            return res.status(400).json({ error: "El precio debe ser un número positivo." });
        }

        const nuevoProducto = await crearProductos({ 
            nombre, 
            categoria, 
            desc, 
            tipo,
            talla,
            color,
            precio: Number(precio),
            imagen: imagen || "",
            activo: activo !== undefined ? Boolean(activo) : true 
        });


        res.status(201).json({ mensaje: "Producto creado correctamente", producto: nuevoProducto });
    } catch (error) {
        console.error(error);
        
        if (error.code === 11000) {
            return res.status(409).json({ error: "Error: Ya existe un producto con este nombre.", detalle: error.message });
        }
        
        res.status(500).json({ error: "Error interno al crear el producto", detalle: error.message });
    }
});

// exportar las rutas
export default router
