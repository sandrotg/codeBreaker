import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "EUSECRETO",
    });
  }

  async validate(payload: any) {
    // Aquí retornas lo que quieras disponible en request.user
    return {
      userId: payload.userId,
      email: payload.email,
      roleId: payload.roleId,
      roleName: payload.roleName,
    };
  }
}

