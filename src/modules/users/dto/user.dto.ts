import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserResponseDto {
    id!: number;
    email!: string;
    name!: string;
    role!: string;
}

export class CreateUserDto {
    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    name!: string;

    @IsString()
    role!: string;
}

export class UpdateUserDto {
    @IsEmail()
    email?: string;

    @IsString()
    @MinLength(6)
    password?: string;

    @IsString()
    name?: string;

    @IsString()
    role?: string;
}
