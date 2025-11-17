import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/domain/users/entities/user.entity";
import type { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { GetUserDto } from "../dto/getUser.dto";
import { USER_REPOSITORY } from "src/application/tokens";

@Injectable()
export class GetUserUseCase{
  constructor (
    @Inject(USER_REPOSITORY) private readonly userRepo:UserRepository
  ){}

  async execute(searchInput:GetUserDto): Promise<User | null>{
    let user: User|null = null;
    if(searchInput.criteria === "email"){
      if(searchInput.email){
        user = await this.userRepo.findUserByEmail(searchInput.email);
      }
    }
    if (searchInput.criteria === "id"){
      if(searchInput.userId){
        user = await this.userRepo.findUserById(searchInput.userId);
      }
    }
    if(user === null){
      throw new Error("user not found");
    }
    return user;
  }
}