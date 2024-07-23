import { Column, Entity } from 'typeorm';

@Entity({ name: 'PRESTADORES' })
export class PrestadorTuristico {
	@Column({ name: 'ID_PRESTADOR' })
	ID_PRESTADOR: string;

	@Column({ name: 'TX_CUIT' })
	TX_CUIT: string;

	@Column({ name: 'TX_RAZON_SOCIAL' })
	TX_RAZON_SOCIAL: string;

	@Column({ name: 'TX_SITIO_WEB', nullable: true })
	TX_SITIO_WEB: string;

	@Column({ name: 'ID_USUARIO' })
	ID_USUARIO: string;

	@Column({ name: 'FEC_ALTA', type: 'datetime', default: new Date() })
	FEC_ALTA: Date;

	@Column({
		name: 'FEC_BAJA',
		type: 'datetime',
		nullable: true,
		default: null,
	})
	FEC_BAJA: Date;

	@Column({ name: 'USR_BAJA', nullable: true, default: null })
	USR_BAJA: string;
}
