import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { ConcertCountResponseDto, ConcertResponseDto, CreateConcertDto, UpdateConcertDto } from "./dto/concert.dto";

@Injectable()
export class ConcertService {
    constructor(private readonly prisma: PrismaService) { }

    async getConcerts(): Promise<ConcertResponseDto[]> {
        const concerts = await this.prisma.concert.findMany({
            orderBy: {
                id: 'asc'
            }
        });

        return concerts.map((concert) => ({
            id: concert.id,
            name: concert.name,
            detail: concert.detail,
            limit: concert.limit,
            bookedCount: concert.bookedCount,
            createdAt: concert.createdAt,
            updatedAt: concert.updatedAt,
        }));
    }

    async getConcertById(id: number): Promise<ConcertResponseDto | null> {
        const concert = await this.prisma.concert.findUnique({
            where: { id },
        });

        if (!concert) {
            return null;
        }

        return {
            id: concert.id,
            name: concert.name,
            detail: concert.detail,
            limit: concert.limit,
            bookedCount: concert.bookedCount,
            createdAt: concert.createdAt,
            updatedAt: concert.updatedAt,
        };
    }

    async getAllConcertCount(): Promise<ConcertCountResponseDto> {
        const concert = await this.prisma.concert.findMany();
        const count = concert.reduce((acc, data) => acc + data.limit, 0);
        const bookedCount = concert.reduce((acc, data) => acc + data.bookedCount, 0);
        const cancelCount = await this.prisma.bookHistory.count({
            where: {
                status: 'CANCEL'
            },
            orderBy: {
                id: 'asc'
            }
        })

        return { count, bookedCount, cancelCount: cancelCount };

    }

    async createConcert(data: CreateConcertDto): Promise<ConcertResponseDto> {
        const concert = await this.prisma.concert.create({
            data,
        });

        return {
            id: concert.id,
            name: concert.name,
            detail: concert.detail,
            limit: concert.limit,
            bookedCount: concert.bookedCount,
            createdAt: concert.createdAt,
            updatedAt: concert.updatedAt,
        };
    }

    async updateConcert(id: number, data: UpdateConcertDto): Promise<ConcertResponseDto | null> {
        const concert = await this.prisma.concert.findUnique({
            where: { id },
        });

        if (!concert) {
            throw new BadRequestException('Concert not found');
        }

        const updatedConcert = await this.prisma.concert.update({
            where: { id },
            data,
        });

        return {
            id: updatedConcert.id,
            name: updatedConcert.name,
            detail: updatedConcert.detail,
            limit: updatedConcert.limit,
            bookedCount: updatedConcert.bookedCount,
            createdAt: updatedConcert.createdAt,
            updatedAt: updatedConcert.updatedAt,
        };
    }

    async deleteConcert(id: number): Promise<{ message: string } | null> {
        const concert = await this.prisma.concert.findUnique({
            where: { id },
        });

        if (!concert) {
            throw new BadRequestException('Concert not found');
        }

        await this.prisma.log.deleteMany({
            where: {
                concertId: id,
            },
        })

        await this.prisma.bookHistory.deleteMany({
            where: {
                concertId: id,
            },
        })

        await this.prisma.concert.delete({
            where: { id },
        });

        return {
            message: 'Concert deleted successfully',
        };
    }
}