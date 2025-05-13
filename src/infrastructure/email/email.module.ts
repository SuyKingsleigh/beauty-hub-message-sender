import { Module } from '@nestjs/common';
import { NodeMailerAdapter } from '../../application/application/send-email/node-mailer.adapter';
import { EMAIL_SENDER } from './symbols';

@Module({
  providers: [
    {
      provide: EMAIL_SENDER,
      useClass: NodeMailerAdapter,
    },
  ],
  exports: [EMAIL_SENDER],
})
export class EmailModule {
}
