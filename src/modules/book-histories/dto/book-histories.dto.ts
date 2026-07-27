import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ConcertResponseDto } from "src/modules/concerts/dto/concert.dto";
import { UserResponseDto } from "src/modules/users/dto/user.dto";

export class BookHistoryResponseDto {
    id!: number;
    userId!: number;
    user!: UserResponseDto;
    concertId!: number;
    concert!: ConcertResponseDto;
    createdAt!: Date;
    updatedAt!: Date;
}

export class CreateBookHistoryDto {
    @IsNumber()
    @IsNotEmpty()
    userId!: number;

    @IsNumber()
    @IsNotEmpty()
    concertId!: number;
}

export class UpdateBookHistoryDto {
    @IsNumber()
    userId?: number;

    @IsNumber()
    concertId?: number;

    @IsString()
    status?: string;
}