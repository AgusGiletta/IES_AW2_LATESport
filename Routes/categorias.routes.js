import { Router } from "express"
import { crearCategorias, encontrarTodasLasCategorias, actualizarCategoria, 
    eliminarCategoria  } from "../db/actions/categorias.action.js";
import { encontrarTodosLosProductosporCategoria } from "../db/actions/productos.action.js"; 

const router = Router()

router.get('/', async (req, res) => {
    try {
        const categorias = await encontrarTodasLasCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Error al obtener categorias:", error);
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

router.post("/nuevo", async (req, res) => {
    try {
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "Falta el campo 'nombre' de la categoría." });
        }

        const nuevaCategoria = await crearCategorias(nombre);

        res.status(201).json({ mensaje: "Categoría creada correctamente", categoria: nuevaCategoria });
    } catch (error) {
        console.error(error);

        if (error.code === 11000) {
            return res.status(409).json({ error: `Error: La categoría con nombre '${req.body.nombre}' ya existe.`, detalle: error.message });
        }
        
        res.status(500).json({ error: "Error interno al crear la categoría", detalle: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre } = req.body;

        if (!nombre) {
            return res.status(400).json({ error: "Falta el campo 'nombre' para la actualización." });
        }
        
        const categoriaActualizada = await actualizarCategoria(id, nombre);
        
        res.status(200).json({ 
            mensaje: "Categoría actualizada correctamente", 
            categoria: categoriaActualizada 
        });

    } catch (error) {
        console.error("Error en PUT /:id:", error);
        
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        if (error.code === 11000) {
            return res.status(409).json({ error: `Error: El nombre de categoría '${req.body.nombre}' ya está en uso.`, detalle: error.message });
        }
        
        res.status(500).json({ error: "Error interno al actualizar la categoría", detalle: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await eliminarCategoria(id);
        
        res.status(200).json(resultado); 

    } catch (error) {
        console.error("Error en DELETE /:id:", error);
        
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        
        res.status(500).json({ error: "Error interno al eliminar la categoría", detalle: error.message });
    }
});


export default router