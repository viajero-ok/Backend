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
}
