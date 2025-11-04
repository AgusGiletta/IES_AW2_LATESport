import { Router } from "express";
import { crearVentas, encontrarVentas, encontrarVentasporId, eliminarVentaPorID } from '../db/actions/ventas.actions.js'; 

const router = Router();

router.get('/all', async (req, res) => {
    try {
        const result = await encontrarVentas(); 
        res.status(200).json(result);
    } catch (error) {
        console.error("Error al obtener ventas:", error);
        res.status(500).json({ error: "Error interno del servidor al consultar la base de datos." });
    }
});

router.get("/byId/:id", async (req, res) => { 
    const id = req.params.id;
    try {
        const result = await encontrarVentasporId(id); 
        
        if (!result) {
            return res.status(404).json({ error: `Venta con ID ${id} no encontrada.` });
        }
        
        res.status(200).json({ mensaje: "Venta encontrada", venta: result }); 
    } catch (error) {
        console.error("Error al buscar la venta:", error);

        if (error.name === 'CastError') {
             return res.status(400).json({ error: "Formato de ID inválido." });
        }
        
        res.status(500).json({ error: "Error interno al procesar la venta." });
    }
});


router.post('/nueva', async (req, res) => {
    const { productos, usuario } = req.body;
    
    if (!productos || !usuario || productos.length === 0) {
        return res.status(400).json({ error: "Datos de venta incompletos (faltan productos o ID de usuario)." });
    }
    
    try {
        const result = await crearVentas({ productos, total: 0, usuario });
        res.status(201).json({ mensaje: "Venta creada exitosamente", venta: result });
    } catch (error) {
        console.error("Error al guardar la venta:", error.message);
        if (error.message.includes("no encontrado") || error.message.includes("inválido") || error.message.includes("inactivo")) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Error interno al procesar la venta." });
    }
});

router.delete("/eliminar/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const ventaEliminada = await eliminarVentaPorID(id);

        if (ventaEliminada) {
            res.status(200).json({ 
                mensaje: `Venta con ID ${id} eliminada exitosamente.`, 
                venta: ventaEliminada 
            });
        } else {
            res.status(404).json({ error: `No se encontró la venta con ID ${id} para eliminar.` });
        }
    } catch (error) {
        console.error("Error en DELETE /eliminar/:id:", error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: `El ID proporcionado (${id}) no tiene un formato válido.` });
        }
        
        res.status(500).json({ error: "Error interno del servidor al eliminar la venta." });
    }
});

export default router;