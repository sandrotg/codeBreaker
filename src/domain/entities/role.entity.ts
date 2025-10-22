    export class Role {
  constructor(
    public readonly roleId: number | null,
    public readonly name: 'Admin' | 'Professor' | 'Student' ,
    public readonly permissions?: string | null
  ) {}
}