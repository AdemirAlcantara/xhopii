import ProdutoModel from './Produto.js';

class Produto {

    contructor(nome, preco, categoria, descricao, imagem) {
        this.nome = nome;
        this.preco = preco;
        this.categoria = categoria;
        this.descricao = descricao;
        this.imagem = imagem;
    }
}

export default Produto;