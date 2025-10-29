import { Injectable } from "@nestjs/common";
import type { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { User } from "src/domain/users/entities/user.entity";
import { PrismaService } from "src/infrastructure/prisma.service";

@Injectable()
export class PrismaUserRepository implements UserRepository{
    constructor(
        private readonly prisma:PrismaService
    ){}

    async save(user:User): Promise<User>{
        const saved = await this.prisma.user.create({
            data:{
                username: user.userName,
                passwordHash:user.passwordHash,
                roleId:user.roleId,
                email: user.email,
                createdAt: user.createdAt
            }
        });
        return new User(
            saved.userId,
            saved.username,
            saved.passwordHash,
            saved.roleId,
            saved.email,
            saved.createdAt
        )
    }
    async findUserByEmail(email: string): Promise<User | null> {
       return await this.prisma.user.findUnique({where:{email}})
        
    }

    async findUserById(userId: string): Promise<User | null> {
        return await this.prisma.user.findUnique({where:{userId}})
    }

    async update(user: User): Promise<User> {
        if (user.userId === null){
            throw new Error("User Id is required for update")
        }
        const updatedUser = await this.prisma.user.update({
            where:{
                userId: user.userId
            },
            data:{
                username: user.userName,
                passwordHash:user.passwordHash,
                email: user.email,
            }
        })
        return new User(
            updatedUser.userId,
            updatedUser.username,
            updatedUser.passwordHash,
            updatedUser.roleId,
            updatedUser.email,
            updatedUser.createdAt
        )
    }
    
}