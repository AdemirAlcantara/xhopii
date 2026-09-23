import ProdutoModel from './ProdutoSchema.js';

class Produto {

    constructor(nome, preco, fabricante, descricao, imagem) {
        this.nome = nome;
        this.preco = preco;
        this.fabricante = fabricante;
        this.descricao = descricao;
        this.imagem = imagem;
    }

    async save() {
        const novoProduto = new ProdutoModel({
            nome: this.nome,
            preco: this.preco,
            fabricante: this.fabricante,
            descricao: this.descricao,
            imagem: this.imagem
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
            { new: true, runValidators: true }
        );
    }

    static async delete(id) {
        return await ProdutoModel.findByIdAndDelete(id);
    }
}

export default Produto;