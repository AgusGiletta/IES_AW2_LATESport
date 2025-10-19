import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import { get_user_byID } from "../utils/usuarios.utils.js";
const fileVentas = await readFile("./JSON/ventas.json", "utf-8");
const ventasData = JSON.parse(fileVentas);

const router = Router();

// RUTAS DE USUARIOS
const fileUsuarios = await readFile("./JSON/usuarios.json", "utf-8");
const usuariosData = JSON.parse(fileUsuarios);

router.post("/login", (req, res) => {
  const { usuarioNombre, pass } = req.body;

  const result = usuariosData.find(
    (e) => e.usuario === usuarioNombre && e.contraseña === pass
  );

  if (result) {
    res.status(200).json({ mensaje: `Bienvenido ${result.nombre}!` });
  } else {
    res.status(400).json({ error: `${usuarioNombre} no se encuentra en la base de datos` });
  }
});

router.get("/byID/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const result = get_user_byID(id);

  if (result) {
    res.status(200).json(result);
  } else {
    res
      .status(400)
      .json({ error: `No se encontró el usuario con ID ${id}` });
  }
});

router.delete("/eliminar/:id", async (req, res) => {
    const id = parseInt(req.params.id);

    const tieneVentas = ventasData.some(v => v.id_usuario === id);
    if (tieneVentas) {
        return res.status(400).json({
            error: "No se puede eliminar este usuario. Tiene ventas asociadas."
        });
    }

    const index = usuariosData.findIndex(u => u.id === id);
    if (index === -1) {
        return res.status(404).json({ error: "Usuario no encontrado" });
    }

    usuariosData.splice(index, 1);
    await writeFile("./JSON/usuarios.json", JSON.stringify(usuariosData, null, 2));

    res.status(200).json({ mensaje: `Usuario con ID ${id} eliminado correctamente` });
});

router.post("/nuevo", async (req, res) => {
    try {
        const { nombre, apellido, usuario, contraseña, email } = req.body;

        if (!nombre || !apellido || !usuario || !contraseña || !email) {
            return res.status(400).json({ error: "Faltan datos obligatorios" });
        }

        // Verifica que el usuario no exista (por usuario o email)
        const existe = usuariosData.some(u => u.usuario === usuario || u.email === email);
        if (existe) {
            return res.status(400).json({ error: "El usuario o email ya existe" });
        }

        // Crea nuevo ID
        const nuevoId = usuariosData.length ? Math.max(...usuariosData.map(u => u.id)) + 1 : 1;

        const nuevoUsuario = { id: nuevoId, nombre, apellido, email, usuario, contraseña };
        usuariosData.push(nuevoUsuario);

        await writeFile("./JSON/usuarios.json", JSON.stringify(usuariosData, null, 2));

        res.status(201).json({ mensaje: "Usuario creado correctamente", usuario: nuevoUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear el usuario" });
    }
});

export default router;