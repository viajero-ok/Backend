import { diskStorage } from 'multer';

export const storage = diskStorage({
	destination: './uploads',
	// destination: `${__dirname}/../uploads`,
	filename: (req, file, cb) => {
		const extension = file.originalname.split('.').pop();
		const filename = `${file.fieldname}-${Date.now()}.${extension}`;
		cb(null, filename);
	},
});
