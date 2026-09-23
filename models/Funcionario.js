import FuncionarioModel from './FuncionarioSchema.js';

class Funcionario{

    constructor(nome, telefone, cargo, salario){
        this.nome = nome;
        this.telefone = telefone;
        this.cargo = cargo;
        this.salario = salario;
    }

    async save() {
        const novoFuncionario = new FuncionarioModel({
            nome: this.nome,
            telefone: this.telefone,
            cargo: this.cargo,
            salario: this.salario
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
        return await FuncionarioModel.findByIdAndUpdate(id, dadosAtualizados, { new: true });
    }

    static async delete(id) {
        return await FuncionarioModel.findByIdAndDelete(id);
    }
}

export default Funcionario;