import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenServicePort, TokenPayload } from 'src/domain/auth/token.repository.port';

@Injectable()
export class JwtTokenService implements TokenServicePort {
  constructor(private readonly jwtService: JwtService) {}


  // 🔐 Genera un access token válido por 15 minutos
  generateAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, { expiresIn: '15m' });
  }

  // ✅ Verifica un access token y devuelve el payload si es válido
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return this.jwtService.verify(token) as TokenPayload;
    } catch {
      return null;
    }
  }
}