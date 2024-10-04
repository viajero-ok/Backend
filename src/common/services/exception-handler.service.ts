import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ExceptionHandlingService {
	handleError(result: any, mensaje: string, statusCode: HttpStatus): void {
		if (result.resultado === 'error') {
			let descriptionToUse;
			if (result.descripcion.includes('Error: ')) {
				descriptionToUse = result.descripcion.replace('Error: ', '');
				console.log(descriptionToUse);
			} else {
				descriptionToUse = mensaje;
			}

			throw new HttpException(
				{
					message: descriptionToUse,
					statusCode,
				},
				statusCode,
			);
		}
	}
}
