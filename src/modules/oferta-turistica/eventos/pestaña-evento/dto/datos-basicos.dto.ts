import { IsNotEmpty, IsString } from 'class-validator';

// ot.ID_OFERTA_TURISTICA AS id_oferta_turistica,
//         ot.TX_OFERTA AS nombre,
//         ot.TX_DESCRIPCION AS descripcion,
//         ot.ID_TIPO_OFERTA AS id_tipo_oferta,
//         tipo.TX_TIPO_OFERTA AS tipo_oferta,
//         ot.ID_SUB_TIPO_OFERTA AS id_sub_tipo_oferta,
//         sto.TX_SUB_TIPO_OFERTA AS sub_tipo_oferta,
//         ot.ID_SUB_CATEGORIA AS id_sub_categoria,
//         sco.TX_SUB_CATEGORIA AS sub_categoria,
//         -- ot.DURACION_HS AS duracion_horas,
//         ot.TX_REQUISITOS AS requisitos,
//         ot.TX_URL_VENTA AS url_venta_entradas

export class GuardarDatosBasicosEventoDto {
	@IsNotEmpty()
	@IsString()
	readonly id_oferta: string;

	readonly nombre: string;
	readonly descripcion: string;
	readonly id_sub_categoria: number;
	readonly requisitos: string;
	readonly url_venta_entradas: string;
	readonly fecha_hora_inicio: Date;
	readonly fecha_hora_fin: Date;
	readonly observaciones: string;
}
