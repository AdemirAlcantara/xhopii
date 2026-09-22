import mangoose from 'mongoose';

const FuncionarioSchema = mongoose.Schema({
    nome: { type: String, required: true, trim: true },
    telefone: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    salario: { type: Number, required: true, trim: true }
}, { 
    timestamps: true
});

const FuncionarioMode = mongoose.model('Funcionario', FuncionarioSchema);

export default FuncionarioMode;