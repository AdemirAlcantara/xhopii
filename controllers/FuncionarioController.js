import Funcionario from '../models/Funcionario.js';
import { viewsPath } from '../utils/pathUtils.js';
import path from 'path';
import fs from 'fs/promises';
import { requisicaoHtml, responderCadastro } from '../utils/responseUtils.js';

class FuncionarioController {

    static async getAll(req, res) {
        try {
            const funcionarios = await Funcionario.findAll();
            return res.status(200).json(funcionarios.map(funcionario => {
                const retorno = funcionario.toObject();
                delete retorno.senha;
                return retorno;
            }));
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar funcionários' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await Funcionario.findById(id);

            if (!funcionario) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
            const retorno = funcionario.toObject();
            delete retorno.senha;
            return res.status(200).json(retorno);
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar o funcionário' });
        }
    }

    static async create(req, res) {
        try {
            const nome = req.body.nome || req.body.inputNomeFunc;
            const sobrenome = req.body.sobrenome || req.body.inputSobrenomeFunc;
            const cpf = req.body.cpf || req.body.inputCPFFunc;
            const dataNascimento = req.body.dataNascimento || req.body.inputDataNascFunc;
            const telefone = req.body.telefone || req.body.inputTelefoneFunc;
            const cargo = req.body.cargo || req.body.inputCargoFunc;
            const salario = req.body.salario || req.body.inputSalarioFunc;
            const email = req.body.email || req.body.inputEmailFunc;
            const senha = req.body.senha || req.body.inputSenha;
            const imagem = req.file ? `/uploads/perfis/${req.file.filename}` : null;

            if (!nome || !sobrenome || !cpf || !dataNascimento || !telefone || !cargo || salario === undefined || !email || !senha) {
                return responderCadastro(req, res, { status: 400, sucesso: false, voltar: '/funcionario/cadastrar', message: 'Todos os campos do funcionário são obrigatórios.' });
            }

            const novoFuncionario = new Funcionario({ nome, sobrenome, cpf, dataNascimento, telefone, cargo, salario: Number(salario), email, senha, imagem });
            const funcionarioSalvo = await novoFuncionario.save();
            return responderCadastro(req, res, { status: 201, sucesso: true, voltar: '/funcionario/cadastrar', message: 'Funcionário cadastrado com sucesso.', data: funcionarioSalvo });
        } catch (error) {
            if (req.file) await fs.unlink(req.file.path).catch(() => {});
            console.error('Erro ao cadastrar funcionário:', error);
            return responderCadastro(req, res, { status: 500, sucesso: false, voltar: '/funcionario/cadastrar', message: 'Não foi possível cadastrar o funcionário.' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, sobrenome, cpf, dataNascimento, telefone, cargo, salario, email, senha } = req.body;

            const dadosAtualizacao = {};
            if (nome) dadosAtualizacao.nome = nome;
            if (sobrenome) dadosAtualizacao.sobrenome = sobrenome;
            if (cpf) dadosAtualizacao.cpf = cpf;
            if (dataNascimento) dadosAtualizacao.dataNascimento = dataNascimento;
            if (telefone) dadosAtualizacao.telefone = telefone;
            if (cargo) dadosAtualizacao.cargo = cargo;
            if (salario !== undefined) dadosAtualizacao.salario = Number(salario);
            if (email) dadosAtualizacao.email = email;
            if (senha) dadosAtualizacao.senha = senha;
            if (req.file) dadosAtualizacao.imagem = `/uploads/perfis/${req.file.filename}`;

            const funcionarioAtualizado = await Funcionario.update(id, dadosAtualizacao);

            if (!funcionarioAtualizado) {
                return res.status(404).json({ message: 'Funcionário não encontrado para atualização' });
            }

            const retorno = funcionarioAtualizado.toObject();
            delete retorno.senha;
            if (requisicaoHtml(req)) {
                return res.redirect('/funcionarios/visualizar');
            }
            return res.status(200).json(retorno);
        } catch (error) {
            if (req.file) await fs.unlink(req.file.path).catch(() => {});
            console.error('Erro ao atualizar funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar o funcionário' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const funcionarioRemovido = await Funcionario.delete(id);

            if (!funcionarioRemovido) {
                return res.status(404).json({ message: 'Funcionário não encontrado para exclusão' });
            }

            if (requisicaoHtml(req)) {
                return res.redirect('/funcionarios/visualizar');
            }
            return res.status(200).json({ message: 'Funcionário removido com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao excluir o funcionário' });
        }
    }

    static async renderCreate(req, res) {
        try {
            return res.sendFile(path.join(viewsPath, 'cadastrar-funcionario.html'));
        } catch (error) {
            console.error('Erro ao abrir página de cadastro de funcionário:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }

    static async renderUpdate(req, res) {
        const funcionario = await Funcionario.findById(req.params.id);

        if (!funcionario) {
            return res.status(404).send('Funcionário não encontrado');
        }

        return res.render('atualizar-funcionario', { funcionario });
    }

    static async renderDeleteConfirmation(req, res) {
        const funcionario = await Funcionario.findById(req.params.id);

        if (!funcionario) {
            return res.status(404).send('Funcionário não encontrado');
        }

        return res.render('confirmar-exclusao', {
            objeto: `${funcionario.nome} ${funcionario.sobrenome}`,
            action: `/funcionarios/${funcionario._id}/excluir`,
            voltar: '/funcionarios/visualizar'
        });
    }

    static async renderAll(req, res) {
        try {
            const funcionarios = await Funcionario.findAll();
            return res.render('visualizar-funcionario', { funcionarios });
        } catch (error) {
            console.error('Erro ao carregar visualização de funcionários:', error);
            return res.render('visualizar-funcionario', { funcionarios: [] });
        }
    }
}

export default FuncionarioController;