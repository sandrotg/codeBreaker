export class User{
    constructor(
        private readonly idUser: string,
        private readonly email: string,
        private readonly password: string,
        private readonly name: string,
        private readonly idRol?: string,
    ){}
}

export enum Roles {
    ADMIN =  "ADMIN",
    STUDENT = "STUDENT"
}