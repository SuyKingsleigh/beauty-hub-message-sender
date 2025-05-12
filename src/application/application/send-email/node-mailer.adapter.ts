import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { EmailSender } from './email-sender.interface';

@Injectable()
export class NodeMailerAdapter implements EmailSender {
  private transporter: nodemailer.Transporter;
  logger = new Logger(NodeMailerAdapter.name);

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: false, // true se usar porta 465, false para 587
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    this.logger.log(`sending message to ${to}`);
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('EMAIL_FROM'),
        to,
        subject,
        html,
      });
    } catch (e) {
      this.logger.error(e);
    }
  }
}
