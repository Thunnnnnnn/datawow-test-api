import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UserResponseDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    async getUsers(): Promise<UserResponseDto[]> {
        const user = await this.prisma.user.findMany();

        return user.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    async getUserById(id: number): Promise<UserResponseDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async createUser(data: CreateUserDto): Promise<UserResponseDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        data.password = await bcrypt.hash(data.password, 10);

        const user = await this.prisma.user.create({
            data,
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }

    async updateUser(id: number, data: Partial<UpdateUserDto>): Promise<UserResponseDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser && existingUser.id !== id) {
            throw new BadRequestException('User with this email already exists');
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data,
        });

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        };
    }

    async deleteUser(id: number): Promise<{ message: string } | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new BadRequestException('User not found');
        }
        await this.prisma.user.delete({
            where: { id },
        });

        return {
            message: 'User deleted successfully',
        };
    }
}