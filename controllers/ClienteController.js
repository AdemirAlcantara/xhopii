import Cliente from '../models/Cliente.js';
import { viewsPath } from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs/promises';
import { requisicaoHtml, responderCadastro } from '../utils/responseUtils.js';

class ClienteController {

    static async getAll(req, res) {
        try {
            const clientes = await Cliente.findAll();
            return res.status(200).json(clientes.map(cliente => {
                const retorno = cliente.toObject();
                delete retorno.senha;
                return retorno;
            }));
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar clientes' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cliente = await Cliente.findById(id);

            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            const clienteRetorno = cliente.toObject();
            delete clienteRetorno.senha;
            return res.status(200).json(clienteRetorno);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar o cliente' });
        }
    }

    static async create(req, res) {
        try {
            const { nome, sobrenome, cpf, dataNascimento, telefone, email, senha } = req.body;
            const imagem = req.file ? `/uploads/perfis/${req.file.filename}` : null;

            if (!nome || !sobrenome || !cpf || !dataNascimento || !telefone || !email || !senha) {
                return responderCadastro(req, res, { status: 400, sucesso: false, voltar: '/clientes/cadastrar', message: 'Nome, sobrenome, CPF, data de nascimento, telefone, e-mail e senha são obrigatórios' });
            }

            const clienteExistente = await Cliente.findByEmail(email);
            if (clienteExistente) {
                return responderCadastro(req, res, { status: 409, sucesso: false, voltar: '/clientes/cadastrar', message: 'Já existe um cliente cadastrado com este e-mail' });
            }

            const novoCliente = new Cliente({ nome, sobrenome, cpf, dataNascimento, telefone, email, senha, imagem });
            const clienteSalvo = await novoCliente.save();

            const clienteRetorno = clienteSalvo.toObject();
            delete clienteRetorno.senha;

            return responderCadastro(req, res, { status: 201, sucesso: true, voltar: '/clientes/cadastrar', message: 'Cliente cadastrado com sucesso.', data: clienteRetorno });
        } catch (error) {
            if (req.file) await fs.unlink(req.file.path).catch(() => {});
            console.error('Erro ao cadastrar cliente:', error);
            return responderCadastro(req, res, { status: 500, sucesso: false, voltar: '/clientes/cadastrar', message: 'Não foi possível cadastrar o cliente.' });
        }
    }

    static async login(req, res) {
        try {
            const email = req.body.email || req.body.inputEmailLog;
            const senha = req.body.senha || req.body.inputSenhaLog;

            if (!email || !senha) {
                return res.status(400).json({ message: 'E-mail e senha são obrigatórios' });
            }

            const cliente = await Cliente.findByEmail(email);
            if (!cliente || cliente.senha !== senha) {
                return res.status(401).json({ message: 'E-mail ou senha inválidos' });
            }

            return res.redirect('/');
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            return res.status(500).json({ message: 'Erro interno ao realizar login' });
        }
    }

    static async recoverPassword(req, res) {
        try {
            const email = req.body.email || req.body.inputEmailLog;

            if (!email) {
                return res.status(400).json({ message: 'E-mail é obrigatório' });
            }

            await Cliente.findByEmail(email);
            return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, as instruções serão enviadas.' });
        } catch (error) {
            console.error('Erro ao recuperar senha:', error);
            return res.status(500).json({ message: 'Erro interno ao recuperar senha' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, sobrenome, cpf, dataNascimento, telefone, email, senha } = req.body;
            const dadosAtualizacao = {};

            if (nome) dadosAtualizacao.nome = nome;
            if (sobrenome) dadosAtualizacao.sobrenome = sobrenome;
            if (cpf) dadosAtualizacao.cpf = cpf;
            if (dataNascimento) dadosAtualizacao.dataNascimento = dataNascimento;
            if (telefone) dadosAtualizacao.telefone = telefone;
            if (email) dadosAtualizacao.email = email;
            if (senha) dadosAtualizacao.senha = senha;
            if (req.file) dadosAtualizacao.imagem = `/uploads/perfis/${req.file.filename}`;

            const clienteAtualizado = await Cliente.update(
                id,
                dadosAtualizacao
            );

            if (!clienteAtualizado) {
                return res.status(404).json({ message: 'Cliente não encontrado para atualização' });
            }

            const clienteRetorno = clienteAtualizado.toObject();
            delete clienteRetorno.senha;
            if (requisicaoHtml(req)) {
                return res.redirect('/clientes/visualizar');
            }
            return res.status(200).json(clienteRetorno);
        } catch (error) {
            if (req.file) await fs.unlink(req.file.path).catch(() => {});
            console.error('Erro ao atualizar cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar o cliente' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const clienteRemovido = await Cliente.delete(id);

            if (!clienteRemovido) {
                return res.status(404).json({ message: 'Cliente não encontrado para exclusão' });
            }

            if (requisicaoHtml(req)) {
                return res.redirect('/clientes/visualizar');
            }
            return res.status(200).json({ message: 'Cliente removido com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao excluir o cliente' });
        }
    }

    static async renderCreate(req, res) {
        try {
            return res.sendFile(path.join(viewsPath, 'cadastrar-cliente.html'));
        } catch (error) {
            console.error('Erro ao abrir página de cadastro de cliente:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }

    static async renderUpdate(req, res) {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).send('Cliente não encontrado');
        }

        return res.render('atualizar-cliente', { cliente });
    }

    static async renderDeleteConfirmation(req, res) {
        const cliente = await Cliente.findById(req.params.id);

        if (!cliente) {
            return res.status(404).send('Cliente não encontrado');
        }

        return res.render('confirmar-exclusao', {
            objeto: `${cliente.nome} ${cliente.sobrenome}`,
            action: `/clientes/${cliente._id}/excluir`,
            voltar: '/clientes/visualizar'
        });
    }

    static async renderAll(req, res) {
        try {
            const clientes = await Cliente.findAll();
            return res.render('visualizar-cliente', { clientes });
        } catch (error) {
            console.error('Erro ao carregar visualização de clientes:', error);
            return res.render('visualizar-cliente', { clientes: [] });
        }
    }
}

export default ClienteController;