import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { crearUsuario, encontrarUsuarioParaLogin, encontrarUsuarioPorID,eliminarUsuarioPorID } from "../db/actions/usuarios.action.js"; 
import { eliminarVentasPorUsuarioID } from '../db/actions/ventas.actions.js';

const router = Router();
// esto usabaprimero const SECRET = "ctAYOYnzAZR11UiQrW6npjO1abdi_MhLKtsuR-fI77_BphZwmMlHJJYHnwpW4fzQ" 
const JWT_SECRET = process.env.JWT_SECRET; // nueva para dejar el jwt en .env

router.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    
    if (!email || !pass) {
        return res.status(400).json({ error: "Faltan email o contraseña." });
    }

    try {
        const userWithPass = await encontrarUsuarioParaLogin(email); 
        const isAuthenticated = userWithPass && bcrypt.compareSync(pass, userWithPass.contraseña);

        if (!isAuthenticated) {
            return res.status(400).json({ error: "Email o contraseña incorrectos" });
        }
        
        const { contraseña, ...payload } = userWithPass.toObject();
        // esta se usaba primero const token = jwt.sign(payload, SECRET, { expiresIn: 86400 }); 
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: 86400 }); 

        
        res.status(200).json({ token });
        
    } catch (error) {
        console.error("Error en POST /login:", error);
        res.status(500).json({ error: "Error interno del servidor durante el login." });
    }
});


router.get("/byID/:id", async (req, res) => {
    const id = req.params.id; 
    
    try {
        const result = await encontrarUsuarioPorID(id); 

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: `No se encontró el usuario con ID ${id}` });
        }
    } catch (error) {
        console.error("Error en GET /byID:", error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
             return res.status(400).json({ error: `El ID proporcionado (${id}) no tiene un formato válido.` });
        }
        
        res.status(500).json({ error: "Error interno del servidor al buscar el usuario." });
    }
});

router.post('/nuevo', async (req, res) => { 
    try {
        const { nombre, apellido, usuario, pass, email } = req.body; 

        if (!nombre || !apellido || !usuario || !pass || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios (nombre, apellido, usuario, pass, email)." });
        }

        const nuevoUsuario = await crearUsuario({ nombre, apellido, usuario, pass, email });

        res.status(201).json({ 
            mensaje: "Usuario creado correctamente", 
            usuario: nuevoUsuario 
        });
        
    } catch (error) {
        console.error("Error al crear usuario:", error.message);
        
        if (error.message.includes("El email o el nombre de usuario ya está registrado.")) {
            return res.status(409).json({ error: error.message });
        }

        res.status(500).json({ error: "Error interno al crear el usuario. Por favor, intente de nuevo.", detalle: error.message });
    }
});

router.delete("/eliminar/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        const resultadoVentas = await eliminarVentasPorUsuarioID(id);
        console.log(resultadoVentas.message); 

        const usuarioEliminado = await eliminarUsuarioPorID(id);

        if (!usuarioEliminado) {
            return res.status(404).json({ error: `No se encontró el usuario con ID ${id} para eliminar.` });
        }

        res.status(200).json({ 
            mensaje: `Usuario con ID ${id} eliminado exitosamente. (${resultadoVentas.deletedCount} ventas asociadas eliminadas)`, 
            usuario: usuarioEliminado 
        });

    } catch (error) {
        console.error(`Error en DELETE /eliminar/:id (Flujo de Integridad):`, error.message);
    
        if (error.message.includes('Error de Integridad')) {
            return res.status(409).json({ error: error.message });
        }

        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ error: `El ID proporcionado (${id}) no tiene un formato válido.` });
        }

        res.status(500).json({ error: error.message || "Error interno del servidor al eliminar el usuario." });
    }
});


export default router;