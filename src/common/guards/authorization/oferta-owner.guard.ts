/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

@Injectable()
export class OfertaOwnerGuard implements CanActivate {
	constructor(
		@InjectEntityManager() private entityManager: EntityManager
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const id_usuario = request.user.id_usuario;
		const id_oferta =
			request.body?.id_oferta || request.params?.id_oferta;

		if (!id_oferta) return false;

		const resultado = await this.entityManager.query(
			`SELECT EXISTS( SELECT 1 FROM OFERTAS_TURISTICAS ot
				INNER JOIN PRESTADORES p ON ot.ID_PRESTADOR = p.ID_PRESTADOR
				WHERE ot.ID_OFERTA_TURISTICA = ? AND p.ID_USUARIO = ?
			) as isOwner`, [id_oferta, id_usuario],
		);
		return resultado[0].isOwner === '1';
	}
}
