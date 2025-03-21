import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { SocialType } from 'src/modules/users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsStrongPassword({
    minLowercase: 1,
    minUppercase: 1,
    minLength: 8,
    minSymbols: 1,
  })
  @IsOptional()
  password?: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;

  @ApiProperty({ type: String })
  @IsString()
  socialId?: string;

  @IsEnum(SocialType)
  socialType?: SocialType = SocialType.COMMON;
}
