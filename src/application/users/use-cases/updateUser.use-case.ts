import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/domain/users/entities/user.entity";
import type { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { UpdateUserDto } from "../dto/updateUser.dto";
import * as bcrypt from "bcrypt";
import { USER_REPOSITORY } from "src/application/tokens";

@Injectable()
export class UpdateUserUseCase{
    constructor(
        @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository
    ){}
    
    async execute(updateInput: UpdateUserDto): Promise<User>{
        let passwordHash:string;
        const user = await this.userRepo.findUserById(updateInput.userId);
        if(user === null){
            throw new Error("user doesn't exists")
        }

        if(updateInput.password){
            passwordHash = await bcrypt.hash(updateInput.password, 10);
        } else {
            passwordHash = user.passwordHash;
        }
        
        const updatedUser = new User(
            user.userId,
            updateInput.username ?? user.username,
            passwordHash,
            user.roleId,
            updateInput.email ?? user.email,
            user.status,
            user.createdAt
        )

        return await this.userRepo.update(updatedUser);
    }
}