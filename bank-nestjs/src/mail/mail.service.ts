import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    await this.transporter.sendMail({
      from: '"CoreBank Support" <${process.env.SMTP_USER}>',
      to,
      subject: 'Код подтверждения почты',
      html: `
            <h2>Подтвеждение email</h2>
            <p>Ваш код подтверждения: <b>${code}</b></p>
            <p>Код действителен в течение 5 минут.</p>
        `,
    });
  }
  async sendWelcomeEmail(to: string) {
    await this.transporter.sendMail({
      from: '"CoreBank Support" <${process.env.SMTP_USER}>',
      to,
      subject: 'Приветственное письмо',
      html: `
        <h2><b>Добро пожаловать в CoreBank!</b></h2>
        <p>Ваш Email успешно подтвержден, спасибо за внимание!</p>`,
    });
  }
}
