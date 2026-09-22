import express from 'express';
import dotenv from 'dotenv';
import { staticMiddleware, urlencodedMiddleware, jsonMiddleware, securityMiddleware, compressionMiddleware } from './middlewares/middlewares.js';
import { __dirname, assetsPath, viewsPath } from './utils/pathUtils.js';
import router from './routes/router.js';
import Database from './config/db.js';

const app = express();

dotenv.config();

app.set('view engine', 'ejs');
app.set('views', viewsPath);

app.use(securityMiddleware);
app.use(compressionMiddleware);
app.use(staticMiddleware);
app.use(urlencodedMiddleware);
app.use(jsonMiddleware);

app.use(router);

process.on('SIGINT', async () => {
    console.log('\nEncerrando o servidor...');
    await Database.disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\nServiço finalizado pelo sistema.');
    await Database.disconnect();
    process.exit(0);
});

const PORT = process.env.PORT;

async function startServer() {
    await Database.connect();
    app.listen(PORT, () => {
        console.log(`Servidor a correr na porta ${PORT}`);
    });
}

startServer();