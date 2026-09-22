import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsPath = path.join(__dirname, 'assets');
const viewsPath = path.join(__dirname, 'views');

export { 
    __dirname,
    assetsPath,
    viewsPath,
}