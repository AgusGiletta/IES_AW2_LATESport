import { connectToDatabase } from "../connection.db.js"
import Categorias from "../schemas/categorias.schemas.js"

export const crearCategorias = async (nombre) => {
 try {
    await connectToDatabase()
    const result = await Categorias.create({nombre})
    console.log(result)
    return result

 } catch (error) {
    console.error("Error en crearCategorias:", error);
    throw error;
 }
}

export const encontrarTodasLasCategorias = async () => {
    try {
        await connectToDatabase()
        const result = await Categorias.find()
        return result
    } catch (error) {
        console.error("Error en encontrarTodasLasCategorias:", error);
        throw error;
    }
}

export const actualizarCategoria = async (id, nuevoNombre) => {
    try {
        await connectToDatabase()
        const updatedCategory = await Categorias.findByIdAndUpdate(
            id,
            { nombre: nuevoNombre },
            { new: true } 
        )

        if (!updatedCategory) {
            const error = new Error(`Categoría con ID ${id} no encontrada para actualizar.`)
            error.status = 404
            throw error;
        }

        console.log("Categoría actualizada:", updatedCategory)
        return updatedCategory

    } catch (error) {
        console.error("Error en actualizarCategoria:", error);
        throw error;
    }
}

export const eliminarCategoria = async (id) => {
    try {
        await connectToDatabase()
        const deletedCategory = await Categorias.findByIdAndDelete(id)

        if (!deletedCategory) {
            const error = new Error(`Categoría con ID ${id} no encontrada para eliminar.`)
            error.status = 404
            throw error;
        }

        console.log("Categoría eliminada:", deletedCategory)
        return { message: "Categoría eliminada con éxito", deletedCategory };

    } catch (error) {
        console.error("Error en eliminarCategoria:", error);
        throw error;
    }
}