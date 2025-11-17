import { User } from "src/domain/users/entities/user.entity";
import { Course } from "../entities/course.entity";
import { UserCourse } from "../entities/user-course.entity";

export interface CourseRepositoryPort {
    save(admin: User, course: Course): Promise<Course>;
    //remove(nrc: number): Promise<void>;
    addUsers(course: Course, users: User[]): Promise<void>;
    getAllUsers(nrc: number): Promise<UserCourse[] | null>;
    //removeUser(nrc: number, email: string): Promise<void>;
    getByNrc(nrc: number): Promise<Course | null>;
    getByTitle(title: string): Promise<Course[] | null>;
    addChallenge(nrc: number, challengeId: string): Promise<void>;
    getLeaderboard(nrc: number): Promise<UserCourse[] | null>;
    checkUserinCourse(nrc: number, userId: string): boolean;
}