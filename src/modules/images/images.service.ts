import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { S3Service } from '../s3/s3.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private s3Service: S3Service,
  ) {}

  async uploadImage(file: Express.Multer.File, dirPath: string) {
    const imageUrl = await this.s3Service.uploadFile(file, dirPath);
    const image = new Image();
    image.imageUrl = imageUrl;
    image.filePath = dirPath;
    return await this.imageRepository.save(image);
  }
}
