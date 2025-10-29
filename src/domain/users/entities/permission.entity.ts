export class Permission {
    constructor(
        public readonly permissionId: string,
        public readonly roleId: string,
        public readonly name: string,
        public readonly description: string,
    ){}
}