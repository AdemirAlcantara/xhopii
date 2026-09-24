import AuthService from '../services/AuthService.js';

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.xhopii_token;

    if (!token) {
        if (req.accepts(['html', 'json']) === 'html') {
            return res.redirect('/login');
        }

        return res.status(401).json({ message: 'Autenticação necessária.' });
    }

    try {
        req.usuario = AuthService.verifyToken(token);
        return next();
    } catch (error) {
        res.clearCookie('xhopii_token');

        if (req.accepts(['html', 'json']) === 'html') {
            return res.redirect('/login');
        }

        return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }
};

export default authMiddleware;
