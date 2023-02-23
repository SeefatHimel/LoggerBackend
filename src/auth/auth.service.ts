import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { User } from '@prisma/client';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';

@Injectable()
export class AuthService {
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
    const isPasswordMatched = await argon.verify(
      user.hash as string,
      dto.password,
    );
    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.createToken(user);
    const { id, firstName, lastName, email } = user;
    return { id, firstName, lastName, email, ...token };
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
  async googleLogin(req: any) {
    if (!req.user) {
      console.log('No user from google');
      return 'No user from google';
    }
    // console.log(req);
    const headers: any = req.headers;

    console.log('User information from google');
    const data = {
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      picture: req.user.picture,
    };
    const oldUser = await this.prisma.user.findUnique({
      where: { email: req.user.email },
    });
    if (oldUser) {
      console.log('Old User Found');
      const token = await this.createToken(oldUser);
      const { id, firstName, lastName, email } = oldUser;
      const data = `${JSON.stringify({
        id,
        firstName,
        lastName,
        email,
        ...token,
      })}`;
      const encodedData = Buffer.from(data).toString('base64');
      return {
        url: `${headers.referer}socialLogin/googleRedirectCB?data=${encodedData}`,
        statusCode: 302,
      };
    }
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
    const { id, firstName, lastName, email } = user;
    const useData = `${JSON.stringify({
      id,
      firstName,
      lastName,
      email,
      ...token,
    })}`;
    const encodedData = Buffer.from(useData).toString('base64');
    return {
      url: `${headers.referer}socialLogin/googleRedirectCB?data=${encodedData}`,
      statusCode: 302,
    };
  }
}
