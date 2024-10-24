import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/modules/auth/entities/usuario.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AuthRepositoryService } from './auth-repository.service';
import { GlobalJwtGuard } from 'src/common/guards/jwt/global-jwt.guard';
import { JwtGuard } from 'src/common/guards/jwt/jwt.guard';
import { AuthorizationGuard } from 'src/common/guards/authorization/authorization.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleStrategy } from './strategy/google.strategy';
import { SessionSerializer } from './utils/serializer';

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: () => {
				return {
					secret: process.env.JWT_SECRET,
					signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
				};
			},
		}),
		EventEmitterModule.forRoot(),
		TypeOrmModule.forFeature([Usuario]),
		CacheModule.register(),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		AuthRepositoryService,
		GlobalJwtGuard,
		JwtGuard,
		AuthorizationGuard,
		GoogleStrategy,
		SessionSerializer,
	],
})
export class AuthModule {}
