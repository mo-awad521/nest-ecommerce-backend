import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(name: string, email: string, password: string): Promise<User> {
    const user = this.usersRepo.create({ name, email, password });
    console.log('USER CREATED:', user);
    console.log('USER.EMAIL:', user?.email);
    return await this.usersRepo.save(user);
  }

  // async create(userData: Partial<User>): Promise<User> {
  //   const user = this.usersRepo.create(userData);

  //   return await this.usersRepo.save(user);
  // }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return await this.usersRepo.findOne({ where: { id } });
  }

  async setCurrentRefreshToken(hashedToken: string, userId: number) {
    await this.usersRepo.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  async removeRefreshToken(userId: number) {
    await this.usersRepo.update(userId, {
      currentHashedRefreshToken: null,
    });
  }

  async markEmailAsVerified(userId: number) {
    await this.usersRepo.update(userId, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    await this.usersRepo.update(userId, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async validatePassword(plain: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(plain, hashed);
  }

  //

  async setResetPasswordToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepo.update(userId, {
      resetPasswordToken: token,
      resetPasswordExpires: expiresAt,
    });
  }

  async setVerificationToken(
    userId: number,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.usersRepo.update(userId, {
      verificationToken: token,
      verificationTokenExpires: expiresAt,
    });
  }
}
