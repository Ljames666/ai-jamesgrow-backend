import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://seu-frontend.vercel.app',
    ], // URLs do frontend
    credentials: true, // necessário se usar cookies (não é seu caso, mas bom ter)
  });
  const port = configService.get<number>('PORT', 3000);
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap();
