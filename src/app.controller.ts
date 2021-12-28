import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get()
  @Render('index')
  root() {
    return {
      messages: [
        { message: 'Hello world 66!', author: 'Maks' },
        { message: 'Hello!', author: 'Maks Kar' },
      ],
    };
  }
}
