import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RefreshTokenGuard } from '../../common/guards/refresh-token.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from './types/jwt-payload.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // -------------------------------
  // Register
  // -------------------------------
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // -------------------------------
  // Login
  // -------------------------------
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // -------------------------------
  // Email Verification
  // -------------------------------
  @Get('verify-email')
  async verifyEmail(@Req() req: Request & { query: { token: string } }) {
    const token = req.query.token;
    return this.authService.verifyEmail(token);
  }

  // -------------------------------
  // Forgot / Reset Password
  // -------------------------------
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // -------------------------------
  // Refresh Tokens
  // -------------------------------

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refresh(@CurrentUser() user: JwtPayload) {
    return this.authService.refreshTokens(user.sub, user.refreshToken!);
  }

  // -------------------------------
  // Logout
  // -------------------------------
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: JwtPayload) {
    console.log(user.sub);
    return this.authService.logout(user.sub);
  }

  // -------------------------------
  // Me (test authenticated access)
  // -------------------------------
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.profile(user.sub);
    //return user;
  }
}
