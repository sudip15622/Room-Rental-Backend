import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';
import { AuthService } from '../auth.service';
import refreshJwtConfig from '../configs/refresh-jwt.config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, "refresh-jwt") {
  constructor(
    @Inject(refreshJwtConfig.KEY)
    private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    private authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh"),
      secretOrKey: refreshJwtConfiguration.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  //request.user
  async validate (req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.body.refresh;
    // console.log(refreshToken);
    return await this.authService.validateRefreshToken(userId, refreshToken);
  }
}
