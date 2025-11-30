export class Role {
  constructor(
    public readonly roleId: string,
    public readonly name: roleName,
  ) { }
}

export enum roleName {
    ADMIN =  'Admin',
    STUDENT = 'Student',
    PROFESSOR = 'Professor'
}


