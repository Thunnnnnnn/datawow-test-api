import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UserResponseDto, CreateUserDto, UpdateUserDto } from './dto/user.dto';
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
        };
    }

    async createUser(data: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.prisma.user.create({
            data,
        });

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        };
    }

    async updateUser(id: number, data: Partial<UpdateUserDto>): Promise<UserResponseDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return null;
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
        };
    }

    async deleteUser(id: number): Promise<UserResponseDto | null> {
        const user = await this.prisma.user.delete({
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
        };
    }
}