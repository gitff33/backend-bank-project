import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { SendCheckReceiptDto } from './dto/send-check-event.dto';

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

  async sendCheckEmail(dto: SendCheckReceiptDto) {
    const formattedDate = new Date(dto.createdAt).toLocaleDateString('ru-RU', {
      timeZone: 'Europe/Moscow',
    });

    await this.transporter.sendMail({
      from: `"CoreBank Support" <${process.env.SMTP_USER}>`,
      to: dto.to,
      subject: `Чек по переводу от ${formattedDate}`,
      html: `
      <h2>Квитанция о переводе</h2>
        <p><b>Номер транзакции:</b> ${dto.reference}</p>
        <p><b>Статус:</b> ${dto.status}</p>
        <p><b>Отправитель:</b> ${dto.senderName}</p>
        <p><b>Получатель:</b> ${dto.receiverName}</p>
        <p><b>Сумма:</b> ${dto.amount} USD</p>
        <p><b>Комиссия:</b> ${dto.commission} USD</p>
        <p><b>Итоговая сумма:</b> ${dto.totalDeduction} USD</p>
        <p><b>Дата:</b> ${formattedDate}</p>
      `,
    });
  }
}
