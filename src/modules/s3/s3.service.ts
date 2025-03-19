import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AwsConfigService } from 'src/config/aws/config.service';

@Injectable()
export class S3Service {
  private s3: S3Client;

  constructor(private awsConfigService: AwsConfigService) {
    this.s3 = new S3Client({
      region: this.awsConfigService.awsRegion!,
      credentials: {
        accessKeyId: this.awsConfigService.awsAccessKeyId!,
        secretAccessKey: this.awsConfigService.awsSecretAccessKey!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, dirPath: string) {
    const fileName = `${dirPath}/${Date.now()}`;

    const uploadParams = {
      Bucket: this.awsConfigService.awsBucketName,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const result = await this.s3.send(new PutObjectCommand(uploadParams));
    console.log(result);
    return `https://${this.awsConfigService.awsBucketName}.s3.${this.awsConfigService.awsRegion}.amazonaws.com/${fileName}`;
  }
}
