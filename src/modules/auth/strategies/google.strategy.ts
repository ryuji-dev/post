import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { SocialConfigService } from 'src/config/social/config.service';
import { SocialType } from 'src/modules/users/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private socialConfigService: SocialConfigService,
    private userService: UsersService,
  ) {
    super({
      clientID: socialConfigService.googleClientId as string,
      clientSecret: socialConfigService.googleClientSecret as string,
      callbackURL:
        socialConfigService.googleCallbackURL ||
        'http://localhost:3002/api/v1/auth/signin/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user = await this.userService.findUserBySocialId(
      profile.id,
      SocialType.GOOGLE,
    );
    if (!user) {
      const newUser = await this.userService.createUser({
        email: profile._json.email as string,
        name: profile._json.name as string,
        socialId: profile._json.sub,
        socialType: SocialType.GOOGLE,
      });
      done(null, newUser);
    } else {
      done(null, user);
    }
  }
}
