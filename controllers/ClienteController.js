import ClienteModel from '../models/Cliente.js';

class ClienteController {

    static async getAll(req, res) {
        try {
            // Oculta o campo de senha no retorno da lista por segurança
            const clientes = await ClienteModel.find().select('-senha');
            return res.status(200).json(clientes);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar clientes' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const cliente = await ClienteModel.findById(id).select('-senha');

            if (!cliente) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }
            return res.status(200).json(cliente);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao buscar o cliente' });
        }
    }

    static async create(req, res) {
        try {
            const { nome, email, senha } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios' });
            }

            const clienteExistente = await ClienteModel.findOne({ email });
            if (clienteExistente) {
                return res.status(409).json({ message: 'Já existe um cliente cadastrado com este e-mail' });
            }

            const novoCliente = new ClienteModel({ nome, email, senha });
            await novoCliente.save();

            const clienteRetorno = novoCliente.toObject();
            delete clienteRetorno.senha;

            return res.status(201).json(clienteRetorno);
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao cadastrar o cliente' });
        }
    }

    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha } = req.body;

            const dadosAtualizacao = {};
            if (nome) dadosAtualizacao.nome = nome;
            if (email) dadosAtualizacao.email = email;
            if (senha) dadosAtualizacao.senha = senha;

            const clienteAtualizado = await ClienteModel.findByIdAndUpdate(
                id,
                dadosAtualizacao,
                { new: true, runValidators: true }
            ).select('-senha');

            if (!clienteAtualizado) {
                return res.status(404).json({ message: 'Cliente não encontrado para atualização' });
            }

            return res.status(200).json(clienteAtualizado);
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao atualizar o cliente' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const clienteRemovido = await ClienteModel.findByIdAndDelete(id);

            if (!clienteRemovido) {
                return res.status(404).json({ message: 'Cliente não encontrado para exclusão' });
            }

            return res.status(200).json({ message: 'Cliente removido com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir cliente:', error);
            return res.status(500).json({ message: 'Erro interno ao excluir o cliente' });
        }
    }

    static async renderCreate(req, res) {
        try {
            return res.render('cadastrar-cliente');
        } catch (error) {
            console.error('Erro ao abrir página de cadastro de cliente:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }

    static async renderAll(req, res) {
        try {
            const clientes = await ClienteModel.find().select('-senha');
            return res.render('visualizar-clientes', { clientes });
        } catch (error) {
            console.error('Erro ao carregar visualização de clientes:', error);
            return res.status(500).send('Erro interno ao carregar a página');
        }
    }
}

export default ClienteController;