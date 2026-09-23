import Funcionario from '../models/Funcionario.js';

class FuncionarioController {

    // ==========================================
    // MÉTODOS DA API RESTful (JSON)
    // ==========================================

    static async getAll(req, res) {
        try {
            const funcionarios = await FuncionarioModel.find();
            return res.status(200).json(funcionarios);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar funcionários' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const funcionario = await FuncionarioModel.findById(id);

            if (!funcionario) {
                return res.status(404).json({ message: 'Funcionário não encontrado' });
            }
            return res.status(200).json(funcionario);
        } catch (error) {
            console.error('Erro ao buscar funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar o funcionário' });
        }
    }

    static async create(req, res) {
        try {
            const { nome, telefone, cargo, salario } = req.body;

            if (!nome || !telefone || !cargo || salario === undefined) {
                return res.status(400).json({ message: 'Nome, telefone, cargo e salário são obrigatórios' });
            }

            const novoFuncionario = new FuncionarioModel({
                nome,
                telefone,
                cargo,
                salario: Number(salario)
            });

            await novoFuncionario.save();
            return res.status(201).json(novoFuncionario);
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao cadastrar o funcionário' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, telefone, cargo, salario } = req.body;

            const dadosAtualizacao = {};
            if (nome) dadosAtualizacao.nome = nome;
            if (telefone) dadosAtualizacao.telefone = telefone;
            if (cargo) dadosAtualizacao.cargo = cargo;
            if (salario !== undefined) dadosAtualizacao.salario = Number(salario);

            const funcionarioAtualizado = await FuncionarioModel.findByIdAndUpdate(
                id,
                dadosAtualizacao,
                { new: true, runValidators: true }
            );

            if (!funcionarioAtualizado) {
                return res.status(404).json({ message: 'Funcionário não encontrado para atualização' });
            }

            return res.status(200).json(funcionarioAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar o funcionário' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const funcionarioRemovido = await FuncionarioModel.findByIdAndDelete(id);

            if (!funcionarioRemovido) {
                return res.status(404).json({ message: 'Funcionário não encontrado para exclusão' });
            }

            return res.status(200).json({ message: 'Funcionário removido com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir funcionário:', error);
            return res.status(500).json({ message: 'Erro interno ao excluir o funcionário' });
        }
    }

    // ==========================================
    // RENDERS DAS TELAS (EJS)
    // ==========================================

    static async renderCreate(req, res) {
        try {
            return res.render('cadastrar-funcionario');
        } catch (error) {
            console.error('Erro ao abrir página de cadastro de funcionário:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }

    static async renderAll(req, res) {
        try {
            const funcionarios = await FuncionarioModel.find();
            return res.render('visualizar-funcionarios', { funcionarios });
        } catch (error) {
            console.error('Erro ao carregar visualização de funcionários:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }
}

export default FuncionarioController;