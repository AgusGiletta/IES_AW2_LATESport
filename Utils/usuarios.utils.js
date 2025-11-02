import { readFile } from "fs/promises";
const JSON_PATH = "./JSON/usuarios.json";

let usuariosData = [];

export const getUsuariosData = async () => {
    try {
        const fileUsuarios = await readFile(JSON_PATH, "utf-8");
        return JSON.parse(fileUsuarios);
    } catch (error) {
        console.error("Error al leer el archivo de usuarios:", error); 
        return []; 
    }
};

export const get_user_byID = async (id) => {
    const usuariosData = await getUsuariosData();
    return usuariosData.find((e) => e.id === id);
};
