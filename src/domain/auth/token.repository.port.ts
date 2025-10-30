export interface TokenPayload {
    sub: string;
    email: string;
    roleId: string
}

export interface TokenPair{
    accessToken: string;
}

export interface TokenServicePort{
    generateAccessToken(payload:TokenPayload): string;
    verifyAccessToken(token:string): TokenPayload | null;
}