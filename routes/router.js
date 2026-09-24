import express from "express";
import path from 'path';
import ClienteController from '../controllers/ClienteController.js';
import FuncionarioController from '../controllers/FuncionarioController.js';
import ProdutoController from '../controllers/ProdutoController.js';
import uploadProduto, { uploadPerfil } from '../middlewares/uploadMiddleware.js';
import { viewsPath } from '../utils/pathUtils.js';

const router = express.Router();

router.get("/", (req, res) => {
    return ProdutoController.renderHome(req, res);
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(viewsPath, 'login.html'));
});

router.get('/recuperar-senha', (req, res) => {
    res.sendFile(path.join(viewsPath, 'recuperar-senha.html'));
});
router.post('/login', ClienteController.login);
router.post('/recuperar-senha', ClienteController.recoverPassword);

router.get('/clientes/cadastrar', ClienteController.renderCreate);
router.get('/clientes/visualizar', ClienteController.renderAll);
router.get('/clientes/:id/atualizar', ClienteController.renderUpdate);
router.get('/clientes/:id/excluir', ClienteController.renderDeleteConfirmation);
router.get('/clientes', ClienteController.getAll);
router.get('/clientes/:id', ClienteController.getById);
router.post('/clientes', uploadPerfil, ClienteController.create);
router.post('/clientes/:id/atualizar', uploadPerfil, ClienteController.update);
router.post('/clientes/:id/excluir', ClienteController.delete);
router.patch('/clientes/:id', uploadPerfil, ClienteController.update);
router.put('/clientes/:id', uploadPerfil, ClienteController.update);
router.delete('/clientes/:id', ClienteController.delete);

router.get('/funcionario/cadastrar', FuncionarioController.renderCreate);
router.get('/funcionarios/visualizar', FuncionarioController.renderAll);
router.get('/funcionarios/:id/atualizar', FuncionarioController.renderUpdate);
router.get('/funcionarios/:id/excluir', FuncionarioController.renderDeleteConfirmation);
router.get('/funcionarios', FuncionarioController.getAll);
router.get('/funcionarios/:id', FuncionarioController.getById);
router.post('/funcionarios', uploadPerfil, FuncionarioController.create);
router.post('/funcionarios/:id/atualizar', uploadPerfil, FuncionarioController.update);
router.post('/funcionarios/:id/excluir', FuncionarioController.delete);
router.patch('/funcionarios/:id', uploadPerfil, FuncionarioController.update);
router.put('/funcionarios/:id', uploadPerfil, FuncionarioController.update);
router.delete('/funcionarios/:id', FuncionarioController.delete);

router.get('/produto/cadastrar', ProdutoController.renderCreateProduto);
router.get('/produtos/visualizar', ProdutoController.renderAllProdutos);
router.get('/produtos/:id/comprar', ProdutoController.renderCompra);
router.post('/produtos/:id/comprar', ProdutoController.prepararCompra);
router.post('/produtos/:id/confirmar-compra', ProdutoController.confirmarCompra);
router.get('/produtos/:id/atualizar', ProdutoController.renderUpdateProduto);
router.get('/produtos/:id/excluir', ProdutoController.renderDeleteConfirmation);
router.get('/produtos', ProdutoController.getAllProdutos);
router.get('/produtos/:id', ProdutoController.getProdutoById);
router.post('/produtos', uploadProduto, ProdutoController.createProduto);
router.post('/produtos/:id/atualizar', uploadProduto, ProdutoController.updateProduto);
router.post('/produtos/:id/excluir', ProdutoController.deleteProduto);
router.patch('/produtos/:id', uploadProduto, ProdutoController.updateProduto);
router.put('/produtos/:id', uploadProduto, ProdutoController.updateProduto);
router.delete('/produtos/:id', ProdutoController.deleteProduto);
router.get('/produto', ProdutoController.renderAllProdutos);

export default router;
