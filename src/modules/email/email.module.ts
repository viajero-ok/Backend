import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
	imports: [
		MailerModule.forRootAsync({
			useFactory: (): MailerOptions => {
				return {
					transport: {
						host: process.env.MAIL_HOST,
						secure: process.env.MAIL_SECURE === 'true',
						ignoreTLS: true,
						port: parseInt(process.env.MAIL_PORT, 10),
						auth: {
							user: process.env.MAIL_USER,
							pass: process.env.MAIL_PASSWORD_OR_API_KEY,
						},
						pool: true,
						tls: {
							// do not fail on invalid certs
							rejectUnauthorized: false,
						},
					},
					defaults: {
						from: `"nest-modules" <${process.env.MAIL_FROM}>`,
					},
					template: {
						dir: __dirname + '/templates',
						adapter: new HandlebarsAdapter(),
						options: {
							strict: true,
						},
					},
				};
			},
		}),
	],
})
export class EmailModule {}
