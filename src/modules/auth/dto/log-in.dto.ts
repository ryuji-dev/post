import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LogInDto {
  @ApiProperty({ type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ type: String })
  @IsString()
  password: string;
}
