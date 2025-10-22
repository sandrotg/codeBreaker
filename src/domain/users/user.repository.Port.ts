import { User } from "./user.entity";

export interface UserRepositoryPort {
    save(user: User): Promise<User>;
    login(email: string, password: string): Promise<void>;
    getUserByEmail(email: string): Promise<User>;
    update(user:User): Promise<User>;
    delete(idUser: string): Promise<void>;
}