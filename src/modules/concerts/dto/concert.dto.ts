import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class ConcertResponseDto {
    id!: number;
    name!: string;
    detail!: string;
    limit!: number;
    createdAt!: Date;
    updatedAt!: Date;
}

export class CreateConcertDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    @IsNotEmpty()
    detail!: string;

    @IsNumber()
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