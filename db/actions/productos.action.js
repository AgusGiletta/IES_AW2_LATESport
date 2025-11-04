import { connectToDatabase } from "../connection.db.js"
import Productos from "../schemas/productos.schemas.js"
import Categorias from "../schemas/categorias.schemas.js"
import mongoose from 'mongoose'; 
const ObjectId = mongoose.Types.ObjectId; 

export const crearProductos = async ({nombre, categoria, desc, tipo, talla, color, precio, imagen, activo}) => {
    try {
        await connectToDatabase() 
        
        let categoriaDoc;
        if (ObjectId.isValid(categoria)) {
            categoriaDoc = await Categorias.findById(categoria);
        } else {
            categoriaDoc = await Categorias.findOne({ nombre: categoria.toUpperCase() });
        }
        
        if (!categoriaDoc) {
            throw new Error(`Categoría con ID/Nombre '${categoria}' no encontrada. Asegúrate de crearla primero.`);
        }

        const result = await Productos.create({
            nombre,
            categoria: categoriaDoc._id, 
            desc,
            tipo, 
            talla, 
            color,
            precio,
            imagen: imagen || "",
            activo: activo !== undefined ? Boolean(activo) : true 
        })
            
        console.log(result)
        return result

    } catch (error) {
        console.error("Error en crearProductos:", error)
        if (error.message.includes('Categoría')) {
            throw { error: "Error de validación al crear el producto", detalle: error.message };
        }
        throw { error: "Error interno al crear el producto", detalle: error.message };
    }
}

export const encontrarTodosLosProductos = async () => {
    try {
        await connectToDatabase()
       const result = await Productos.find({ activo: true })
            .populate({
                path: 'categoria'
            });
        return result
    } catch (error) {
        console.log(error)
    }
}

export const encontrarTodosLosProductosporID = async (id) => {
    try {
        await connectToDatabase()
        const result = await Productos.findById(id)
            .populate({
                path: 'categoria'
            });
        return result
    } catch (error) {
        console.log(error)
    }
}

export const encontrarTodosLosProductosporCategoria = async (categoria) => {
    try {
        await connectToDatabase()
      
        const categoriaDoc = await Categorias.findOne({ nombre: categoria.toUpperCase() });
        
        if (!categoriaDoc) {
             return [];
        }

        const result = await Productos.find({ 
            categoria: categoriaDoc._id, 
            activo: true 
        }).populate({path:'categoria'})

        return result
    } catch (error) {
        console.error("Error al buscar productos por categoría:", error)
        throw error; 
    }
}

export const encontrarProductoPorNombre = async (nombre) => {
    try {
        await connectToDatabase();
        const result = await Productos.findOne({ nombre })
            .populate({
                path: 'categoria'
            });
        return result;
    } catch (error) {
        console.error("Error al buscar producto por nombre:", error);
        throw error; 
    }
}

export const modificarPrecio = async (id, precio) => {
    try {
        await connectToDatabase()
        
        const result = await Productos.findByIdAndUpdate(
            id, 
            { precio },
            { new: true } 
        )
        
        if (!result) {
            throw new Error(`Producto con ID ${id} no encontrado.`); 
        }
        
        return result
    } catch (error) {
        console.error("Error al modificar precio:", error);
        throw error;
    }
}

export const eliminarById = async (id) => {
    try {
        await connectToDatabase();
        
        const result = await Productos.findByIdAndDelete(id);

        if (!result) {
            throw new Error(`Producto con ID ${id} no encontrado para eliminar.`);
        }
        
        return result; 
        
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        throw error; 
    }
}

