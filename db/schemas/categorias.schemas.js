import mongoose from "mongoose";
const { Schema, models, model } = mongoose;

const CategoriaSchema = new Schema({
    nombre: { type: String, required: true, unique: true, uppercase: true },
})

const Categorias = models.categorias || model("categorias", CategoriaSchema);

export default Categorias