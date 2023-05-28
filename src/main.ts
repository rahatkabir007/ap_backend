import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalInterceptors(new EncryptInterceptor());
  app.enableCors();
  await app.listen(process.env.PORT || 3001);
  console.log(`${process.env.APP_NAME} listening on port ${process.env.PORT}`);
}
bootstrap();
