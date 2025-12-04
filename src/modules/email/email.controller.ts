import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private emailService: EmailService) {}

  // Called from FE on first signup
  @Get('send')
  async sendVerification(@Query('email') email: string) {
    const token = this.emailService.generateVerificationToken(1, email);
    await this.emailService.sendVerificationEmail(email, token);
    return { message: 'Verification email sent' };
  }

  // When user clicks the email link
  @Get('verify')
  verifyEmail(@Query('token') token: string) {
    const decoded = this.emailService.verifyEmailToken(token);

    // → هنا انت تفعّل المستخدم في الـ DB
    // UserRepository.update(decoded.userId, { isVerified: true });

    return {
      message: 'Email verified successfully!',
      decoded,
    };
  }
}
