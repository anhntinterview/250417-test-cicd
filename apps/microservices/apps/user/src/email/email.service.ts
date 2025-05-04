import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

type MailOptionsType = {
  subject: string;
  email: string;
  name: string;
  activationCode: string;
  template: string;
  text: string;
};

@Injectable()
export class EmailService {
  constructor(private mailServer: MailerService) {}

  async sendMail({
    subject,
    email,
    name,
    activationCode,
    template,
    text,
  }: MailOptionsType) {
    await this.mailServer.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        activationCode,
      },
      text,
    });
  }
}
