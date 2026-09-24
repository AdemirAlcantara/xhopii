const responderCadastro = (req, res, { status, message, sucesso, voltar, data }) => {
    const aceitaHtml = req.accepts(['html', 'json']) === 'html';

    if (aceitaHtml) {
        return res.status(status).render('resultado-cadastro', {
            sucesso,
            message,
            voltar
        });
    }

    return res.status(status).json(data || { message });
};

const requisicaoHtml = req => req.accepts(['html', 'json']) === 'html';

export { requisicaoHtml, responderCadastro };
