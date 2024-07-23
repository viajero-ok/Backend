import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtGuard } from './jwt.guard'; // Asegúrate de que la ruta de importación sea correcta

@Injectable()
export class GlobalJwtGuard extends JwtGuard {
	constructor(private reflector: Reflector) {
		super();
	}

	canActivate(context: ExecutionContext) {
		const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
			context.getHandler(),
			context.getClass(),
		]);

		//si es publica, se permite el acceso
		if (isPublic) {
			return true;
		}

		//Si no es publica, se valida el token
		return super.canActivate(context);
	}
}
