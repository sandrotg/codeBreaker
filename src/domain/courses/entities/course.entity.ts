import { Challenge } from "src/domain/challenges/entities/challenges.entity";
import { UserCourse } from "./user-course.entity";

export class Course{
    constructor(
        public readonly courseId: string,
        public readonly title: string,
        public readonly nrc: number,
        public readonly period: string,
        public readonly group: number,
        public readonly users?: UserCourse[],
        public readonly challenges?: Challenge[],
        //public readonly evaluations?: Evaluation[]
    ){}
}