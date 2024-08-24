import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class ExceptionHandlingService {
	handleError(
		result: any,
		mensaje: string,
		statusCode: HttpStatus,
		descripcion?: string,
	): void {
		if (result.resultado === 'error') {
			const descriptionToUse = result.descripcion.includes('Error')
				? result.descripcion
				: descripcion;

			throw new HttpException(
				{
					statusCode: HttpStatus.CONFLICT,
					message: mensaje,
					description: descriptionToUse,
				},
				statusCode,
			);
		}
	}
}
