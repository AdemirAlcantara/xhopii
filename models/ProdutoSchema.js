import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
    nome: { type: String, required: true, trim: true },
    preco: {type: Number, required: true, trim: true },
    fabricante: { type: String, required: true, trim: true },
    descricao: { type: String, required: true, trim: true },
    imagem: { type: String, required: true, trim: true }
}, {
    timestamps: true
});

const ProdutoModel = mongoose.model('Produto', ProdutoSchema);

export default ProdutoModel;