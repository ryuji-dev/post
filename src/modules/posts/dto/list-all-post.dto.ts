import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export enum OrderOption {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum OrderByOption {
  CREATED_AT = 'createdAt',
  VIEWS = 'views',
}

export class ListAllPostDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  content: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  userId: string;

  @IsEnum(OrderByOption)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: OrderByOption,
    description: '정렬할 필드',
    default: OrderByOption.CREATED_AT,
  })
  orderBy: OrderByOption = OrderByOption.CREATED_AT;

  @IsEnum(OrderOption)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: OrderOption,
    description: '정렬 방식(ASC 또는 DESC)',
    default: OrderOption.DESC,
  })
  order: OrderOption = OrderOption.DESC;
}
