import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { CreateNewsDto } from 'src/news/dtos/create-news-dto';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTest() {
    console.log('Отправляется письмо установки');
    return this.mailerService
      .sendMail({
        to: 'mazkarp@yandex.ru',
        subject: 'Первое тестовое письмо',
        template: './test',
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  async sendNewNewsForAdmins(
    emails: string[],
    news: CreateNewsDto,
  ): Promise<void> {
    console.log('Отправляются письма о новой новости администрации ресурса');

    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Создана новая новость: ${news.title}`,
          template: './new-news',
          context: news,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }

  async sendChangeNewsForAdmins(
    emails: string[],
    news: CreateNewsDto,
    currentNews: CreateNewsDto,
  ): Promise<void> {
    console.log(
      'Отправляются письма о изменении новости администрации ресурса',
    );
    console.log(news);
    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Новость была изменена `,
          template: './change-news',
          context: { news, currentNews },
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }
}
