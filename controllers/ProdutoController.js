import Produto from '../models/Produto.js';
import { viewsPath } from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs/promises';

class ProdutoController {

    static async getAllProdutos(req, res) {
        try {
            const produtos = await Produto.findAll();
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
            const nome = req.body.nome || req.body.inputNomeProd;
            const descricao = req.body.descricao || req.body.inputDescricaoProd;
            const preco = req.body.preco || req.body.inputValorProd;
            const fabricante = req.body.fabricante || req.body.inputFabricanteProd;
            const imagem = req.file ? `/uploads/produtos/${req.file.filename}` : null;

            if (!nome || preco === undefined || !fabricante || !descricao || !imagem) {
                return res.status(400).json({ message: 'Nome, preço, fabricante, descrição e imagem são obrigatórios' });
            }

            const novoProduto = new Produto(nome, Number(preco), fabricante, descricao, imagem);
            const produtoSalvo = await novoProduto.save();

            return res.status(201).json(produtoSalvo);
        } catch (error) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(() => {});
            }
            console.error('Erro ao cadastrar produto:', error);
            return res.status(500).json({ message: 'Erro interno ao cadastrar o produto' });
        }
    }

    static async updateProduto(req, res) {
        try {
            const { id } = req.params;
            const dadosAtualizados = req.body;

            if (req.file) {
                dadosAtualizados.imagem = `/uploads/produtos/${req.file.filename}`;
            }

            if (dadosAtualizados.fabricante === undefined && dadosAtualizados.categoria !== undefined) {
                dadosAtualizados.fabricante = dadosAtualizados.categoria;
                delete dadosAtualizados.categoria;
            }

            if (dadosAtualizados.preco !== undefined) {
                dadosAtualizados.preco = Number(dadosAtualizados.preco);
            }

            const produtoAtualizado = await Produto.update(id, dadosAtualizados);

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
            const produtoRemovido = await Produto.delete(id);

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
            return res.sendFile(path.join(viewsPath, 'cadastrar-produto.html'));
        } catch (error) {
            console.error('Erro ao abrir página de cadastro:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }

    static async renderAllProdutos(req, res) {
        try {
            return res.sendFile(path.join(viewsPath, 'ver-produto.html'));
        } catch (error) {
            console.error('Erro ao carregar visualização de produtos:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }
}

export default ProdutoController;