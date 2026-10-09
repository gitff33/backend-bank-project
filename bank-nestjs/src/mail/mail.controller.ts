import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { SendVerificationCodeEvent } from './dto/send-verification-event.dto';
import { SendWelcomeEventDto } from './dto/send-welcome-event.dto';
import { SendCheckReceiptDto } from './dto/send-check-event.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('send_verification_code')
  async handleSendVerificationEmail(
    @Payload() data: SendVerificationCodeEvent,
  ) {
    console.log(
      `[RabbitMQ Consumer] Отправка кода ${data.code} на email: ${data.email}`,
    );
    await this.mailService.sendVerificationEmail(data.email, data.code);
  }

  @EventPattern('send_welcome_email')
  async HandleSendWelcomeEmail(@Payload() data: SendWelcomeEventDto) {
    console.log(
      `[RabbitMQ Consumer] отправка приветственного письма на email: ${data.email}`,
    );
    await this.mailService.sendWelcomeEmail(data.email);
  }

  @EventPattern('transfer.completed')
  async HandleSendCheckEmail(@Payload() dto: SendCheckReceiptDto) {
    console.log(
      '[RabbitMQ Consumer] отправка чека операции(перевода) на Email',
      dto,
    );
    await this.mailService.sendCheckEmail(dto);
  }
}
