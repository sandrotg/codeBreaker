import { Inject, Injectable } from "@nestjs/common";
import { User } from "src/domain/users/entities/user.entity";
import type { UserRepository } from "src/domain/users/repositories/user.repository.port";
import { CreateUserDto } from "../dto/createUser.dto";
import * as bcrypt from "bcrypt";
import { USER_REPOSITORY } from "src/application/tokens";
import { randomUUID } from "crypto";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository
  ){}

  async execute(userInput: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepo.findUserByEmail(userInput.email);
    if (existingUser !== null){
      throw new Error('User already exists')
    }
    const passwordHash = await bcrypt.hash(userInput.password, 10)
    const user = new User(
      randomUUID(),
      userInput.userName,
      userInput.email,
      passwordHash,
      userInput.roleId,
      new Date()
    );
    return this.userRepo.save(user);
  }
}