import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UbicacionesService } from './ubicaciones.service';
import {
	ApiBearerAuth,
	ApiOperation,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Ubicaciones')
@ApiBearerAuth()
@Controller('ubicaciones')
export class UbicacionesController {
	constructor(private readonly ubicacionesService: UbicacionesService) {}

	@ApiOperation({ summary: 'OBTENER UBICACIONES' })
	@ApiResponse({
		status: 200,
		description: 'Se obtienen las ubicaciones',
		schema: {
			type: 'object',
			properties: {
				resultado: {
					type: 'string',
					example: 'ok',
				},
				statusCode: {
					type: 'number',
					example: 200,
				},
				ubicaciones: {
					type: 'object',
					properties: {
						localidades: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_localidad: {
										type: 'number',
										example: 8178,
									},
									localidad: {
										type: 'string',
										example: '1 A Seccion',
									},
									id_departamento: {
										type: 'number',
										example: 348,
									},
								},
							},
						},
						departamentos: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_departamento: {
										type: 'number',
										example: 166,
									},
									departamento: {
										type: 'string',
										example: '1° de Mayo',
									},
									id_provincia: {
										type: 'number',
										example: 3,
									},
								},
							},
						},
						provincias: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									id_provincia: {
										type: 'number',
										example: 1,
									},
									provincia: {
										type: 'string',
										example: 'Buenos Aires',
									},
									id_pais: {
										type: 'number',
										example: 1,
									},
								},
							},
						},
						paises: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									pais: {
										type: 'string',
										example: 'Alemania',
									},
									id_pais: {
										type: 'number',
										example: 13,
									},
								},
							},
						},
					},
				},
			},
		},
	})
	@UseInterceptors(CacheInterceptor)
	@CacheTTL(60 * 60 * 24 * 15) // 15 días en segundos
	@Get()
	async obtenerUbicaciones() {
		return await this.ubicacionesService.obtenerUbicaciones();
	}
}
