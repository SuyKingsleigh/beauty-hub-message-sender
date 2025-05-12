import { Module } from '@nestjs/common';
import { AppointmentEventsListener } from './appointment-events.listener/appointment-events.listener.controller';

@Module({
  controllers: [AppointmentEventsListener],
})
export class EventsListenerModule {}
