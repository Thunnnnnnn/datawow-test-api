import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../database/prisma.service";
import { AuthResponseDto, LoginRequestDto } from "./dto/auth.dto";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }

    async login(user: LoginRequestDto): Promise<AuthResponseDto> {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: user.email },
        });

        if (!existingUser) {
            throw new BadRequestException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);

        if (!isPasswordValid) {
            throw new BadRequestException('Invalid email or password');
        }

        const payload = { sub: existingUser.id, email: existingUser.email, role: existingUser.role };
        const token = this.jwtService.sign(payload);
        return { token };
    }
}