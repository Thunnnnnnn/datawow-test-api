import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthResponseDto {
    token!: string;
}

export class LoginRequestDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;
}