import { Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('image')
@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '이미지 업로드',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('upload')
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imagesService.uploadImage(file, 'files');
  }
}
