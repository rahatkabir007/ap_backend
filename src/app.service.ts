import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome ${process.env['APP_NAME']} Running at port ${process.env['PORT']} Deployed Version 1.3`;
  }
}
