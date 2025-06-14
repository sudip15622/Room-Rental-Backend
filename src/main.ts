import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/gql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:3000', // or '*' for development
    // credentials: true, // required if using cookies
  })
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
