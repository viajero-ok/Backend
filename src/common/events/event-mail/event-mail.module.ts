import { MailerService } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Module({})
export class EventMailModule {
	constructor(private readonly mailService: MailerService) {}

	@OnEvent('account.created')
	async handleAccountCreatedEvent(
		mail: string,
		codigo_verificacion: string,
		id_usuario: string,
	) {
		const url_verificacion = `${process.env.URL_FRONT}?codigo_verificacion=${codigo_verificacion}&&id_usuario=${id_usuario}`;
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.com.ar>',
			to: mail,
			subject: 'Viajero - Verificación de cuenta 🧉',
			template: 'verificacion',
			context: {
				codigo_verificacion,
				url_verificacion,
			},
		});
	}

	@OnEvent('turista.created')
	async handleTuristaCreatedEvent(
		mail: string,
		idioma: string,
		nombre: string,
		apellido: string,
	) {
		const template =
			idioma === 'Español' ? 'bienvenido-turista' : 'welcome';
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.com.ar>',
			to: mail,
			subject: 'Bienvenido Viajero 🧉',
			template,
			context: {
				nombre,
				apellido,
			},
		});
	}

	@OnEvent('prestador.created')
	async handlePrestadorCreatedEvent(mail: string, razon_social: string) {
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.com.ar>',
			to: mail,
			subject: 'Bienvenido Viajero 🧉',
			template: 'bienvenido-prestador',
			context: {
				razon_social,
				tiempo_estimado: '24hs',
				email_soporte: 'viajeroapp24@gmail.com',
			},
		});
	}
}
