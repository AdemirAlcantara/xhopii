import ClienteModel from './ClienteSchema.js';

class Cliente {
    
    constructor({ nome, sobrenome, cpf, dataNascimento, telefone, email, senha, imagem }) {
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.email = email;
        this.senha = senha;
        this.imagem = imagem;
    }

    async save() {
        const novoCliente = new ClienteModel({
            nome: this.nome,
            sobrenome: this.sobrenome,
            cpf: this.cpf,
            dataNascimento: this.dataNascimento,
            telefone: this.telefone,
            email: this.email,
            senha: this.senha,
            imagem: this.imagem
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
        return await ClienteModel.findByIdAndUpdate(
            id,
            dadosAtualizados,
            { new: true, runValidators: true }
        );
    }

    static async delete(id) {
        return await ClienteModel.findByIdAndDelete(id);
    }
}

export default Cliente;