import FuncionarioModel from './FuncionarioSchema.js';

class Funcionario{

    constructor({ nome, sobrenome, cpf, dataNascimento, telefone, cargo, salario, email, senha, imagem }){
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.dataNascimento = dataNascimento;
        this.telefone = telefone;
        this.cargo = cargo;
        this.salario = salario;
        this.email = email;
        this.senha = senha;
        this.imagem = imagem;
    }

    async save() {
        const novoFuncionario = new FuncionarioModel({
            nome: this.nome,
            sobrenome: this.sobrenome,
            cpf: this.cpf,
            dataNascimento: this.dataNascimento,
            telefone: this.telefone,
            cargo: this.cargo,
            salario: this.salario,
            email: this.email,
            senha: this.senha,
            imagem: this.imagem
        });

        return await novoFuncionario.save();
    }

    static async findAll() {
        return await FuncionarioModel.find();
    }

    static async findById(id) {
        return await FuncionarioModel.findById(id);
    }

    static async update(id, dadosAtualizados) {
        return await FuncionarioModel.findByIdAndUpdate(
            id,
            dadosAtualizados,
            { returnDocument: 'after', runValidators: true }
        );
    }

    static async delete(id) {
        return await FuncionarioModel.findByIdAndDelete(id);
    }
}

export default Funcionario;