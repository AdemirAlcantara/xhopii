import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const pathAbsolute = new URL(".", import.meta.url).pathname;
const __dirname = pathAbsolute.slice(1);

const assetsPath = path.join(__dirname, 'assets');
app.use(express.static(assetsPath));

const viewsPath = path.join(__dirname, 'views');

app.use(express.urlencoded({ extended: true }));

const sendView = (viewName) => (req, res) => {
  res.sendFile(path.join(viewsPath, viewName));
};

// Rotas das telas
app.get('/', sendView('home.html'));

app.get('/home', sendView('home.html'));

app.post('/login', (req, res) => { 
  const { email, senha } = req.body;

  res.send(`Email: ${email}, Senha: ${senha}`);
});

app.get('/recuperar-senha', sendView('recuperar-senha.html'));
app.get('/clientes/cadastrar', sendView('cadastrar-cliente.html'));
app.get('/funcionario/cadastrar', sendView('cadastrar-funcionario.html'));
app.get('/produto/cadastrar', sendView('cadastrar-produto.html'));
app.get('/clientes', sendView('visualizar-cliente.ejs'));
app.get('/funcionarios', sendView('visualizar-funcionario.html'));
app.get('/produtos', sendView('ver-produto.html'));

// Compatibilidade com links relativos existentes nas telas.
app.get('/ver-produto.html', sendView('ver-produto.html'));


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});