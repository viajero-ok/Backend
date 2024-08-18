import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationGuard } from './common/guards/authorization/authorization.guard';
import { GlobalJwtGuard } from './common/guards/jwt/global-jwt.guard';
import { EmailModule } from './modules/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventMailModule } from './common/events/event-mail/event-mail.module';
import { CargarUbicacionesModule } from './modules/utils/cargar-ubicaciones/cargar-ubicaciones.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { OfertaTuristicaModule } from './modules/oferta-turistica/oferta-turistica.module';
import { UbicacionesModule } from './modules/tipificados/ubicaciones/ubicaciones.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		EventEmitterModule.forRoot(),
		TypeOrmModule.forRoot({
			type: 'mysql',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT, 10),
			username: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_NAME,
			autoLoadEntities: true,
			synchronize: false, // Deshabilitar en producción
			extra: {
				connectionLimit: 10,
				connectTimeout: 60000,
			},
			keepConnectionAlive: false,
			poolSize: 10,
			retryAttempts: 10,
			retryDelay: 3000,
		}),
		ThrottlerModule.forRoot([
			{
				ttl: 60000, // Tiempo de vida del registro en milisegundos
				limit: 50, // Cantidad de peticiones permitidas
			},
		]),
		AuthModule,
		UsuariosModule,
		EmailModule,
		EventMailModule,
		CargarUbicacionesModule,
		PassportModule.register({ session: true }),
		OfertaTuristicaModule,
		UbicacionesModule,
		MulterModule.register({
			storage: diskStorage({
				destination: './uploads',
				filename: (req, file, callback) => {
					const uniqueSuffix =
						Date.now() + '-' + Math.round(Math.random() * 1e9);
					callback(
						null,
						file.fieldname +
							'-' +
							uniqueSuffix +
							extname(file.originalname),
					);
				},
			}),
			fileFilter: (req, file, callback) => {
				// Acepta cualquier campo que comience con "habitaciones[" y termine con "].imagenes"
				if (file.fieldname.match(/^habitaciones\[\d+\]\.imagenes$/)) {
					callback(null, true);
				} else {
					callback(
						new Error('Formato de campo de archivo no válido'),
						false,
					);
				}
			},
		}),
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
		AppService,
		AuthorizationGuard,
		GlobalJwtGuard,
	],
})
export class AppModule {}
