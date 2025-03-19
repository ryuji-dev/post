import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { AppConfigService } from 'src/config/app/config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private appConfigService: AppConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret!,
    });
  }

  async validate(payload: any) {
    const { sub } = payload;
    const user = await this.usersService.findUserByEmail(sub);
    console.log(user, sub);
    const { password, ...rest } = user;
    return rest;
  }
}
