import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { assetsPath } from '../utils/pathUtils.js';

const createUpload = (folder) => {
    const uploadDirectory = path.join(assetsPath, 'uploads', folder);
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${crypto.randomUUID()}${extension}`);
    }
});

    const imageFilter = (_req, file, callback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (allowedMimeTypes.includes(file.mimetype)) {
            return callback(null, true);
        }

        return callback(new Error('A imagem deve estar no formato JPG, PNG ou WEBP.'));
    };

    return multer({
        storage,
        fileFilter: imageFilter,
        limits: { fileSize: 5 * 1024 * 1024 }
    });
};

const processarUpload = (upload) => (req, res, next) => {
    upload.single('imagem')(req, res, (error) => {
        if (!error) {
            return next();
        }

        if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'A imagem deve ter no máximo 5 MB.' });
        }

        return res.status(400).json({ message: error.message });
    });
};

const uploadProduto = processarUpload(createUpload('produtos'));
const uploadPerfil = processarUpload(createUpload('perfis'));

export { uploadPerfil };
export default uploadProduto;