    export class Role {
  constructor(
    public readonly roleId: number | null,
    public readonly name: 'Admin' | 'Student' ,
    public readonly permissions?: string | null
  ) {}
}