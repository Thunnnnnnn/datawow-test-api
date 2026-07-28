import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class UserResponseDto {
    id!: number;
    email!: string;
    name!: string;
    role!: string;
    createdAt!: Date;
    updatedAt!: Date;
}

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password!: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    confirmPassword!: string;

    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
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
