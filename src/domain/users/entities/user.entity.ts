export class User {
  constructor(
    public readonly userId: number | null,
    public readonly username: string,
    public readonly passwordHash: string,
    public readonly roleId: number,
    public readonly email: string,
    public readonly status: 'active' | 'inactive' ,
    public readonly createdAt: Date
  ) {}
}