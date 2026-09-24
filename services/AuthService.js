import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import ClienteModel from '../models/ClienteSchema.js';
import FuncionarioModel from '../models/FuncionarioSchema.js';

const JWT_EXPIRES_IN = '2h';
const RESET_TOKEN_EXPIRES_IN = '15m';

const getJwtSecret = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error('A variável JWT_SECRET não foi definida.');
    }

    return process.env.JWT_SECRET;
};

const isHash = senha => typeof senha === 'string' && senha.startsWith('$2');

class AuthService {
    static async findUser(email) {
        const emailNormalizado = String(email).trim().toLowerCase();
        const usuarios = [
            { model: ClienteModel, tipo: 'cliente' },
            { model: FuncionarioModel, tipo: 'funcionario' }
        ];

        for (const usuario of usuarios) {
            const encontrado = await usuario.model.findOne({ email: emailNormalizado });
            if (encontrado) return { model: usuario.model, tipo: usuario.tipo, usuario: encontrado };
        }

        return null;
    }

    static async authenticate(email, senha) {
        const emailNormalizado = String(email).trim().toLowerCase();
        const usuarios = [
            { model: ClienteModel, tipo: 'cliente' },
            { model: FuncionarioModel, tipo: 'funcionario' }
        ];

        for (const usuario of usuarios) {
            const encontrado = await usuario.model.findOne({ email: emailNormalizado });
            if (!encontrado) continue;

            const senhaValida = isHash(encontrado.senha)
                ? await bcrypt.compare(senha, encontrado.senha)
                : encontrado.senha === senha;

            if (!senhaValida) return null;

            if (!isHash(encontrado.senha)) {
                encontrado.senha = await bcrypt.hash(senha, 12);
                await encontrado.save();
            }

            return {
                id: encontrado._id.toString(),
                tipo: usuario.tipo,
                nome: encontrado.nome,
                email: encontrado.email
            };
        }

        return null;
    }

    static createToken(usuario) {
        return jwt.sign(
            { sub: usuario.id, tipo: usuario.tipo, nome: usuario.nome, email: usuario.email },
            getJwtSecret(),
            { expiresIn: JWT_EXPIRES_IN }
        );
    }

    static createPasswordResetToken(usuario) {
        return jwt.sign(
            { sub: usuario._id.toString(), tipo: usuario.tipo, purpose: 'reset-password' },
            getJwtSecret(),
            { expiresIn: RESET_TOKEN_EXPIRES_IN }
        );
    }

    static async resetPassword(token, senha) {
        const payload = jwt.verify(token, getJwtSecret());
        if (payload.purpose !== 'reset-password') throw new Error('Token de recuperação inválido.');

        const Model = payload.tipo === 'funcionario' ? FuncionarioModel : ClienteModel;
        const usuario = await Model.findById(payload.sub);
        if (!usuario) return false;

        usuario.senha = await bcrypt.hash(senha, 12);
        await usuario.save();
        return true;
    }

    static verifyToken(token) {
        return jwt.verify(token, getJwtSecret());
    }
}

export default AuthService;
