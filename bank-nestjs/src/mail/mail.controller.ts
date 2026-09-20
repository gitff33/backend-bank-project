import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MailService } from './mail.service';
import { SendVerificationCodeEvent } from './dto/send-verification-event.dto';

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
}
