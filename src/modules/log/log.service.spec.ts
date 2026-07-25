import { Test, TestingModule } from '@nestjs/testing';
import { LogService } from './log.service';
import { PrismaService } from '../../database/prisma.service';

describe('LogService', () => {
    let logService: LogService;

    const prismaMock = {
        log: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                LogService, {
                    provide: PrismaService,
                    useValue: prismaMock,
                },],
        }).compile();

        logService = app.get<LogService>(LogService);
    });

    describe('[GET] /log', () => {
        it('ดึงข้อมูล log ทั้งหมด', async () => {
            const logs = [
                {
                    id: 1,
                    action: 'CREATE',
                    userId: 1,
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
                    concertId: 1,
                    createdAt: new Date(),
                },
            ];

            prismaMock.log.findMany.mockResolvedValue(logs);

            const result = await logService.getLogs();

            expect(result).toEqual(logs);
        });
    });
}); 