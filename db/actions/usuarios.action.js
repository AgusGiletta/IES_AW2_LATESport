import { connectToDatabase } from "../connection.db.js"; 
import Usuarios from "../schemas/usuarios.schemas.js"; 
import Venta from '../schemas/ventas.schemas.js';
import bcrypt from "bcryptjs";

export const crearUsuario = async ({ nombre, apellido, usuario, pass, email }) => {
    try {
        await connectToDatabase();
        
        // 1. Hashear la contraseña antes de guardar
        const hashedPassword = bcrypt.hashSync(pass, 8); 
        
        const nuevoUsuario = await Usuarios.create({
            nombre,
            apellido,
            usuario,
            email: email.toLowerCase(), 
            contraseña: hashedPassword
        });
        
        const usuarioLimpio = nuevoUsuario.toObject();
        delete usuarioLimpio.contraseña;
        
        return usuarioLimpio;
        
    } catch (error) {
        console.error("Error en crearUsuario:", error);
        if (error.code === 11000) {
             throw new Error("El email o el nombre de usuario ya está registrado.");
        }
        throw error;
    }
};

export const encontrarUsuarioParaLogin = async (email) => {
    try {
        await connectToDatabase();
        
        const usuario = await Usuarios.findOne({ email: email.toLowerCase() })
                                       .select('+contraseña'); 

        return usuario; 
        
    } catch (error) {
        console.error("Error en encontrarUsuarioParaLogin:", error);
        throw error;
    }
};

export const encontrarUsuarioPorID = async (id) => {
    try {
        await connectToDatabase();
    
        const usuario = await Usuarios.findById(id); 

        if (!usuario) {
            return null;
        }
        return usuario.toObject(); 
        
    } catch (error) {
        console.error("Error en encontrarUsuarioPorID:", error);
        throw error;
    }
};

export const encontrarTodosLosUsuarios = async () => {
    try {
        await connectToDatabase();
        const usuarios = await Usuarios.find({});
        return usuarios;
    } catch (error) {
        console.error("Error en encontrarTodosLosUsuarios:", error);
        throw error;
    }
};

export const eliminarUsuarioPorID = async (id) => {
    try {
        await connectToDatabase();
        const usuarioEliminado = await Usuarios.findByIdAndDelete(id).lean();

        if (!usuarioEliminado) {
            return null;
        }

        return usuarioEliminado;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw error;
    }
};