import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectEntityManager } from '@nestjs/typeorm';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public/public.decorator';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthorizationGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		@InjectEntityManager() private entityManager: EntityManager,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		//Si es una ruta publica, se permite el acceso
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (isPublic) {
			return true;
		}

		//Obtener el usuario y la ruta a la que intenta acceder
		const request = context.switchToHttp().getRequest();
		const user = request.user;
		const method = request.method;
		const url = request.route.path;
		// sacarle el /api/ a la url
		const urlWithoutApi = url.replace(/^\/api\//, '');
		console.log(
			'usuario AuthorizationGuard',
			user,
			'\nmethod',
			method,
			'\nurl',
			url,
		);

		//validar que los datos necesarios estén presentes
		if (!user || !method || !url) {
			return false;
		}

		// Consulta para verificar si el usuario tiene permiso para acceder a la URL con el método especificado
		const result = await this.entityManager.query(
			'CALL SP_OBT_PERMISOS_X_USUARIO(?)',
			[user.id_usuario],
		);
		/* const permisos = result[0][0];
		if (!permisos) {
			return false;
		}
		const hasAccess = permisos.some(
			(permiso) => permiso.url === urlWithoutApi && permiso.metodo === method,
		); */
		return true;
	}
}
