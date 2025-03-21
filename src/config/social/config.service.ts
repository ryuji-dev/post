import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SocialConfigService {
  constructor(private configService: ConfigService) {}

  get googleClientId() {
    return this.configService.get<string>('social.google.clientId');
  }

  get googleClientSecret() {
    return this.configService.get<string>('social.google.clientSecret');
  }

  get googleCallbackURL() {
    return this.configService.get<string>('social.google.callbackURL');
  }
}
