import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
        password: loginDto.password,
      },
    });

    if (!user) {
      throw new HttpException('No user', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    const payload: AuthDto = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
