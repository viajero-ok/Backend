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
import { AlojamientosModule } from './modules/oferta-turistica/alojamientos/alojamientos.module';
import { ActividadesModule } from './modules/oferta-turistica/actividades/actividades.module';
import { EventosModule } from './modules/oferta-turistica/eventos/eventos.module';
import { CargarUbicacionesModule } from './modules/utils/cargar-ubicaciones/cargar-ubicaciones.module';

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
		AuthModule,
		UsuariosModule,
		EmailModule,
		EventMailModule,
		AlojamientosModule,
		ActividadesModule,
		EventosModule,
		CargarUbicacionesModule,
	],
	controllers: [AppController],
	providers: [AppService, AuthorizationGuard, GlobalJwtGuard],
})
export class AppModule {}
