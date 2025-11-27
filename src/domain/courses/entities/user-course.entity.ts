export class UserCourse {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly email: string,
    public readonly roleId: string,
    public readonly score?: number
  ) { }
}