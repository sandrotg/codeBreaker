export class Role {
  constructor(
    public readonly roleId: string,
    public readonly name: roleName,
    public readonly permissions: string[]
  ) { }
}

export enum roleName {
    ADMIN =  'Admin',
    STUDENT = 'Student',
}


