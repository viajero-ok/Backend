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
		/* const hasPermission = await this.entityManager
			.createQueryBuilder()
			.select('COUNT(*)', 'count')
			.from('USUARIOS', 'u')
			.innerJoin(
				'PERFILES_X_USUARIO',
				'pxu',
				'u.ID_USUARIO = pxu.ID_USUARIO',
			)
			.innerJoin(
				'FUNCIONALIDADES_X_PERFIL',
				'fxp',
				'pxu.ID_PERFIL = fxp.ID_PERFIL',
			)
			.innerJoin(
				'URLS_X_FUNCIONALIDAD',
				'uxf',
				'fxp.ID_FUNCIONALIDAD = uxf.ID_FUNCIONALIDAD',
			)
			.innerJoin('URLS', 'url', 'uxf.ID_URL = url.ID_URL')
			.innerJoin('METODOS', 'm', 'url.ID_METODO = m.ID_METODO')
			.where('u.ID_USUARIO = :userId', { userId: user.ID_USUARIO })
			.andWhere('url.TX_URL = :url', { url })
			.andWhere('m.TX_METODO = :method', { method })
			.getRawOne();

		return parseInt(hasPermission.count) > 0; */
		return true;
	}
}
