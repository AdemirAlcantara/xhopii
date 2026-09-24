import bcrypt from 'bcryptjs';

const hashPassword = async senha => {
    if (typeof senha === 'string' && senha.startsWith('$2')) {
        return senha;
    }

    return bcrypt.hash(senha, 12);
};

export { hashPassword };
