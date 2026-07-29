import { Test, TestingModule } from '@nestjs/testing';
import { BookHistoriesService } from './book-histories.service';
import { PrismaService } from '../../database/prisma.service';

describe('BookHistoriesService', () => {
    let bookHistoriesService: BookHistoriesService;

    const prismaMock = {
        bookHistory: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        concert: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
        log: {
            create: jest.fn(),
        }
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                BookHistoriesService, {
                    provide: PrismaService,
                    useValue: prismaMock,
                },],
        }).compile();

        bookHistoriesService = app.get<BookHistoriesService>(BookHistoriesService);
    });

    describe('[GET] /book-histories', () => {
        it('ดึงข้อมูลประวัติการจองตั๋วคอนเสิร์ตทั้งหมด', async () => {
            const bookHistories = [
                {
                    id: 1,
                    userId: 1,
                    concertId: 1,
                    user: {
                        id: 1,
                        email: 'test@example.com',
                        name: 'Test User',
                        role: 'USER',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    concert: {
                        id: 1,
                        name: 'Test Concert',
                        detail: 'Concert Detail',
                        limit: 100,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            prismaMock.bookHistory.findMany.mockResolvedValue(bookHistories);

            const result = await bookHistoriesService.getBookHistories();

            expect(result).toEqual(bookHistories);
        });
    });

    describe('[GET] /book-histories/:id', () => {
        it('ดึงข้อมูลประวัติการจองตั๋วคอนเสิร์ตตาม id', async () => {
            const bookHistory = {
                id: 1,
                userId: 1,
                concertId: 1,
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'USER',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                concert: {
                    id: 1,
                    name: 'Test Concert',
                    detail: 'Concert Detail',
                    limit: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.bookHistory.findUnique.mockResolvedValue(bookHistory);

            const result = await bookHistoriesService.getBookHistoryById(1);

            expect(result).toEqual(bookHistory);
        });

        it('โยน BadRequestException หากไม่พบประวัติการจองตั๋วคอนเสิร์ต', async () => {
            prismaMock.bookHistory.findUnique.mockResolvedValue(null);

            const result = bookHistoriesService.getBookHistoryById(1)

            await expect(result).rejects.toThrow('Book history not found');
        });
    });

    describe('[POST] /book-histories', () => {
        it('สร้างประวัติการจองตั๋วคอนเสิร์ตใหม่', async () => {
            const concertData = {
                id: 1,
                name: 'Concert 1',
                detail: 'Detail 1',
                limit: 100,
            }

            const userData = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const bookHistoryData = {
                userId: 1,
                concertId: 1,
            };

            const createdBookHistory = {
                id: 1,
                userId: 1,
                concertId: 1,
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'USER',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                concert: {
                    id: 1,
                    name: 'Test Concert',
                    detail: 'Concert Detail',
                    limit: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.concert.findUnique.mockResolvedValue(concertData);
            prismaMock.user.findUnique.mockResolvedValue(userData);
            prismaMock.bookHistory.create.mockResolvedValue(createdBookHistory);

            const result = await bookHistoriesService.createBookHistory(bookHistoryData);

            expect(result).toEqual(createdBookHistory);
        });

        it('ไม่เจอ id ของคอนเสิร์ต', async () => {
            const bookHistoryData = {
                userId: 1,
                concertId: 1,
            };

            prismaMock.concert.findUnique.mockResolvedValue(null);

            await expect(bookHistoriesService.createBookHistory(bookHistoryData)).rejects.toThrow('Concert not found');
        });

        it('คอนเสิร์ตเต็มแล้ว', async () => {
            prismaMock.bookHistory.findFirst.mockResolvedValue(null);

            const concertData = {
                id: 1,
                name: 'Concert 1',
                detail: 'Detail 1',
                limit: 0,
                bookedCount: 0,
            }

            const userData = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            const bookHistoryData = {
                userId: 1,
                concertId: 1,
            };

            prismaMock.concert.findUnique.mockResolvedValue(concertData);
            prismaMock.user.findUnique.mockResolvedValue(userData);

            await expect(bookHistoriesService.createBookHistory(bookHistoryData)).rejects.toThrow('Concert is fully booked');
        });
    });

    describe('[PUT] /book-histories/:id', () => {
        it('อัปเดตข้อมูลประวัติการจองตั๋วคอนเสิร์ต', async () => {
            const bookHistoryData = {
                userId: 1,
                concertId: 1,
            };

            const updatedBookHistory = {
                id: 1,
                userId: 1,
                concertId: 1,
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'USER',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                concert: {
                    id: 1,
                    name: 'Concert 1',
                    detail: 'Detail 1',
                    limit: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.bookHistory.findUnique.mockResolvedValue(updatedBookHistory);
            prismaMock.bookHistory.update.mockResolvedValue(updatedBookHistory);

            const result = await bookHistoriesService.updateBookHistory(1, bookHistoryData);

            expect(result).toEqual(updatedBookHistory);
        });

        it('โยน BadRequestException หากไม่พบประวัติการจองตั๋วคอนเสิร์ต', async () => {
            prismaMock.bookHistory.findUnique.mockResolvedValue(null);

            const result = bookHistoriesService.updateBookHistory(1, {
                userId: 1,
                concertId: 1,
            });

            await expect(result).rejects.toThrow('Book history not found');
        });
    });

    describe('[DELETE] /book-histories/:id', () => {
        it('ลบประวัติการจองตั๋วคอนเสิร์ตตาม id', async () => {
            const bookHistory = {
                id: 1,
                userId: 1,
                concertId: 1,
                user: {
                    id: 1,
                    email: 'test@example.com',
                    name: 'Test User',
                    role: 'USER',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                concert: {
                    id: 1,
                    name: 'Test Concert',
                    detail: 'Concert Detail',
                    limit: 100,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.bookHistory.findUnique.mockResolvedValue(bookHistory);
            prismaMock.bookHistory.delete.mockResolvedValue(bookHistory);

            const result = await bookHistoriesService.deleteBookHistory(1);

            expect(result).toEqual({ message: 'Book history deleted successfully' });
        });

        it('โยน BadRequestException หากไม่พบประวัติการจองตั๋วคอนเสิร์ต', async () => {
            prismaMock.bookHistory.findUnique.mockResolvedValue(null);

            const result = bookHistoriesService.deleteBookHistory(1);

            await expect(result).rejects.toThrow('Book history not found');
        });
    });
});