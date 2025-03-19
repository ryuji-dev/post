import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

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
  password: string;

  @ApiProperty({ type: String })
  @IsString()
  name: string;
}
