import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getUsers(): Promise<any[]> {
        const user = await this.prisma.user.findMany();

        return user.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        }));
    }
}
