import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { HttpExceptionFilter } from './common/filter/exception-response.filter';
import { ValidationPipe, UnprocessableEntityException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,

      exceptionFactory: (errors) => {
        return new UnprocessableEntityException({
          success: false,
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
