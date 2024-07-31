import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public/public.decorator';

@Public()
@Controller('')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHealth(): string {
		return this.appService.getHealth();
	}
}
