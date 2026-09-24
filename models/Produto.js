import ProdutoModel from './ProdutoSchema.js';

class Produto {

    constructor(nome, preco, fabricante, descricao, imagem, estoque = 0) {
        this.nome = nome;
        this.preco = preco;
        this.fabricante = fabricante;
        this.descricao = descricao;
        this.imagem = imagem;
        this.estoque = estoque;
    }

    async save() {
        const novoProduto = new ProdutoModel({
            nome: this.nome,
            preco: this.preco,
            fabricante: this.fabricante,
            descricao: this.descricao,
            imagem: this.imagem,
            estoque: this.estoque
        });

        return await novoProduto.save();
    }

    static async findAll() {
        return await ProdutoModel.find();
    }

    static async findById(id) {
        return await ProdutoModel.findById(id);
    }

    static async update(id, dadosAtualizados) {
        return await ProdutoModel.findByIdAndUpdate(
            id,
            dadosAtualizados,
            { returnDocument: 'after', runValidators: true }
        );
    }

    static async comprar(id, quantidade) {
        return await ProdutoModel.findOneAndUpdate(
            { _id: id, estoque: { $gte: quantidade } },
            { $inc: { estoque: -quantidade } },
            { returnDocument: 'after', runValidators: true }
        );
    }

    static async delete(id) {
        return await ProdutoModel.findByIdAndDelete(id);
    }
}

export default Produto;