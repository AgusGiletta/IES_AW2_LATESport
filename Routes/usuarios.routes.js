import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { get_user_byID, getUsuariosData } from "../Utils/usuarios.utils.js"; 

const router = Router();
const JSON_PATH = "./JSON/usuarios.json";


router.post("/login", async (req, res) => {
    const { email, pass } = req.body;
    const usuariosData = await getUsuariosData(); 

    const result = usuariosData.find(
        (e) => e.email === email && e.contraseña === pass
    );

    if (result) {
        const { contraseña, ...usuarioSinPass } = result;
        res.status(200).json({
            mensaje: `Bienvenido/a ${result.nombre}!`,
            usuario: usuarioSinPass
        });
    } else {
        res.status(400).json({ error: "Email o contraseña incorrectos" });
    }
});

router.get("/byID/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const result = await get_user_byID(id); 

    if (result) {
        const { contraseña, ...usuarioSinPass } = result;
        res.status(200).json(usuarioSinPass);
    } else {
        res
            .status(400)
            .json({ error: `No se encontró el usuario con ID ${id}` });
    }
});

router.delete("/eliminar/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    let usuariosData = await getUsuariosData();

    try {
        const fileVentas = await readFile("./JSON/ventas.json", "utf-8");
        const ventasData = JSON.parse(fileVentas);

        const tieneVentas = ventasData.some(v => v.id_usuario === id);
        if (tieneVentas) {
            return res.status(400).json({
                error: "No se puede eliminar este usuario. Tiene ventas asociadas."
            });
        }
    } catch (error) {
         console.warn("Advertencia: No se pudo leer el archivo de ventas. Asumiendo que no hay ventas asociadas.");
    }
    
    
    const index = usuariosData.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuariosData.splice(index, 1);
    await writeFile(JSON_PATH, JSON.stringify(usuariosData, null, 2));

    res.status(200).json({ mensaje: `Usuario con ID ${id} eliminado correctamente` });
});

router.post("/nuevo", async (req, res) => {
    try {
        const { nombre, apellido, usuario, contraseña, email } = req.body;

        let usuariosData = await getUsuariosData(); 

        if (!nombre || !apellido || !usuario || !contraseña || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        const existe = usuariosData.some(u => u.usuario === usuario || u.email === email);
        if (existe) {
            return res.status(400).json({ error: "El usuario o email ya existe" });
        }

        const nuevoId = usuariosData.length ? Math.max(...usuariosData.map(u => u.id)) + 1 : 1;

        const nuevoUsuario = { id: nuevoId, nombre, apellido, email, usuario, contraseña };
        usuariosData.push(nuevoUsuario);

        await writeFile(JSON_PATH, JSON.stringify(usuariosData, null, 2));

        const { contraseña: _, ...usuarioResponse } = nuevoUsuario;

        res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: usuarioResponse });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ error: "Error interno al crear el usuario. Por favor, intente de nuevo." });
    }
});

export default router;