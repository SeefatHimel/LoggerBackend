import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { User } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashedPassword = await argon.hash(dto.password);

    const data = {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      hash: hashedPassword,
    };
    const user = await this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    const token = await this.createToken(user);
    return { ...user, ...token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordMatched = await argon.verify(user.hash, dto.password);
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.createToken(user);
  }

  async createToken(user: any): Promise<{ access_token: string }> {
    const payload = { email: user.email, sub: user.id };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '1d',
    });
    return {
      access_token,
    };
  }
}
