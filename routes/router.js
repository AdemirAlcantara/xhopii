import express from "express";
import path from 'path';
import ClienteController from '../controllers/ClienteController.js';
import FuncionarioController from '../controllers/FuncionarioController.js';
import ProdutoController from '../controllers/ProdutoController.js';
import uploadProduto, { uploadPerfil } from '../middlewares/uploadMiddleware.js';
import { viewsPath } from '../utils/pathUtils.js';

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(viewsPath, 'home.html'));
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
router.get('/clientes', ClienteController.getAll);
router.get('/clientes/:id', ClienteController.getById);
router.post('/clientes', uploadPerfil, ClienteController.create);
router.patch('/clientes/:id', uploadPerfil, ClienteController.update);
router.put('/clientes/:id', uploadPerfil, ClienteController.update);
router.delete('/clientes/:id', ClienteController.delete);

router.get('/funcionario/cadastrar', FuncionarioController.renderCreate);
router.get('/funcionarios/visualizar', FuncionarioController.renderAll);
router.get('/funcionarios', FuncionarioController.getAll);
router.get('/funcionarios/:id', FuncionarioController.getById);
router.post('/funcionarios', uploadPerfil, FuncionarioController.create);
router.patch('/funcionarios/:id', uploadPerfil, FuncionarioController.update);
router.put('/funcionarios/:id', uploadPerfil, FuncionarioController.update);
router.delete('/funcionarios/:id', FuncionarioController.delete);

router.get('/produto/cadastrar', ProdutoController.renderCreateProduto);
router.get('/produtos/visualizar', ProdutoController.renderAllProdutos);
router.get('/produtos', ProdutoController.getAllProdutos);
router.get('/produtos/:id', ProdutoController.getProdutoById);
router.post('/produtos', uploadProduto, ProdutoController.createProduto);
router.patch('/produtos/:id', uploadProduto, ProdutoController.updateProduto);
router.put('/produtos/:id', uploadProduto, ProdutoController.updateProduto);
router.delete('/produtos/:id', ProdutoController.deleteProduto);
router.get('/produto', ProdutoController.renderAllProdutos);

export default router;
