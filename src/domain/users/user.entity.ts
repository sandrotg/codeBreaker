export class User{
    constructor(
        public readonly idUser: string,
        public readonly email: string,
        public readonly password: string,
        public readonly name: string,
        public readonly idRol?: string,
    ){}
}

export enum Roles {
    ADMIN =  "ADMIN",
    STUDENT = "STUDENT"
}