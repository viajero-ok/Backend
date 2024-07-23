import { Column, Entity } from 'typeorm';

@Entity({ name: 'TURISTAS' })
export class Turista {
	@Column({ name: 'ID_TURISTA', primary: true })
	ID_TURISTA: string;

	@Column({ name: 'ID_USUARIO' })
	ID_USUARIO: string;

	@Column({ name: 'NRO_DOCUMENTO_IDENTIDAD' })
	NRO_DOCUMENTO_IDENTIDAD: number;

	@Column({ name: 'ID_TIPO_DOCUMENTO' })
	ID_TIPO_DOCUMENTO: number;

	@Column({ name: 'ID_LOCALIDAD_ORIGEN' })
	ID_LOCALIDAD_ORIGEN: number;

	@Column({ name: 'ID_IDIOMA' })
	ID_IDIOMA: number;

	@Column({ name: 'ID_GENERO' })
	ID_GENERO: number;
}
