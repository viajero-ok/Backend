import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './modules/usuarios/entities/usuario.entity';
import { AuthorizationGuard } from './common/guards/authorization/authorization.guard';
import { GlobalJwtGuard } from './common/guards/jwt/global-jwt.guard';
import { EmailModule } from './modules/email/email.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventMailModule } from './common/events/event-mail/event-mail.module';

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
			entities: [Usuario],
			synchronize: false, // Deshabilitar en producción
		}),
		AuthModule,
		UsuariosModule,
		EmailModule,
		EventMailModule,
	],
	controllers: [AppController],
	providers: [AppService, AuthorizationGuard, GlobalJwtGuard],
})
export class AppModule {}
