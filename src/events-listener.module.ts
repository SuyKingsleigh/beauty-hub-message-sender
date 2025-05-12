import { Module } from '@nestjs/common';
import { AppointmentEventsListener } from './appointment-events.listener/appointment-events.listener.controller';
import { EmailModule } from './infrastructure/email/email.module';

@Module({
  controllers: [AppointmentEventsListener],
  imports: [EmailModule],
})
export class EventsListenerModule {
}
