import jwt from 'jsonwebtoken';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';

export class JwtTokenService {
    private readonly jwtSecret: string;
    private readonly jwtExpiration: NonNullable<SignOptions['expiresIn']>;
    private readonly issuer: string;

    constructor({ jwtSecret, jwtExpiresIn }: { jwtSecret: string; jwtExpiresIn: string | number }) {
        this.jwtSecret = jwtSecret;
        this.jwtExpiration = jwtExpiresIn as NonNullable<SignOptions['expiresIn']>; // p.ej: '1h', '7d' o segundos
        this.issuer = 'PcCOMPONENTES_nodejs_server';
    }
    generateToken(payload: object): string {
        return jwt.sign(payload, this.jwtSecret, { issuer: this.issuer, expiresIn: this.jwtExpiration });
    }

    verifyToken(token: string): string | JwtPayload | null {
        try {
            return jwt.verify(token, this.jwtSecret, { issuer: this.issuer });
        } catch (err: unknown) {
            console.error('Error al verificar el token JWT:', err);
            return null;
        }
    }
}
