import { Injectable, BadRequestException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { EmailTokenPayload } from './types/email-token.interface';

@Injectable()
export class EmailService {
  private transporter;

  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: this.config.get<number>('EMAIL_PORT'),
      secure: false,
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASS'),
      },
    });
  }

  // Generate verification token
  generateVerificationToken(userId: number, email: string) {
    return this.jwtService.sign({ userId, email });
  }

  // SEND EMAIL
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${this.config.get('EMAIL_VERIFICATION_URL')}?token=${token}`;

    // Load Template
    const templatePath = path.join(
      __dirname,
      'templates',
      'verification-email.html',
    );

    let html = fs.readFileSync(templatePath, 'utf8');
    html = html.replace('{{VERIFY_LINK}}', verificationUrl);

    try {
      await this.transporter.sendMail({
        from: `"Ecommerce App" <${this.config.get('EMAIL_USER')}>`,
        to: email,
        subject: 'Verify your email',
        html,
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException('Failed to send verification email');
    }
  }

  // Verify token
  verifyEmailToken(token: string): EmailTokenPayload {
    try {
      return this.jwtService.verify<EmailTokenPayload>(token, {
        secret: this.config.get('JWT_SECRET'),
      });
    } catch (e) {
      console.log(e);
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
