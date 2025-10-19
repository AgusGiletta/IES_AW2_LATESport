import { readFile } from "fs/promises";

let usuariosData = [];

try {
  const fileUsuarios = await readFile("./JSON/usuarios.json", "utf-8");
  usuariosData = JSON.parse(fileUsuarios);
} catch (error) {
  console.error("Error al leer el archivo JSON:", error);
}


export const get_user_byID = (id) => {
  return usuariosData.find((e) => e.id === id);
};