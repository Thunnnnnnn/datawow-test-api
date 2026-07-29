import { Test, TestingModule } from '@nestjs/testing';
import { ConcertService } from './concert.service';
import { PrismaService } from '../../database/prisma.service';

describe('ConcertService', () => {
    let concertService: ConcertService;

    const prismaMock = {
        concert: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        log: {
            create: jest.fn(),
            deleteMany: jest.fn(),
        },
        bookHistory: {
            deleteMany: jest.fn(),
            create: jest.fn(),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                ConcertService, {
                    provide: PrismaService,
                    useValue: prismaMock,
                },],
        }).compile();

        concertService = app.get<ConcertService>(ConcertService);
    });

    describe('[GET] /concerts', () => {
        it('ดึงข้อมูลคอนเสิร์ตทั้งหมด', async () => {
            const concerts = [
                {
                    id: 1,
                    name: 'Concert 1',
                    detail: 'Detail 1',
                    limit: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            prismaMock.concert.findMany.mockResolvedValue(concerts);

            const result = await concertService.getConcerts();

            expect(result).toEqual(concerts);
        });
    })

    describe('[GET] /concerts/:id', () => {
        it('ดึงข้อมูลคอนเสิร์ตตาม id', async () => {
            const concert = {
                id: 1,
                name: 'Concert 1',
                detail: 'Detail 1',
                limit: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.concert.findUnique.mockResolvedValue(concert);

            const result = await concertService.getConcertById(1);

            expect(result).toEqual(concert);
        });

        it('คืนค่า null หากไม่พบคอนเสิร์ต', async () => {
            prismaMock.concert.findUnique.mockResolvedValue(null);

            const result = await concertService.getConcertById(1);

            expect(result).toBeNull();
        });
    })

    describe('[POST] /concerts', () => {
        it('สร้างคอนเสิร์ตใหม่', async () => {
            const concertData = {
                name: 'Concert 1',
                detail: 'Detail 1',
                limit: 100,
            };

            const createdConcert = {
                id: 1,
                ...concertData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.concert.create.mockResolvedValue(createdConcert);

            const result = await concertService.createConcert(concertData);

            expect(result).toEqual(createdConcert);
        });
    })

    describe('[PUT] /concerts/:id', () => {
        it('อัปเดตข้อมูลคอนเสิร์ต', async () => {
            const concertData = {
                name: 'Updated Concert',
                detail: 'Updated Detail',
                limit: 200,
            };

            const updatedConcert = {
                id: 1,
                ...concertData,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.concert.findUnique.mockResolvedValue(updatedConcert);
            prismaMock.concert.update.mockResolvedValue(updatedConcert);

            const result = await concertService.updateConcert(1, concertData);

            expect(result).toEqual(updatedConcert);
        });

        it('โยน BadRequestException หากไม่พบคอนเสิร์ต', async () => {
            prismaMock.concert.findUnique.mockResolvedValue(null);

            await expect(concertService.updateConcert(1, {
                name: 'Updated Concert',
                detail: 'Updated Detail',
                limit: 200,
            })).rejects.toThrow('Concert not found');
        });
    });

    describe('[DELETE] /concerts/:id', () => {
        it('ลบคอนเสิร์ตตาม id', async () => {
            const concert = {
                id: 1,
                name: 'Concert 1',
                detail: 'Detail 1',
                limit: 100,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const log = [{
                id: 1,
                action: "CANCEL",
                concertId: 1,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }]

            const bookHistory = [{
                id: 1,
                concertId: 1,
                userId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            }];

            prismaMock.log.create.mockResolvedValue(log);
            prismaMock.bookHistory.create.mockResolvedValue(bookHistory);
            prismaMock.concert.findUnique.mockResolvedValue(concert);
            prismaMock.concert.delete.mockResolvedValue(concert);
            prismaMock.log.deleteMany.mockResolvedValue({ count: 1 });
            prismaMock.bookHistory.deleteMany.mockResolvedValue({ count: 1 });

            const result = await concertService.deleteConcert(1);

            expect(result).toEqual({ message: 'Concert deleted successfully' });
        });

        it('โยน BadRequestException หากไม่พบคอนเสิร์ต', async () => {
            prismaMock.concert.findUnique.mockResolvedValue(null);

            await expect(concertService.deleteConcert(1)).rejects.toThrow('Concert not found');
        });
    });
});