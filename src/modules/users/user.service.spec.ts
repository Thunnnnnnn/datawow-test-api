import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../../database/prisma.service';

describe('UserService', () => {
    let userService: UserService;

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
            providers: [
                UserService, {
                    provide: PrismaService,
                    useValue: prismaMock,
                },],
        }).compile();

        userService = app.get<UserService>(UserService);
    });

    describe('[GET] /user', () => {
        it('ดึงข้อมูลผู้ใช้ทั้งหมด', async () => {
            const users = [
                {
                    id: 1,
                    name: 'John',
                    email: 'john@test.com',
                    role: 'USER',
                },
            ];

            prismaMock.user.findMany.mockResolvedValue(users);

            const result = await userService.getUsers();

            expect(result).toEqual(users);
        });
    })

    describe('[GET] /user/:id', () => {
        it('ดึงข้อมูลผู้ใช้ตาม id', async () => {
            const user = {
                id: 1,
                name: 'John',
                email: 'john@test.com',
                role: 'USER',
            };

            prismaMock.user.findUnique.mockResolvedValue(user);

            const result = await userService.getUserById(1);

            expect(result).toEqual(user);
        });

        it('คืนค่า null หากไม่พบผู้ใช้ตาม id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            const result = await userService.getUserById(1);

            expect(result).toBeNull();
        });
    })

    describe('[POST] /user', () => {
        it('สร้างผู้ใช้ใหม่', async () => {
            const user = {
                id: 1,
                name: 'John',
                email: 'john@test.com',
                role: 'USER',
            };

            prismaMock.user.findUnique.mockResolvedValue(null);
            prismaMock.user.create.mockResolvedValue(user);

            const result = await userService.createUser({
                name: 'John',
                email: 'john@test.com',
                password: 'password',
                role: 'USER',
            });

            expect(result).toEqual(user);
        });

        it('จะเกิดข้อผิดพลาดเมื่อสร้างผู้ใช้ที่มีอีเมลซ้ำ', async () => {
            const user = {
                id: 1,
                name: 'John',
                email: 'john@test.com',
                role: 'USER',
            };

            prismaMock.user.findUnique.mockResolvedValue(user);

            await expect(userService.createUser({
                name: 'John',
                email: 'john@test.com',
                password: 'password',
                role: 'USER',
            })).rejects.toThrow('User with this email already exists');
        });
    })

    describe('[PUT] /user/:id', () => {
        it('อัพเดทข้อมูลผู้ใช้ตาม id', async () => {
            const user = {
                id: 1,
                name: 'John',
                email: 'john1@test.com',
                role: 'USER',
            };

            prismaMock.user.findUnique.mockResolvedValue(user);
            prismaMock.user.update.mockResolvedValue(user);

            const result = await userService.updateUser(1, {
                name: 'John',
                email: 'john@test.com',
                password: 'password',
                role: 'USER',
            });

            expect(result).toEqual(user);
        })

        it('ไม่พบผู้ใช้ตาม id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.updateUser(1, {
                name: 'John',
                email: 'john@test.com',
                password: 'password',
                role: 'USER',
            })).rejects.toThrow('User not found');
        });

        it('จะเกิดข้อผิดพลาดเมื่ออัพเดทผู้ใช้ที่มีอีเมลซ้ำ', async () => {
            const user = [{
                id: 1,
                name: 'John',
                email: 'john@test.com',
                role: 'USER',
            }, {
                id: 2,
                name: 'Jane',
                email: 'jane@test.com',
                role: 'USER',
            }];

            prismaMock.user.findUnique.mockResolvedValue(user);

            await expect(userService.updateUser(2, {
                name: 'John',
                email: 'john@test.com',
                password: 'password',
                role: 'USER',
            })).rejects.toThrow('User with this email already exists');
        });
    });

    describe('[DELETE] /user/:id', () => {
        it('ลบผู้ใช้ตาม id', async () => {
            const user = {
                id: 1,
                name: 'John',
                email: 'john@test.com',
                role: 'USER',
            }

            prismaMock.user.findUnique.mockResolvedValue(user);
            prismaMock.user.delete.mockResolvedValue(user);

            const result = await userService.deleteUser(1);

            expect(result).toEqual({ message: 'User deleted successfully' });
        });

        it('ไม่พบผู้ใช้ตาม id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null);

            await expect(userService.deleteUser(2)).rejects.toThrow('User not found');
        });
    });
});

