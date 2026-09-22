import FunionarioModel from './Funcionario.js';

class Funcionario{

    constructor(nome, telefone, cargo, salario){
        this.nome = nome;
        this.telefone = telefone;
        this.cargo = cargo;
        this.salario = salario;
    }
}

export default Funcionario;