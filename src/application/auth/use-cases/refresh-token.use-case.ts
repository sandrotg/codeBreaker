import { Injectable } from "@nestjs/common";
import type { UserRepository } from "src/domain/users/repositories/user.repository.port";
import type { TokenServicePort } from "src/domain/auth/token.repository.port";
import { RefreshTokenDTO } from "../dto/refresh-token.dto";
import { TokenPair } from "src/domain/auth/token.repository.port";
import { User } from "src/domain/users/entities/user.entity";

@Injectable()
export class RefreshTokenUseCase{
    constructor(
        private readonly userRepo:UserRepository,
        private readonly tokenService: TokenServicePort
    ){}

    async execute (Input:RefreshTokenDTO) : Promise<{user:User,tokens: TokenPair}>{
        const payload =this.tokenService.verifyRefreshToken(Input.refreshToken);
        if(!payload){
            throw new Error('Invalid refresh token')
        }

        const user = await this.userRepo.findUserById(payload.sub);
        if(!user){
            throw new Error('User not found')
        }

        const TokenPayload={
            sub: user.userId!,
            email: user.email,
            roleId:user.roleId
        }
        
        const tokenPair = this.tokenService.generateTokenPair(TokenPayload)

        return { user, tokens: tokenPair }

    }
}