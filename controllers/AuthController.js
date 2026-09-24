import AuthService from '../services/AuthService.js';

class AuthController {
    static async login(req, res) {
        try {
            const email = req.body.email || req.body.inputEmailLog;
            const senha = req.body.senha || req.body.inputSenhaLog;

            if (!email || !senha) {
                return AuthController.responderErro(req, res, 400, 'E-mail e senha são obrigatórios.');
            }

            const usuario = await AuthService.authenticate(email, senha);
            if (!usuario) {
                return AuthController.responderErro(req, res, 401, 'E-mail ou senha inválidos.');
            }

            const token = AuthService.createToken(usuario);
            res.cookie('xhopii_token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 2 * 60 * 60 * 1000
            });

            if (req.accepts(['html', 'json']) === 'html') {
                return res.redirect('/');
            }

            return res.status(200).json({ message: 'Login realizado com sucesso.', token, usuario });
        } catch (error) {
            console.error('Erro ao realizar login:', error);
            return AuthController.responderErro(req, res, 500, 'Erro interno ao realizar login.');
        }
    }

    static logout(req, res) {
        res.clearCookie('xhopii_token');
        return res.redirect('/login');
    }

    static async requestPasswordReset(req, res) {
        try {
            const email = req.body.email || req.body.inputEmailLog;
            if (!email) return AuthController.responderErro(req, res, 400, 'E-mail é obrigatório.');

            const encontrado = await AuthService.findUser(email);
            if (!encontrado) {
                return res.status(200).render('recuperacao-solicitada');
            }

            const token = AuthService.createPasswordResetToken({
                _id: encontrado.usuario._id,
                tipo: encontrado.tipo
            });
            const link = `/recuperar-senha/${encodeURIComponent(token)}`;

            if (req.accepts(['html', 'json']) === 'html') {
                return res.render('recuperacao-solicitada', { link });
            }

            return res.status(200).json({ message: 'Se o e-mail estiver cadastrado, as instruções serão enviadas.' });
        } catch (error) {
            console.error('Erro ao solicitar recuperação:', error);
            return AuthController.responderErro(req, res, 500, 'Erro interno ao solicitar recuperação.');
        }
    }

    static renderPasswordReset(req, res) {
        return res.render('redefinir-senha', { token: req.params.token, erro: null });
    }

    static async resetPassword(req, res) {
        const { senha, confirmarSenha } = req.body;

        if (!senha || senha !== confirmarSenha) {
            return res.status(400).render('redefinir-senha', {
                token: req.params.token,
                erro: 'As senhas são obrigatórias e devem ser iguais.'
            });
        }

        try {
            const atualizado = await AuthService.resetPassword(req.params.token, senha);
            if (!atualizado) return res.status(404).send('Usuário não encontrado.');
            return res.render('senha-atualizada');
        } catch (error) {
            return res.status(400).render('redefinir-senha', {
                token: req.params.token,
                erro: 'O link de recuperação é inválido ou expirou.'
            });
        }
    }

    static responderErro(req, res, status, message) {
        if (req.accepts(['html', 'json']) === 'html') {
            return res.status(status).send(message);
        }

        return res.status(status).json({ message });
    }
}

export default AuthController;
