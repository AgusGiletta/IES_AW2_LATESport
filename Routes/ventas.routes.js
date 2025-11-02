import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_user_byID } from '../Utils/usuarios.utils.js'

const router = Router()
const VENTAS_FILE_PATH = './JSON/ventas.json';

const getVentasData = async () => {
    try {
        const fileVentas = await readFile(VENTAS_FILE_PATH, 'utf-8');
        return JSON.parse(fileVentas);
    } catch (error) {
        res.status (400).json('Archivo de ventas no encontrado')
        return [];
    }
}
router.get('/all', async (req, res) => { 
    const ventasData = await getVentasData(); 

    if (ventasData.length) {
        res.status(200).json(ventasData);
    } else {
        res.status(404).json('No hay ventas'); 
    }
});

router.get("/byDate/:from/:to", async (req, res) => { 
    const ventasData = await getVentasData(); 
    
    const fromDate = new Date(req.params.from);
    const toDate = new Date(req.params.to);

    const result = ventasData.filter(e => {
        const ventaDate = new Date(e.fecha);
        const finalToDate = new Date(toDate.getTime() + 86400000);
        return ventaDate >= fromDate && ventaDate <= finalToDate; 
    });

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(404).json(`No hay ventas entre ${req.params.from} y ${req.params.to}`); 
    }
});
router.post("/detail", async (req, res) => { 
    const ventasData = await getVentasData(); 

    const from = req.body.from;
    const to = req.body.to;

    try {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        const finalToDate = new Date(toDate.getTime() + 86400000);

        const ventasFiltradas = ventasData.filter(e => {
            const ventaDate = new Date(e.fecha);
            return ventaDate >= fromDate && ventaDate <= finalToDate;
        });

        const result = ventasFiltradas.map(e => {
            let vendedor = get_user_byID(e.id_usuario); 
            if (vendedor) {
                vendedor = vendedor.nombre + " " + vendedor.apellido;
            } else {
                vendedor = "Desconocido";
            }

            return {
                id_venta: e.id,
                id_usuario: e.id_usuario,
                total: e.total,
                fecha: e.fecha,
                productos: e.productos,
                vendedor: vendedor
            };
        });

        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(404).json(`No hay ventas entre ${from} y ${to}`); // 💡 404
        }

    } catch (error) {
        console.error(error);
        res.status(500).json("Error al buscar las ventas");
    }
});


router.delete("/eliminar/:id", async (req, res) => {
    const ventasData = await getVentasData(); 

    const id = parseInt(req.params.id);

    const index = ventasData.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Venta no encontrada" });
    }

    ventasData.splice(index, 1);
    await writeFile(VENTAS_FILE_PATH, JSON.stringify(ventasData, null, 2));

    res.status(200).json({ mensaje: `Venta con ID ${id} eliminada correctamente` });
});


router.post('/nueva', async (req, res) => {
    const ventasData = await getVentasData(); 
    const { id_usuario, productos } = req.body; 

    if (!id_usuario || !productos || productos.length === 0) {
        return res.status(400).json({ error: "Datos de venta incompletos (requiere id_usuario y productos)." });
    }
    
    const newId = ventasData.length ? Math.max(...ventasData.map(v => v.id)) + 1 : 1;
    const total = productos.reduce((sum, p) => sum + p.total, 0); 
    
    const nuevaVenta = {
        id: newId,
        id_usuario: id_usuario,
        productos: productos,
        total: total,
        fecha: new Date().toISOString()
    };
    
    ventasData.push(nuevaVenta);

    try {
        await writeFile(VENTAS_FILE_PATH, JSON.stringify(ventasData, null, 2)); 
        res.status(201).json({ 
            mensaje: "Orden de compra generada exitosamente", 
            orden: nuevaVenta 
        });
    } catch (error) {
        console.error("Error al guardar la venta:", error);
        res.status(500).json({ error: "Error interno al procesar la venta." });
    }
}); 

// exportar las rutas
export default router