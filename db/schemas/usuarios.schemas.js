import mongoose from 'mongoose';
const { Schema, models, model} = mongoose;

const UsuarioSchema = new Schema({
    // El ID lo genera MongoDB automáticamente (_id)
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, // Asegura que el email sea único en la colección
        lowercase: true // Guarda el email en minúsculas
    },
    // La contraseña SIEMPRE debe estar hasheada
    contraseña: { type: String, required: true, select: false }, // 'select: false' evita que se devuelva en consultas normales
    usuario: { 
        type: String, 
        required: true, 
        unique: true // Asegura que el nombre de usuario sea único
    }
});

// Busca en todos los modelos si ya existe un modelo llamado "usuarios" y si no exite lo crea
const Usuarios = models.usuarios || model("usuarios", UsuarioSchema);

export default Usuarios;
