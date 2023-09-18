import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmail(userEmail: string) {
    const url = `http://localhost:3000/projects/tasks`;

    await this.mailerService.sendMail({
      to: userEmail,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'New Task Assigned',
      template: './taskAssigned', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        url,
      },
    });
  }
}
