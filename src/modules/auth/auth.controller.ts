import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { ResponseRegisterDto } from './dto/response-register.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogInDto } from './dto/log-in.dto';
import { RequestOrigin } from 'src/decorators/request-origin.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { RequestUser } from 'src/decorators/request-user.decorator';

ApiTags('유저 인증');
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '유저 등록',
    description: '유저 등록 api 입니다.',
  })
  @ApiResponse({
    type: ResponseRegisterDto,
    status: HttpStatus.CREATED,
  })
  @ApiBody({
    type: RegisterDto,
  })
  @Post('signup')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<ResponseRegisterDto> {
    return this.authService.register(registerDto);
  }

  @ApiOperation({
    summary: '유저 로그인',
    description: '유저 로그인 api',
  })
  @ApiBody({
    type: LogInDto,
  })
  @Post('signin')
  async logIn(
    @Body() logInDto: LogInDto,
    @RequestOrigin() origin,
    @Res() res: Response,
  ) {
    const { accessToken, refreshToken, accessOptions, refreshOptions } =
      await this.authService.logIn(logInDto, origin);

    res.cookie('Authentication', accessToken, accessOptions);
    res.cookie('Refresh', refreshToken, refreshOptions);

    return res.json({
      message: '로그인 성공!',
      accessToken,
      refreshToken,
    });
  }

  @Post('signout')
  signOut(@Res() res: Response, @RequestOrigin() origin: string) {
    const { accessOption, refreshOption } =
      this.authService.expireJwtToken(origin);
    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);

    res.json({
      message: '로그아웃 완료',
    });
  }

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @Post('upload-profile')
  async uploadProfile(
    @UploadedFile() file: Express.Multer.File,
    @RequestUser() user: User,
  ) {
    const result = await this.authService.uploadProfile(file);

    return { result };
  }
}
