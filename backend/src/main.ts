import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Включить CORS
  app.enableCors({
    origin: 'http://192.168.1.115:3000', // URL вашего фронта
    credentials: true, // Если используете куки/авторизацию
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(process.env.PORT ?? 4000);
  console.log(`Application is running on: http://localhost:4000`);
}
bootstrap();
