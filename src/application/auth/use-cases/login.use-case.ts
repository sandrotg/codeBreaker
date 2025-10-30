import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { User } from "src/domain/users/entities/user.entity";
import type { TokenServicePort } from "src/domain/auth/token.repository.port";
import { LoginDto } from "../dto/login.dto";
import { TOKEN_SERVICE,USER_REPOSITORY } from "src/application/tokens";
import * as bcrypt from "bcrypt";
import { TokenPayload } from "src/domain/auth/token.repository.port";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: UserRepository,

    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenServicePort
  ) {}

  async execute(loginInput: LoginDto): Promise<{ user: User; token: string }> {
    // 1. Buscar usuario
    const user = await this.userRepo.findUserByEmail(loginInput.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 2. Verificar contraseña
    const validPassword = await bcrypt.compare(loginInput.password, user.passwordHash);
    if (!validPassword) {
      throw new Error("Contraseña incorrecta");
    }

    // 3. Crear el payload del token
    const payload: TokenPayload = {
      sub: user.userId!.toString(),
      email: user.email,
      roleId: user.roleId.toString(),
    };

    // 4. Generar token
    const accessToken = this.tokenService.generateAccessToken(payload);

    // 5. Retornar datos
    return {
      user,token: accessToken};
  }
}