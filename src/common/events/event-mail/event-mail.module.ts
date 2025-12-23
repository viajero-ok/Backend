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
			from: '"Viajero" <hi@viajeroturismo.me>',
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
			from: '"Viajero" <hi@viajeroturismo.me>',
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
			from: '"Viajero" <hi@viajeroturismo.me>',
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

	@OnEvent('reserva.created')
	async handleReservaCreatedEvent(
		mailTurista: string,
		mailPrestador: string,
		nombreTurista: string,
		razonSocialPrestador: string,
		urlPago: string,
		detallesReserva: {
			fechaInicio: string;
			fechaFin: string;
			nombreExperiencia: string;
			precio: number;
		},
	) {
		// Envío de correo al turista
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.me>',
			to: mailTurista,
			subject: 'Confirmación de tu reserva 🧉',
			template: 'confirmacion-reserva-turista',
			context: {
				nombre: nombreTurista,
				prestador: razonSocialPrestador,
				urlPago,
				...detallesReserva,
			},
		});

		// Envío de correo al prestador
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.me>',
			to: mailPrestador,
			subject: 'Nueva reserva recibida 🧉',
			template: 'confirmacion-reserva-prestador',
			context: {
				nombreTurista,
				razonSocial: razonSocialPrestador,
				...detallesReserva,
			},
		});
	}

	@OnEvent('reserva.pagada')
	async handleReservaPagadaEvent(
		nombreTurista: string,
		apellidoTurista: string,
		nombrePrestador: string,
		apellidoPrestador: string,
		mailTurista: string,
		mailPrestador: string,
		montoFinal: number,
		fechaInicio: string,
		fechaFin: string,
		nombreOferta: string,
	) {
		// Envío de correo al turista
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.me>',
			to: mailTurista,
			subject: 'Pago confirmado de tu reserva 🧉',
			template: 'pago-confirmado-turista',
			context: {
				nombre: nombreTurista,
				apellido: apellidoTurista,
				prestador: `${nombrePrestador} ${apellidoPrestador}`,
				fechaInicio,
				fechaFin,
				nombreExperiencia: nombreOferta,
				precio: montoFinal,
			},
		});

		// Envío de correo al prestador
		await this.mailService.sendMail({
			from: '"Viajero" <hi@viajeroturismo.me>',
			to: mailPrestador,
			subject: 'Pago recibido por reserva 🧉',
			template: 'pago-confirmado-prestador',
			context: {
				nombreTurista: `${nombreTurista} ${apellidoTurista}`,
				razonSocial: `${nombrePrestador} ${apellidoPrestador}`,
				fechaInicio,
				fechaFin,
				nombreExperiencia: nombreOferta,
				precio: montoFinal,
			},
		});
	}
}
