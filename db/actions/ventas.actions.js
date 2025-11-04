import { connectToDatabase } from "../connection.db.js"; 
import Venta from '../schemas/ventas.schemas.js';

export const crearVentas = async ({ productos, total: totalNoUsado, usuario }) => {
    const totalCalculado = productos.reduce((acc, item) => {
        
        const cantidad = parseFloat(item.cantidad) || 0; 
        const precio = parseFloat(item.precioUnitario) || 0; 
        
        return acc + (cantidad * precio);

    }, 0); 

    const totalFinal = parseFloat(totalCalculado.toFixed(2));

    const nuevaVenta = new Venta({
        productos,
        total: totalFinal, 
        usuario,
        fecha: new Date(),
    });

    return await nuevaVenta.save();
};

export const encontrarVentas = async () => {
    return await Venta.find()
        .populate('usuario', 'nombre apellido email') 
        .populate('productos.productoId', 'nombre precio descripcion') 
        .sort({ fecha: -1 }); // Ordenar por fecha descendente
};

export const encontrarVentasporId = async (id) => {
    return await Venta.findById(id)
        .populate('usuario', 'nombre apellido email')
        .populate('productos.productoId', 'nombre precio descripcion');
};

export const eliminarVentaPorID = async (id) => {
    try {
        await connectToDatabase(); 
        const ventaEliminada = await Venta.findByIdAndDelete(id).lean(); 
        
        return ventaEliminada;
    } catch (error) {
        console.error("Error en eliminarVentaPorID:", error);
        throw error;
    }
};

export const eliminarVentasPorUsuarioID = async (usuarioId) => {
    try {
        await connectToDatabase();
        
        const resultado = await Venta.deleteMany({ 'usuario.id': usuarioId });

        console.log(`Éxito al eliminar ${resultado.deletedCount} ventas del usuario ID: ${usuarioId}`);

        return { 
            message: `Se eliminaron ${resultado.deletedCount} ventas asociadas.`,
            deletedCount: resultado.deletedCount
        };
        
    } catch (error) {
        console.error("Error en eliminarVentasPorUsuarioID:", error);
        throw error;
    }
};
