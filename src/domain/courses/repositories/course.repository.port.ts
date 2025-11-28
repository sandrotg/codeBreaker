import { User } from "src/domain/users/entities/user.entity";
import { Course } from "../entities/course.entity";
import { UserCourse } from "../entities/user-course.entity";
import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { Evaluation } from "src/domain/evaluations/entities/evaluation.entity";

export interface CourseRepositoryPort {
    save(admin: User, course: Course): Promise<Course>;
    //remove(nrc: number): Promise<void>;
    addUsers(course: Course, users: UserCourse[]): Promise<void>;
    getAllUsers(course: Course): Promise<UserCourse[]>;
    //removeUser(nrc: number, email: string): Promise<void>;
    getByNrc(nrc: number): Promise<Course | null>;
    getByTitle(title: string): Promise<Course[]>;
    addChallenge(course: Course, challengeId: string): Promise<void>;
    getAllChallenges(course:Course): Promise<Challenge[]>;
    addEvaluation(course: Course, evaluationId: string): Promise<void>;
    getAllEvaluations(course:Course): Promise<Evaluation[]>;
    checkUserinCourse(course: Course, userId: string): Promise<boolean>;
    findAll(): Promise<Course[]>;
}