import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const ObjectId = mongoose.Schema.Types.ObjectId;

const ProductoVendidoSchema = new Schema({
    productoId: { type: ObjectId, required: true, ref: "productos" }, 
    
    cantidad: { type: Number, required: true, min: 1 },
    precioUnitario: { type: Number, required: true, min: 0 },
    
    nombre: { type: String, required: true },
    descripcion: { type: String },
    imagen: { type: String },
}, { _id: false }); 

const UsuarioVentaSchema = new Schema({
    id: { type: ObjectId, required: true, ref: "usuarios" }, 
    
    nombre: { type: String },
    email: { type: String, required: true }
}, { _id: false }); 

const VentaSchema = new Schema({
    productos: { type: [ProductoVendidoSchema], required: true }, 
    
    total: { type: Number, required: true, min: 0 },
    usuario: { 
        type: UsuarioVentaSchema,
        required: true, 
    }
}, { timestamps: true });

const Ventas = models.ventas || model("ventas", VentaSchema);

export default Ventas
