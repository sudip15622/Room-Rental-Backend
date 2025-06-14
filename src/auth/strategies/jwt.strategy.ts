import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import jwtConfig from '../configs/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthJwtPayload } from '../types/auth-jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(jwtConfig.KEY) private jwtConfiguation: ConfigType<typeof jwtConfig>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguation.secret!,
    });
  }

  async validate(payload: AuthJwtPayload) {
    // console.log(payload)
    return { id: payload.sub };
  }
}
