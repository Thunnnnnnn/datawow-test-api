
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { LogResponseDto } from './dto/log.dto';

@Injectable()
export class LogService {
    constructor(private readonly prisma: PrismaService) { }

    async getLogs(): Promise<LogResponseDto[]> {
        const logs = await this.prisma.log.findMany({
            include: {
                user: true,
                concert: true,
            },
        });

        return logs.map((log) => ({
            id: log.id,
            action: log.action,
            userId: log.userId,
            user: {
                id: log.user.id,
                email: log.user.email,
                name: log.user.name,
                role: log.user.role,
                createdAt: log.user.createdAt,
                updatedAt: log.user.updatedAt,
            },
            concertId: log.concertId,
            concert: {
                id: log.concert.id,
                name: log.concert.name,
                detail: log.concert.detail,
                limit: log.concert.limit,
                bookedCount: log.concert.bookedCount,
                createdAt: log.concert.createdAt,
                updatedAt: log.concert.updatedAt,
            },
            createdAt: log.createdAt,
        }));
    }
}