import bcrypt from 'bcrypt';

export class PasswordHasherService {
    private readonly saltRounds: number;

    constructor() {
        this.saltRounds = 10; // Número de rondas de sal para bcrypt
    }
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}
