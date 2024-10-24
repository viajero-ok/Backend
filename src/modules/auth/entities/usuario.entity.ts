import { Column, Entity } from 'typeorm';

@Entity({ name: 'USUARIOS' })
export class Usuario {
	@Column({ name: 'ID_USUARIO', primary: true })
	id_usuario: string;

	@Column({ name: 'TX_MAIL' })
	mail: string;

	@Column({ name: 'TX_NOMBRE' })
	nombre: string;

	@Column({ name: 'TX_APELLIDO' })
	apellido: string;
}
