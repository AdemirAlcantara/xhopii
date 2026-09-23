import ClienteModel from './ClienteSchema.js';

class Cliente {
    
    constructor(nome, email, senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    async save() {
        const novoCliente = new ClienteModel({
            nome: this.nome,
            email: this.email,
            senha: this.senha
        });

        return await novoCliente.save();
    }

    static async findAll() {
        return await ClienteModel.find();
    }

    static async findById(id) {
        return await ClienteModel.findById(id);
    }

    static async findByEmail(email) {
        return await ClienteModel.findOne({ email: email });
    }

    static async update(id, dadosAtualizados) {
        return await ClienteModel.findByIdAndUpdate(id, dadosAtualizados, { new: true });
    }

    static async delete(id) {
        return await ClienteModel.findByIdAndDelete(id);
    }
}

export default Cliente;