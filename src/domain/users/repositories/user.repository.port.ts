import { User } from "../entities/user.entity";

export interface UserRepository {
    save(user: User): Promise<User>;
    findUserById(userId: string): Promise<User | null>;
    update(user: User): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
}