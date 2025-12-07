import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';

// DTOs
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

// -----------------------------
//   Types
// -----------------------------
import { JwtPayload } from './types/jwt-payload.type';
//import { User } from '../users/entities/user.entity';
import { UserResponseDto } from '../users/dtos/user-response.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.saltRounds = Number(
      this.configService.get<string>('BCRYPT_SALT_ROUNDS') ?? '10',
    );
  }

  // -----------------------------
  //   JWT Helpers
  // -----------------------------

  private getJwtAccessToken(userId: number, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get<string>('JWT_SECRET');

    if (!secret) throw new Error('Missing environment variable: JWT_SECRET');

    const expiresIn = this.configService.get<number>('JWT_EXPIRES_IN') ?? '1d';

    return this.jwtService.sign<JwtPayload>(payload, {
      secret,
      expiresIn,
    });
  }

  private getJwtRefreshToken(userId: number, email: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };
    const secret = this.configService.get<string>('REFRESH_TOKEN_SECRET');

    if (!secret)
      throw new Error('Missing environment variable: REFRESH_TOKEN_SECRET');

    const expiresIn =
      this.configService.get<number>('REFRESH_TOKEN_EXPIRES_IN') ?? '7d';

    return this.jwtService.sign<JwtPayload>(payload, {
      secret,
      expiresIn,
    });
  }

  // -----------------------------
  //   REGISTER
  // -----------------------------
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, this.saltRounds);

    const user = await this.usersService.create(
      dto.name,
      dto.email,
      hashedPassword,
    );

    // verification token
    const token = this.emailService.generateVerificationToken(
      user.id,
      user.email,
    );

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.usersService.setVerificationToken(user.id, token, expires);

    try {
      await this.emailService.sendVerificationEmail(user.email, token);
    } catch (err) {
      // تسجيل فقط — لا نوقف تسجيل المستخدم
      console.error('Email sending failed:', err);
    }

    return {
      message: 'User registered. Please check your email to verify account.',
    };
  }

  // -----------------------------
  //   VALIDATE USER (LocalStrategy)
  // -----------------------------
  async validateUser(
    email: string,
    password: string,
  ): Promise<null | { id: number; email: string; name: string; role: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const valid = await this.usersService.validatePassword(
      password,
      user.password,
    );

    if (!valid) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  // -----------------------------
  //   LOGIN
  // -----------------------------
  async login(dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
    user: { id: number; email: string; name: string; role: string };
  }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.usersService.validatePassword(
      dto.password,
      user.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const accessToken = this.getJwtAccessToken(user.id, user.email);
    const refreshToken = this.getJwtRefreshToken(user.id, user.email);

    const hashedRefresh = await bcrypt.hash(refreshToken, this.saltRounds);
    await this.usersService.setCurrentRefreshToken(hashedRefresh, user.id);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  // -----------------------------
  //   REFRESH TOKENS
  // -----------------------------
  async refreshTokens(
    userId: number,
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(userId);

    if (!user || !user.currentHashedRefreshToken)
      throw new ForbiddenException('Access Denied');

    const isMatch = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (!isMatch) throw new ForbiddenException('Access Denied');

    const newAccessToken = this.getJwtAccessToken(user.id, user.email);
    const newRefreshToken = this.getJwtRefreshToken(user.id, user.email);

    const hashed = await bcrypt.hash(newRefreshToken, this.saltRounds);
    await this.usersService.setCurrentRefreshToken(hashed, user.id);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // -----------------------------
  //   LOGOUT
  // -----------------------------
  async logout(userId: number): Promise<{ message: string }> {
    await this.usersService.removeRefreshToken(userId);
    return { message: 'Logged out' };
  }

  // -----------------------------
  //   PROFILE
  // -----------------------------

  async profile(
    userId: number,
  ): Promise<{ message: string; user: UserResponseDto | null }> {
    const data = await this.usersService.prfile(userId);
    return { message: 'user data', user: data };
  }

  // -----------------------------
  //   EMAIL VERIFICATION
  // -----------------------------
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const decoded = this.emailService.verifyEmailToken(token);
      const user = await this.usersService.findById(decoded.userId);

      if (!user) throw new NotFoundException('User not found');

      await this.usersService.markEmailAsVerified(user.id);

      return { message: 'Email verified successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired verification token');
    }
  }

  // -----------------------------
  //   FORGOT PASSWORD
  // -----------------------------
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new NotFoundException('User not found');

    const token = this.emailService.generateVerificationToken(
      user.id,
      user.email,
    );

    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersService.setResetPasswordToken(user.id, token, expires);

    await this.emailService.sendVerificationEmail(user.email, token);

    return { message: 'Password reset email sent' };
  }

  // -----------------------------
  //   RESET PASSWORD
  // -----------------------------
  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    try {
      const decoded = this.emailService.verifyEmailToken(dto.token);
      const user = await this.usersService.findById(decoded.userId);

      if (!user) throw new NotFoundException('User not found');

      const newHashed = await bcrypt.hash(dto.newPassword, this.saltRounds);

      await this.usersService.updatePassword(user.id, newHashed);

      return { message: 'Password reset successful' };
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
