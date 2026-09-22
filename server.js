import express from 'express';
import dotenv from 'dotenv';
import { staticMiddleware, urlencodedMiddleware, jsonMiddleware, securityMiddleware, compressionMiddlewware } from './middlewares/middlewares.js';
import { __dirname, assetsPath } from './utils/pathUtils.js';
import router from './routes/router.js';

const app = express();

dotenv.config();

app.use(staticMiddleware);
app.use(urlencodedMiddleware);
app.use(jsonMiddleware);
app.use(securityMiddleware);
app.use(compressionMiddlewware);

app.use(express.static(assetsPath));

app.use(router);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});