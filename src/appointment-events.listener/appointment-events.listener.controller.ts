import { Controller, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EMAIL_SENDER } from '../infrastructure/email/symbols';
import { EmailSender } from '../application/application/send-email/email-sender.interface';
import { CreateAppointmentInputDto } from './dto/create-appointment.input.dto';

@Controller('appointment-events.listener')
export class AppointmentEventsListener implements OnModuleInit {
  constructor(@Inject(EMAIL_SENDER) private readonly sender: EmailSender) {}

  onModuleInit() {
    this.logger.log('Listener pronto! :3');
  }

  private readonly logger = new Logger(AppointmentEventsListener.name);
  private readonly maxRetries = 3;
  private readonly retryExchange = 'amq.topic';

  async sendEmail(data: CreateAppointmentInputDto) {
    await this.sender.sendEmail(
      data.user.email,
      'Agendamento criado',
      'Agendamento criado com o cliente ' + data.customer.name,
    );
  }

  @EventPattern('appointment.scheduled')
  async handleAppointmentScheduled(
    @Payload() data: CreateAppointmentInputDto,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const retries = Number(originalMsg.properties.headers['x-retries'] ?? 0);
      this.logger.log(`Recebido com retries=${retries}`);

      await this.sendEmail(data);

      channel.ack(originalMsg);
    } catch (err) {
      this.logger.error(
        `[ERROR] appointment.scheduled -> ${err.message}`,
        err.stack,
      );

      const retries = Number(originalMsg.properties.headers['x-retries'] ?? 0);

      if (retries < this.maxRetries) {
        this.retry(retries, originalMsg, channel);
      } else {
        this.toDeadLetterQueue(retries, channel, originalMsg);
      }
    }
  }

  private toDeadLetterQueue(retries: number, channel: any, originalMsg: any) {
    this.logger.warn(
      `[DLQ] Movendo para fila morta após ${retries} tentativas.`,
    );

    channel.sendToQueue(
      'appointment.created.dlq',
      Buffer.from(originalMsg.content),
      {
        persistent: true,
      },
    );

    channel.nack(originalMsg, false, false);
  }

  private retry(retries: number, originalMsg: any, channel: any) {
    this.logger.warn(`[RETRY] Tentativa ${retries + 1} de ${this.maxRetries}`);

    const newHeaders = {
      ...originalMsg.properties.headers,
      'x-retries': retries + 1,
    };

    channel.sendToQueue(
      originalMsg.fields.routingKey, // exemplo: 'appointment.scheduled'
      Buffer.from(originalMsg.content),
      {
        persistent: true,
        headers: newHeaders,
      },
    );

    // Ack a original pra não duplicar
    channel.ack(originalMsg);
  }
}
