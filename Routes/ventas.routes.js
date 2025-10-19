// importar Router para utilizar funciones propias de las rutas
import { Router } from "express"
import { readFile, writeFile } from 'fs/promises'
import { get_user_byID } from '../utils/usuarios.utils.js'
import { get } from "http"

const router = Router()

/* RUTAS DE VENTAS */
const fileVentas = await readFile ('./JSON/ventas.JSON', 'utf-8')
const ventasData = JSON.parse(fileVentas)

router.get('/all', (req, res) => {

    if (ventasData.length) {
        res.status (200).json (ventasData)
    } else {
        res.status (400).json('No hay ventas')
    }
})

// get pasa los parameros en el url
router.get("/byDate/:from/:to", (req, res) => {
    const fromDate = new Date(req.params.from);
    const toDate = new Date(req.params.to);

    const result = ventasData.filter(e => {
        const ventaDate = new Date(e.fecha);
        return ventaDate >= fromDate && ventaDate <= toDate;
    });

    if (result.length > 0) {
        res.status(200).json(result);
    } else {
        res.status(400).json(`No hay ventas entre ${req.params.from} y ${req.params.to}`);
    }
});

// post pasa los parametros en el body
router.post("/detail", (req, res) => {
    const from = req.body.from;
    const to = req.body.to;

    try {
        const fromDate = new Date(from);
        const toDate = new Date(to);

        const ventasFiltradas = ventasData.filter(e => {
            const ventaDate = new Date(e.fecha);
            return ventaDate >= fromDate && ventaDate <= toDate;
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
            res.status(400).json(`No hay ventas entre ${from} y ${to}`);
        }

    } catch (error) {
        console.error(error);
        res.status(500).json("Error al buscar las ventas");
    }
});

router.delete("/eliminar/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const index = ventasData.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Venta no encontrada" });
    }

    ventasData.splice(index, 1);
    await writeFile("./JSON/ventas.json", JSON.stringify(ventasData, null, 2));

    res.status(200).json({ mensaje: `Venta con ID ${id} eliminada correctamente` });
});

// exportar las rutas
export default router