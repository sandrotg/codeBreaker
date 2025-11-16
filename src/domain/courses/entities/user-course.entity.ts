export class UserCourse {
  constructor(
    public readonly userName: string,
    public readonly email: string,
    public readonly roleId: number,
    public readonly score?: number
  ) { }
}