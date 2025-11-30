import { Inject, Injectable } from '@nestjs/common';
import type { UserRepository } from 'src/domain/users/repositories/user.repository.port';
import { USER_REPOSITORY } from 'src/application/tokens';
import { Course } from 'src/domain/courses/entities/course.entity';

@Injectable()
export class GetCoursesByStudentUseCase {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: UserRepository,
  ) {}

  async execute(userId: string): Promise<Course[]> {
    
    const user = await this.userRepo.findUserById(userId);

    if(!user){
      throw new Error("User not found")
    }
    
    const courses = await this.userRepo.findCoursesByStudent(userId);

    if (!courses || courses.length === 0) {
      throw new Error('No courses found for this student');
    }

    return courses;
  }
}


