import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/users/entities/user.entity';
import type { UserRepository } from 'src/domain/users/repositories/user.repository.port';
import { USER_REPOSITORY } from 'src/application/tokens';

@Injectable()
export class GetAllStudentsUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async execute(name?: string): Promise<User[]> {
    const students = await this.userRepo.findAllStudents(name);

    if (!students || students.length === 0) {
      throw new Error('students not found');
    }

    return students;
  }
}
