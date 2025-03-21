import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { comparePassword } from '../../utils/password-util';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { LogInDto } from './dto/log-in.dto';
import { JwtService } from '@nestjs/jwt';
import { CookieOptions } from 'express';
import { AppConfigService } from 'src/config/app/config.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private appConfigService: AppConfigService,
    private s3Service: S3Service,
  ) {}
  async register(registerDto: RegisterDto): Promise<ResponseRegisterDto> {
    return this.usersService.createUser(registerDto);
  }

  async logIn(logInDto: LogInDto, origin: string) {
    const user = await this.usersService.findUserByEmail(logInDto.email);

    if (!(await comparePassword(logInDto.password, user.password)))
      throw new UnauthorizedException(
        '이메일 또는 패스워드가 잘못 되었습니다.',
      );

    const { accessToken, accessOptions } = this.setJwtAccessToken(
      logInDto.email,
      origin,
    );

    const { refreshToken, refreshOptions } = this.setJwtRefreshToken(
      logInDto.email,
      origin,
    );

    return {
      accessToken,
      refreshToken,
      accessOptions,
      refreshOptions,
    };
  }

  async googleLogin(email: string, origin: string) {
    const user = await this.usersService.findUserByEmail(email);
    const { accessToken, accessOptions } = this.setJwtAccessToken(
      email,
      origin,
    );
    const { refreshToken, refreshOptions } = this.setJwtRefreshToken(
      email,
      origin,
    );

    return {
      accessToken,
      refreshToken,
      accessOptions,
      refreshOptions,
    };
  }

  googleLoginCallback(req: Request) {
    if (!req) {
      throw new UnauthorizedException('구글 로그인 실패');
    }
    return {
      message: '구글 로그인 성공',
      user: req,
    };
  }

  setCookieOption(maxAge: number, requestDomain: string): CookieOptions {
    let domain: string;

    if (
      requestDomain.includes('127.0.0.1') ||
      requestDomain.includes('localhost')
    )
      domain = 'localhost';
    else {
      domain = requestDomain.split(':')[0];
    }

    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      sameSite: 'lax',
    };
  }

  setJwtAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = 3600 * 1000;
    const accessToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge,
    });
    return {
      accessToken,
      accessOptions: this.setCookieOption(maxAge, requestDomain),
    };
  }

  setJwtRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email };
    const maxAge = 30 * 24 * 3600 * 1000;
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge,
    });
    return {
      refreshToken,
      refreshOptions: this.setCookieOption(maxAge, requestDomain),
    };
  }

  expireJwtToken(requestDomain: string) {
    return {
      accessOption: this.setCookieOption(0, requestDomain),
      refreshOption: this.setCookieOption(0, requestDomain),
    };
  }

  uploadProfile(file: Express.Multer.File) {
    return this.s3Service.uploadFile(file, 'user-profile');
  }
}
