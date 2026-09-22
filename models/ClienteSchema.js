import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
    nome : { type: String, required: true, trim: true },
    email : { type: String, required: true, unique: true, lowercase: true, trim: true },
    senha : { type: String, required: true, trim: true }
},{
    timestamps: true
});

const ClienteModel = mongoose.model('Cliente', clienteSchema);

export default ClienteModel;