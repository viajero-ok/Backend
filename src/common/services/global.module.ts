import { Global, Module } from '@nestjs/common';
import { ExceptionHandlingService } from './exception-handler.service';

@Global()
@Module({
	providers: [ExceptionHandlingService],
	exports: [ExceptionHandlingService],
})
export class GlobalModule {}
