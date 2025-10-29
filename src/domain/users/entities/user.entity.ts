export class User {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly roleId: string,
    public readonly createdAt: Date
  ) { }
}