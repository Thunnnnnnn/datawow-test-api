import { ConcertResponseDto } from "src/modules/concerts/dto/concert.dto";
import { UserResponseDto } from "src/modules/users/dto/user.dto";

export class LogResponseDto {
    id!: number;
    action!: string;
    userId!: number;
    user!: UserResponseDto;
    concertId!: number;
    concert!: ConcertResponseDto;
    createdAt!: Date;
}