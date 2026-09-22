import express from 'express';
import __dirname from './utils/pathUtils.js';
import fs from 'fs';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';

const staticMiddleware = express.static(path.join(__dirname, 'assets')); // intermedia arquivos estáticos (css, img)

const urlencodedMiddleware = express.urlencoded({ extended: true}); // parse de dados urlencoded para um objeto

const jsonMiddleware = express.json(); // parse de dados JSON para um objeto

const securityMiddleware = helmet(); // configura cabeçalhos de segurança HTTP

const compressionMiddleware = compression(); // comprime respostas HTTP para reduzir o tamanho da resposta

const rateLimitMiddleware = rateLimit({ // limita a taxa de requisições num endereço IP
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: 'Muitas requisições, tente novamente em 10 minutos.'
});

const logFile = fs.createWriteStream(path.join(__dirname, 'logs', 'access.log'), {flags:'a'});
const morganMiddleware = morgan('combined', { stream: logFile }); // registra requisições HTTP no console

export {
    staticMiddleware,
    urlencodedMiddleware,
    jsonMiddleware,
    securityMiddleware,
    compressionMiddleware,
    rateLimitMiddleware,
    morganMiddleware
}