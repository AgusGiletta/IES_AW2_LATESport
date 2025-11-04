import mongoose from 'mongoose';
const { Schema, models, model} = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductoSchema = new Schema({
    // el id se genera solo en la base de datos
    nombre: { type: String, required: true },
    categoria: { 
        type: ObjectId, 
        required: true, 
        ref: "categorias" // Esto establece la relación (foreign key)
    },
    desc: { type: String, required: true },
    tipo: { type: String, required: true },
    talla: { type: String, required: false },
    color: { type: String, required: false },
    precio: { type: Number, required: true },
    imagen: { type: String, required: false }, // VER!
    activo: { type: Boolean, required: true }
})

// busca en todos los modelos de la bdd si ya existe un modelo llamado "Productos" y si no exite lo crea
const Productos = models.productos || model("productos", ProductoSchema)

export default Productos