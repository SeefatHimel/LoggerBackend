import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async register(registerDto: RegisterDto) {
    return { ...registerDto };
  }

  async login(loginDto: LoginDto) {
    return { ...loginDto };
  }
}
