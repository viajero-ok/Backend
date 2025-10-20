import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
	ValidationPipe,
} from '@nestjs/common';
import { AuthorizationGuard } from './common/guards/authorization/authorization.guard'; // Import the AuthorizationGuard
import { GlobalJwtGuard } from './common/guards/jwt/global-jwt.guard';
import { JwtRefreshInterceptor } from './common/interceptors/jwt-refresh/jwt-refresh.interceptor';
import { JwtService } from '@nestjs/jwt';
import { TimeOutInterceptor } from './common/interceptors/time-out/time-out.interceptor';
import * as session from 'express-session';
import * as passport from 'passport';
import { setupSwagger } from './setup-swagger';
import * as os from 'os';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

/**
 * Interceptor para mostrar los resultados de los endpoints.
 * Principalmente para que sea más facil el debugging en mobile.
 */
@Injectable()
export class EndpointLogInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const req = context.switchToHttp().getRequest();
		const { method, url, body, params, query } = req;

		const GREEN = '\x1b[42m\x1b[30m'; // fondo verde, texto negro
		const RED = '\x1b[41m\x1b[37m'; // fondo rojo, texto blanco
		const CYAN = '\x1b[46m\x1b[30m';
		const RESET = '\x1b[0m';

		const started = Date.now();

		return next.handle().pipe(
			tap((data) => {
				const ms = Date.now() - started;
				console.log(
					`${GREEN} ✔ ${method} ${url} [${ms}ms] 200 OK ${RESET}`,
				);
				console.log(data);
			}),
			catchError((err) => {
				const ms = Date.now() - started;
				const bodyStr = Object.keys(body || {}).length
					? JSON.stringify(body, null, 2)
					: '(empty)';
				const paramsStr = Object.keys(params || {}).length
					? JSON.stringify(params, null, 2)
					: '(empty)';
				const queryStr = Object.keys(query || {}).length
					? JSON.stringify(query, null, 2)
					: '(empty)';
				console.error(
					`${RED} ✖ [${err.status}] ${method} ${url} [${ms}ms] ${RESET}\n` +
						`${CYAN} → Params: ${paramsStr} ${RESET}\n` +
						`${CYAN} → Query: ${queryStr} ${RESET}\n` +
						`${CYAN} → Body: ${bodyStr} ${RESET}\n` +
						`${RED} Error: ${err.response.message ?? 'no msg'} ${RESET}\n`,
				);
				return throwError(() => err);
			}),
		);
	}
}

function getLocalExternalIp(): string | null {
	const nets = os.networkInterfaces();
	for (const name of Object.keys(nets)) {
		console.log(
			'name: ',
			name,
		); /** Print de las interfaces de red que tenes activas en tu PC */
		if (name != 'WiFi') continue;
		/**
		 * Nota para marianito:
		 * Arriba el console log va a printear todas tus interfaces de red, reemplaza en el if con el nombre de la interfaz que estás usando.
		 * Haciendo eso te va a printear la dirección IP que deberías usar en el frontend mobile para poder pegarle al backend desde la misma
		 * red local de tu ksa.
		 *
		 * xoxo
		 */
		for (const net of nets[name] ?? []) {
			// Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
			if (net.family === 'IPv4' && !net.internal) {
				return net.address;
			}
		}
	}
	return null;
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	// app.enableCors({
	// 	/* origin: (origin, callback) => {
	// 		// Lista de dominios permitidos
	// 		const allowedOrigins = [
	// 			'https://viajeroturismo.com.ar',
	// 			/\.viajeroturismo\.com\.ar$/, // Subdominios
	// 			'https://accounts.google.com',
	// 			'https://www.mercadopago.com',
	// 		];

	// 		if (
	// 			!origin ||
	// 			allowedOrigins.some((pattern) =>
	// 				typeof pattern === 'string'
	// 					? pattern === origin
	// 					: pattern.test(origin),
	// 			)
	// 		) {
	// 			callback(null, true);
	// 		} else {
	// 			callback(new Error('Not allowed by CORS'));
	// 		}
	// 	}, */
	// 	origin: true,
	// 	methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
	// 	credentials: true,
	// });

	//Prefijo de las rutas
	app.setGlobalPrefix('api');

	//Validación de los datos de entrada
	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	// Aplicar el AuthorizationGuard y GlobalJwtGuard de forma global
	const authorizationGuard = app.get(AuthorizationGuard);
	const globalJwtGuard = app.get(GlobalJwtGuard);
	app.useGlobalGuards(globalJwtGuard, authorizationGuard);

	// Aplicar el JwtRefreshInterceptor de forma global
	const jwtService = app.get(JwtService);
	const jwtRefreshInterceptor = new JwtRefreshInterceptor(jwtService);
	app.useGlobalInterceptors(jwtRefreshInterceptor, new TimeOutInterceptor());

	//Configuración de la sesión
	//(app as any).set('trust proxy', 1);
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: { maxAge: 86400000 }, // 1 dia 86400000
		}),
	);
	app.useGlobalInterceptors(new EndpointLogInterceptor());
	//Inicializar passport
	app.use(passport.initialize());
	app.use(passport.session());

	setupSwagger(app);

	//Iniciar la aplicación
	const PORT = process.env.PORT || 3000;
	await app.listen(PORT, '0.0.0.0');

	const localIp = getLocalExternalIp();
	console.log(`🚀 App running at:`);
	console.log(`   Local:   http://localhost:${PORT}`);
	if (localIp) {
		console.log(`   Network: http://${localIp}:${PORT}`);
	}
}
bootstrap();
