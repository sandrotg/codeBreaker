export interface TokenPayload {
    sub: string;
    email: string;
    roleId: string
}

export interface TokenPair{
    accessToken: string;
    refreshToken: string
}

export interface TokenServicePort{
    generateAccessToken(payload:TokenPayload): string;
    verifyAccessToken(token:string): TokenPayload | null;
    generateRefreshToken(payload:TokenPayload): string;
    verifyRefreshToken(token:string): TokenPayload | null;
    generateTokenPair(payload:TokenPayload):TokenPair
}