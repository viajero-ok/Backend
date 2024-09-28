import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const multerHabitacionConfig = {
	storage: diskStorage({
		destination: './uploads',
		filename: (req, file, cb) => {
			const id_tipo_detalle = req.body.id_tipo_detalle || 'unknown';
			const uniqueFilename = `habitacion_${id_tipo_detalle}_${path.parse(file.originalname).name}_${uuidv4()}${path.extname(file.originalname)}`;
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
