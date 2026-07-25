import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { BookHistoryResponseDto, CreateBookHistoryDto, UpdateBookHistoryDto } from "./dto/book-histories.dto";

@Injectable()
export class BookHistoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async getBookHistories(): Promise<BookHistoryResponseDto[]> {
        const bookHistories = await this.prisma.bookHistory.findMany({
            include: {
                user: true,
                concert: true,
            },
        });

        return bookHistories.map((bookHistory) => ({
            id: bookHistory.id,
            userId: bookHistory.userId,
            concertId: bookHistory.concertId,
            createdAt: bookHistory.createdAt,
            updatedAt: bookHistory.updatedAt,
            user: {
                id: bookHistory.user.id,
                email: bookHistory.user.email,
                name: bookHistory.user.name,
                role: bookHistory.user.role,
                createdAt: bookHistory.user.createdAt,
                updatedAt: bookHistory.user.updatedAt,
            },
            concert: {
                id: bookHistory.concert.id,
                name: bookHistory.concert.name,
                detail: bookHistory.concert.detail,
                limit: bookHistory.concert.limit,
                createdAt: bookHistory.concert.createdAt,
                updatedAt: bookHistory.concert.updatedAt,
            },
        }));
    }

    async getBookHistoryById(id: number): Promise<BookHistoryResponseDto | null> {
        const bookHistory = await this.prisma.bookHistory.findUnique({
            where: { id },
            include: {
                user: true,
                concert: true,
            },
        });

        if (!bookHistory) {
            throw new BadRequestException('Book history not found');
        }

        return {
            id: bookHistory.id,
            userId: bookHistory.userId,
            concertId: bookHistory.concertId,
            createdAt: bookHistory.createdAt,
            updatedAt: bookHistory.updatedAt,
            user: {
                id: bookHistory.user.id,
                email: bookHistory.user.email,
                name: bookHistory.user.name,
                role: bookHistory.user.role,
                createdAt: bookHistory.user.createdAt,
                updatedAt: bookHistory.user.updatedAt,
            },
            concert: {
                id: bookHistory.concert.id,
                name: bookHistory.concert.name,
                detail: bookHistory.concert.detail,
                limit: bookHistory.concert.limit,
                createdAt: bookHistory.concert.createdAt,
                updatedAt: bookHistory.concert.updatedAt,
            },
        };
    }

    async getBookHistoriesByUserId(userId: number): Promise<BookHistoryResponseDto[]> {
        const bookHistories = await this.prisma.bookHistory.findMany({
            where: { userId },
            include: {
                user: true,
                concert: true,
            },
        });

        return bookHistories.map((bookHistory) => ({
            id: bookHistory.id,
            userId: bookHistory.userId,
            concertId: bookHistory.concertId,
            createdAt: bookHistory.createdAt,
            updatedAt: bookHistory.updatedAt,
            user: {
                id: bookHistory.user.id,
                email: bookHistory.user.email,
                name: bookHistory.user.name,
                role: bookHistory.user.role,
                createdAt: bookHistory.user.createdAt,
                updatedAt: bookHistory.user.updatedAt,
            },
            concert: {
                id: bookHistory.concert.id,
                name: bookHistory.concert.name,
                detail: bookHistory.concert.detail,
                limit: bookHistory.concert.limit,
                createdAt: bookHistory.concert.createdAt,
                updatedAt: bookHistory.concert.updatedAt,
            },
        }));
    }

    async createBookHistory(data: CreateBookHistoryDto): Promise<BookHistoryResponseDto> {
        const existingBookHistory = await this.prisma.bookHistory.findFirst({
            where: {
                userId: data.userId,
                concertId: data.concertId,
            },
        });

        if (existingBookHistory) {
            throw new BadRequestException('User has already booked this concert');
        }

        const existingConcert = await this.prisma.concert.findUnique({
            where: { id: data.concertId },
        });

        if (!existingConcert) {
            throw new BadRequestException('Concert not found');
        }

        if (existingConcert.limit <= 0) {
            throw new BadRequestException('Concert is fully booked');
        }

        const bookHistory = await this.prisma.bookHistory.create({
            data,
            include: {
                user: true,
                concert: true,
            },
        });

        await this.prisma.concert.update({
            where: { id: data.concertId },
            data: {
                limit: {
                    decrement: 1,
                },
            },
        });

        await this.prisma.log.create({
            data: {
                action: 'BOOKED',
                userId: data.userId,
                concertId: data.concertId,
            },
        });

        return {
            id: bookHistory.id,
            userId: bookHistory.userId,
            concertId: bookHistory.concertId,
            createdAt: bookHistory.createdAt,
            updatedAt: bookHistory.updatedAt,
            user: {
                id: bookHistory.user.id,
                email: bookHistory.user.email,
                name: bookHistory.user.name,
                role: bookHistory.user.role,
                createdAt: bookHistory.user.createdAt,
                updatedAt: bookHistory.user.updatedAt,
            },
            concert: {
                id: bookHistory.concert.id,
                name: bookHistory.concert.name,
                detail: bookHistory.concert.detail,
                limit: bookHistory.concert.limit,
                createdAt: bookHistory.concert.createdAt,
                updatedAt: bookHistory.concert.updatedAt,
            },
        };
    }

    async updateBookHistory(id: number, data: Partial<UpdateBookHistoryDto>): Promise<BookHistoryResponseDto | null> {
        const bookHistory = await this.prisma.bookHistory.findUnique({
            where: { id },
            include: {
                user: true,
                concert: true,
            },
        });

        if (!bookHistory) {
            throw new BadRequestException('Book history not found');
        }

        const existingBookHistory = await this.prisma.bookHistory.findFirst({
            where: {
                userId: data.userId,
                concertId: data.concertId,
            },
        });

        if (existingBookHistory && existingBookHistory.id !== id) {
            throw new BadRequestException('User has already booked this concert');
        }

        if (data.userId) {
            const existingUser = await this.prisma.user.findUnique({
                where: { id: data.userId },
            });

            if (!existingUser) {
                throw new BadRequestException('User not found');
            }

            if (data.userId !== bookHistory.userId) {
                await this.prisma.log.create({
                    data: {
                        action: 'CHANGE USER',
                        userId: data.userId,
                        concertId: bookHistory.concertId,
                    },
                });
            }
        }

        if (data.concertId) {
            const existingConcert = await this.prisma.concert.findUnique({
                where: { id: data.concertId },
            });

            if (!existingConcert) {
                throw new BadRequestException('Concert not found');
            }

            if (data.concertId !== bookHistory.concertId) {
                await this.prisma.log.create({
                    data: {
                        action: 'CHANGE CONCERT',
                        userId: bookHistory.userId,
                        concertId: data.concertId,
                    },
                });
            }
        }

        const updatedBookHistory = await this.prisma.bookHistory.update({
            where: { id },
            data,
            include: {
                user: true,
                concert: true,
            },
        });

        return {
            id: updatedBookHistory.id,
            userId: updatedBookHistory.userId,
            concertId: updatedBookHistory.concertId,
            createdAt: updatedBookHistory.createdAt,
            updatedAt: updatedBookHistory.updatedAt,
            user: {
                id: updatedBookHistory.user.id,
                email: updatedBookHistory.user.email,
                name: updatedBookHistory.user.name,
                role: updatedBookHistory.user.role,
                createdAt: updatedBookHistory.user.createdAt,
                updatedAt: updatedBookHistory.user.updatedAt,
            },
            concert: {
                id: updatedBookHistory.concert.id,
                name: updatedBookHistory.concert.name,
                detail: updatedBookHistory.concert.detail,
                limit: updatedBookHistory.concert.limit,
                createdAt: updatedBookHistory.concert.createdAt,
                updatedAt: updatedBookHistory.concert.updatedAt,
            },
        };
    }

    async deleteBookHistory(id: number): Promise<{ message: string } | null> {
        const bookHistory = await this.prisma.bookHistory.findUnique({
            where: { id },
        });

        if (!bookHistory) {
            throw new BadRequestException('Book history not found');
        }

        await this.prisma.bookHistory.delete({
            where: { id },
        });

        await this.prisma.concert.update({
            where: { id: bookHistory.concertId },
            data: {
                limit: {
                    increment: 1,
                },
            },
        });

        await this.prisma.log.create({
            data: {
                action: 'CANCEL',
                userId: bookHistory.userId || 0,
                concertId: bookHistory.concertId || 0,
            },
        });

        return { message: 'Book history deleted successfully' };
    }
}