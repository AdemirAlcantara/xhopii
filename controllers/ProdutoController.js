import Produto from '../models/Produto.js';
import { viewsPath } from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs/promises';
import { requisicaoHtml, responderCadastro } from '../utils/responseUtils.js';

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

    static async renderCompra(req, res) {
        try {
            const produto = await Produto.findById(req.params.id);

            if (!produto) {
                return res.status(404).send('Produto não encontrado');
            }

            return res.render('comprar-produto', { produto, erro: null });
        } catch (error) {
            console.error('Erro ao abrir compra do produto:', error);
            return res.status(500).send('Erro interno ao carregar o produto');
        }
    }

    static async prepararCompra(req, res) {
        try {
            const produto = await Produto.findById(req.params.id);
            const quantidade = Number.parseInt(req.body.quantidade, 10);

            if (!produto) {
                return res.status(404).send('Produto não encontrado');
            }

            if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > produto.estoque) {
                return res.status(400).render('comprar-produto', {
                    produto,
                    erro: `Escolha uma quantidade entre 1 e ${produto.estoque}.`
                });
            }

            return res.render('confirmar-compra', { produto, quantidade });
        } catch (error) {
            console.error('Erro ao preparar compra:', error);
            return res.status(500).send('Erro interno ao preparar a compra');
        }
    }

    static async confirmarCompra(req, res) {
        try {
            const quantidade = Number.parseInt(req.body.quantidade, 10);

            if (!Number.isInteger(quantidade) || quantidade < 1) {
                return res.status(400).send('Quantidade de compra inválida');
            }

            const produtoAtualizado = await Produto.comprar(req.params.id, quantidade);

            if (!produtoAtualizado) {
                const produto = await Produto.findById(req.params.id);
                if (!produto) return res.status(404).send('Produto não encontrado');

                return res.status(409).render('comprar-produto', {
                    produto,
                    erro: 'Estoque insuficiente. A quantidade disponível foi atualizada.'
                });
            }

            return res.render('compra-realizada', { produto: produtoAtualizado, quantidade });
        } catch (error) {
            console.error('Erro ao confirmar compra:', error);
            return res.status(500).send('Erro interno ao confirmar a compra');
        }
    }

    static async renderHome(req, res) {
        try {
            const produtos = await Produto.findAll();
            return res.render('home', { produtos });
        } catch (error) {
            console.error('Erro ao carregar produtos da home:', error);
            return res.render('home', { produtos: [] });
        }
    }

    static async createProduto(req, res) {
        try {
            const nome = req.body.nome || req.body.inputNomeProd;
            const descricao = req.body.descricao || req.body.inputDescricaoProd;
            const preco = req.body.preco || req.body.inputValorProd;
            const fabricante = req.body.fabricante || req.body.inputFabricanteProd;
            const estoque = req.body.estoque ?? req.body.inputQtdProd ?? 0;
            const imagem = req.file ? `/uploads/produtos/${req.file.filename}` : null;

            if (!nome || preco === undefined || !fabricante || !descricao || !imagem || Number(estoque) < 0) {
                return responderCadastro(req, res, { status: 400, sucesso: false, voltar: '/produto/cadastrar', message: 'Nome, preço, fabricante, descrição, imagem e quantidade válida são obrigatórios.' });
            }

            const novoProduto = new Produto(nome, Number(preco), fabricante, descricao, imagem, Number(estoque));
            const produtoSalvo = await novoProduto.save();

            return responderCadastro(req, res, { status: 201, sucesso: true, voltar: '/produto/cadastrar', message: 'Produto cadastrado com sucesso.', data: produtoSalvo });
        } catch (error) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(() => {});
            }
            console.error('Erro ao cadastrar produto:', error);
            return responderCadastro(req, res, { status: 500, sucesso: false, voltar: '/produto/cadastrar', message: 'Não foi possível cadastrar o produto.' });
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

            if (dadosAtualizados.estoque !== undefined) {
                dadosAtualizados.estoque = Number(dadosAtualizados.estoque);
            }

            const produtoAtualizado = await Produto.update(id, dadosAtualizados);

            if (!produtoAtualizado) {
                return res.status(404).json({ message: 'Produto não encontrado para atualização' });
            }

            if (requisicaoHtml(req)) {
                return res.redirect('/produtos/visualizar');
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

            if (requisicaoHtml(req)) {
                return res.redirect('/produtos/visualizar');
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

    static async renderUpdateProduto(req, res) {
        const produto = await Produto.findById(req.params.id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        return res.render('atualizar-produto', { produto });
    }

    static async renderDeleteConfirmation(req, res) {
        const produto = await Produto.findById(req.params.id);

        if (!produto) {
            return res.status(404).send('Produto não encontrado');
        }

        return res.render('confirmar-exclusao', {
            objeto: produto.nome,
            action: `/produtos/${produto._id}/excluir`,
            voltar: '/produtos/visualizar'
        });
    }

    static async renderAllProdutos(req, res) {
        try {
            const produtos = await Produto.findAll();
            return res.render('visualizar-produto', { produtos });
        } catch (error) {
            console.error('Erro ao carregar visualização de produtos:', error);
            return res.render('visualizar-produto', { produtos: [] });
        }
    }
}

export default ProdutoController;