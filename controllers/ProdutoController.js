import Produto from '../models/Produto.js';

class ProdutoController {

    static async getAllProdutos(req, res) {
        try {
            const produtos = await Produto.find();
            return res.status(200).json(produtos);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar produtos' });
        }
    }

    static async getProdutoById(req, res) {
        try {
            const { id } = req.params;
            const produto = await Produto.findById(id);

            if (!produto) {
                return res.status(404).json({ message: 'Produto não encontrado' });
            }
            return res.status(200).json(produto);
        } catch (error) {
            console.error('Erro ao buscar o produto:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar o produto' });
        }
    }

    static async createProduto(req, res) {
        try {
            const { nome, descricao, preco, estoque, imagem } = req.body;

            if (!nome || !preco) {
                return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
            }

            const novoProduto = new Produto({ nome, descricao, preco, estoque, imagem });
            await novoProduto.save();

            return res.status(201).json(novoProduto);
        } catch (error) {
            console.error('Erro ao cadastrar produto:', error);
            return res.status(500).json({ message: 'Erro interno ao cadastrar o produto' });
        }
    }

    static async updateProduto(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;

            const produtoAtualizado = await Produto.findByIdAndUpdate(
                id,
                dadosAtualizados,
                { new: true, runValidators: true }
            );

            if (!produtoAtualizado) {
                return res.status(404).json({ message: 'Produto não encontrado para atualização' });
            }

            return res.status(200).json(produtoAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar produto:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar produto' });
        }
    }

    static async deleteProduto(req, res) {
        try {
            const { id } = req.params;
            const produtoRemovido = await Produto.findByIdAndDelete(id);

            if (!produtoRemovido) {
                return res.status(404).json({ message: 'Produto não encontrado para exclusão' });
            }

            return res.status(200).json({ message: 'Produto excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            return res.status(500).json({ message: 'Erro interno ao excluir produto' });
        }
    }

    static async renderCreateProduto(req, res) {
        try {
            return res.render('cadastrar-produto');
        } catch (error) {
            console.error('Erro ao abrir página de cadastro:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }

    static async renderAllProdutos(req, res) {
        try {
            const produtos = await Produto.find();
            return res.render('visualizar-produtos', { produtos });
        } catch (error) {
            console.error('Erro ao carregar visualização de produtos:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }
}

export default ProdutoController;