import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class ConcertResponseDto {
    id!: number;
    name!: string;
    detail!: string;
    limit!: number;
    bookedCount!: number;
    createdAt!: Date;
    updatedAt!: Date;
}

export class ConcertCountResponseDto {
    count!: number;
    bookedCount!: number;
    cancelCount!: number;
}

export class CreateConcertDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    detail!: string;

    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    limit!: number;
}

export class UpdateConcertDto {
    @IsString()
    name?: string;

    @IsString()
    detail?: string;

    @IsNumber()
    limit?: number;
}