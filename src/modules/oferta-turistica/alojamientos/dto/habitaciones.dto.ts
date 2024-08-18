import { ApiProperty } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsNumber,
	IsEnum,
	IsBoolean,
	IsArray,
	ValidateNested,
	Min,
	IsOptional,
	ValidateIf,
	Validate,
} from 'class-validator';
import { Type } from 'class-transformer';

enum TipoBano {
	PRIVADO = 'Baño Privado',
	COMPARTIDO = 'Baño Compartido',
}

class PlazasDto {
	@ApiProperty({
		description: 'Cantidad de plazas por habitación',
		example: 2,
		minimum: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly cantidad_plazas_por_habitacion: number;

	@ApiProperty({
		description: 'Distribución de las plazas',
		example: '1 cama matrimonial',
	})
	@IsNotEmpty()
	@IsString()
	readonly distribucion: string;
}

class ComodidadesDto {
	@ApiProperty({
		enum: TipoBano,
		description: 'Tipo de baño',
		example: TipoBano.PRIVADO,
	})
	@IsNotEmpty()
	@IsEnum(TipoBano)
	readonly tipo_bano: TipoBano;

	@ApiProperty({
		description: 'Apta para personas con movilidad reducida',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly apta_movilidad_reducida: boolean;

	@ApiProperty({
		description: 'Cantidad apta para personas con movilidad reducida',
		example: 1,
		required: false,
	})
	@IsOptional()
	@ValidateIf((o) => !o.apta_movilidad_reducida)
	@IsNumber()
	@Min(1)
	@Validate(
		(o) => o.cantidad_apta_movilidad_reducida <= o.cantidad_habitaciones,
		{
			message:
				'La cantidad apta para movilidad reducida no puede ser mayor que la cantidad de habitaciones',
		},
	)
	readonly cantidad_apta_movilidad_reducida?: number;
}

class ServiciosDto {
	@ApiProperty({ description: 'Indica si tiene frigobar', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly frigobar: boolean;

	@ApiProperty({ description: 'Indica si tiene kitchenette', example: false })
	@IsNotEmpty()
	@IsBoolean()
	readonly kitchenette: boolean;

	@ApiProperty({
		description: 'Indica si tiene caja de seguridad',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly caja_de_seguridad: boolean;

	@ApiProperty({
		description: 'Indica si tiene aire acondicionado',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly aire_acondicionado: boolean;

	@ApiProperty({ description: 'Indica si tiene calefacción', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly calefaccion: boolean;

	@ApiProperty({ description: 'Indica si tiene TV simple', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly tv_simple: boolean;

	@ApiProperty({ description: 'Indica si tiene TV cable', example: false })
	@IsNotEmpty()
	@IsBoolean()
	readonly tv_cable: boolean;

	@ApiProperty({ description: 'Indica si tiene WiFi', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly wifi: boolean;

	@ApiProperty({ description: 'Indica si tiene teléfono', example: true })
	@IsNotEmpty()
	@IsBoolean()
	readonly telefono: boolean;

	@ApiProperty({
		description: 'Indica si proporciona toallas',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly toallas: boolean;

	@ApiProperty({
		description: 'Indica si proporciona artículos de higiene',
		example: true,
	})
	@IsNotEmpty()
	@IsBoolean()
	readonly articulos_de_higiene: boolean;

	@ApiProperty({
		description: 'Otros servicios o características',
		type: [String],
		example: ['Vista al mar', 'Balcón privado'],
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	readonly otros?: string[];
}

class ImagenProcesadaDto {
	@ApiProperty({ description: 'Nombre original del archivo' })
	@IsString()
	readonly nombreOriginal: string;

	@ApiProperty({ description: 'Nombre único del archivo' })
	@IsString()
	readonly nombreUnico: string;

	@ApiProperty({ description: 'Ruta del archivo' })
	@IsString()
	readonly ruta: string;

	@ApiProperty({ description: 'Tipo MIME del archivo' })
	@IsString()
	readonly mimeType: string;

	@ApiProperty({ description: 'Tamaño del archivo en bytes' })
	@IsNumber()
	readonly tamano: number;
}

class ContenidoMultimediaDto {
	@ApiProperty({
		type: [ImagenProcesadaDto],
		description: 'Imágenes procesadas',
	})
	@IsArray()
	@Type(() => ImagenProcesadaDto)
	imagenes: ImagenProcesadaDto[];
}

class HabitacionDto {
	@ApiProperty({
		description: 'Nombre de la habitación',
		example: 'Suite Deluxe',
	})
	@IsNotEmpty()
	@IsString()
	readonly nombre: string;

	@ApiProperty({
		description: 'Cantidad de habitaciones',
		example: 5,
		minimum: 1,
	})
	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	readonly cantidad_habitaciones: number;

	@ApiProperty({ type: PlazasDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => PlazasDto)
	readonly plazas: PlazasDto;

	@ApiProperty({ type: ComodidadesDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ComodidadesDto)
	readonly comodidades: ComodidadesDto;

	@ApiProperty({ type: ServiciosDto })
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => ServiciosDto)
	readonly servicios: ServiciosDto;

	@IsOptional()
	@Type(() => ContenidoMultimediaDto)
	readonly contenido_multimedia: ContenidoMultimediaDto;
}

export class HabitacionesDto {
	@ApiProperty({ type: [HabitacionDto] })
	@IsNotEmpty()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => HabitacionDto)
	readonly habitaciones: HabitacionDto[];
}
