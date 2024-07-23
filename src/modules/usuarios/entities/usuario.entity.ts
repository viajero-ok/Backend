import { Column, Entity } from 'typeorm';

@Entity({ name: 'USUARIOS' })
export class Usuario {
	@Column({ name: 'ID_USUARIO', primary: true })
	ID_USUARIO: string;

	@Column({ name: 'TX_MAIL' })
	TX_MAIL: string;

	@Column({ name: 'TX_NOMBRE' })
	TX_NOMBRE: string;

	@Column({ name: 'TX_APELLIDO' })
	TX_APELLIDO: string;

	@Column({ name: 'TX_CONTRASENIA' })
	TX_CONTRASENIA: string;

	@Column({ name: 'FEC_ALTA', type: 'datetime', default: new Date() })
	FEC_ALTA: Date;

	@Column({
		name: 'FEC_MODIF',
		type: 'datetime',
		nullable: true,
		default: null,
	})
	FEC_MODIF: Date;

	@Column({ name: 'USR_MODIF', nullable: true, default: null })
	USR_MODIF: string;

	@Column({
		name: 'FEC_BAJA',
		type: 'datetime',
		nullable: true,
		default: null,
	})
	FEC_BAJA: Date;

	@Column({ name: 'USR_BAJA', nullable: true, default: null })
	USR_BAJA: string;

	@Column({ name: 'FEC_NACIMIENTO' })
	FEC_NACIMIENTO: Date;
}
