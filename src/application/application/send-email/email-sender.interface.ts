export interface EmailSender {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
}