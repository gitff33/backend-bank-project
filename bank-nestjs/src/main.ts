import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'mail-queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());

  const rabbitMqUrl =
    process.env.RabbitMQ_MANAGEMENT_URL || 'http://localhost:15672';

  const config = new DocumentBuilder()
    .setTitle('CoreBank')
    .setDescription(
      `Документация банковского сервиса.\n\n` +
        `**[Открыть RabbitMQ Management UI](${rabbitMqUrl})** — панель управления очередями и сообщениями.`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.startAllMicroservices();

  await app.listen(3000);
}
bootstrap();
