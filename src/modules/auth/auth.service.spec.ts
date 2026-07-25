import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../database/prisma.service';
import { UserModule } from '../users/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let authService: AuthService;

    const prismaMock = {
        user: {
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
            imports: [
                UserModule,
                JwtModule.register({
                    global: true,
                    secret: jwtConstants.secret,
                    signOptions: { expiresIn: '12h' },
                }),
            ],
            providers: [
                AuthService, {
                    provide: PrismaService,
                    useValue: prismaMock,
                },],
        }).compile();

        authService = app.get<AuthService>(AuthService);
    });

    describe('[POST] /auth/login', () => {
        it('เข้าสู่ระบบสำเร็จ', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue({
                ...user,
                password: await bcrypt.hash('password', 10),
            });
            const result = await authService.login({ email: 'test@example.com', password: 'password' });
            expect(result).toHaveProperty('token');
        });

        it('เข้าสู่ระบบไม่สำเร็จ - email ไม่ถูกต้อง', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(authService.login({ email: 'test@example.com', password: 'password' }))
                .rejects
                .toThrow('Invalid email or password');
        });

        it('เข้าสู่ระบบไม่สำเร็จ - password ไม่ถูกต้อง', async () => {
            const user = {
                id: 1,
                email: 'test@example.com',
                name: 'Test User',
                role: 'USER',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            prismaMock.user.findUnique.mockResolvedValue({
                ...user,
                password: await bcrypt.hash('password', 10),
            });

            await expect(authService.login({ email: 'test@example.com', password: 'wrongpassword' }))
                .rejects
                .toThrow('Invalid email or password');
        });
    });
});