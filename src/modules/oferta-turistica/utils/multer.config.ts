import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerConfig = {
	storage: diskStorage({
		destination: './uploads',
		filename: (req, file, cb) => {
			const id_oferta = req.body.id_oferta || 'unknown';
			const uniqueFilename = `alojamiento_${id_oferta}_${path.parse(file.originalname).name}_${uuidv4()}${path.extname(file.originalname)}`;
			cb(null, uniqueFilename);
		},
	}),
	fileFilter: (req, file, cb) => {
		if (file.mimetype.startsWith('image/')) {
			cb(null, true);
		} else {
			cb(new Error('El archivo no es una imagen válida'), false);
		}
	},
	limits: {
		fileSize: 5 * 1024 * 1024, // Limita el tamaño del archivo a 5MB
	},
};
