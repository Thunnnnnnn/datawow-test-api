import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto, ConcertResponseDto, UpdateConcertDto } from './dto/concert.dto';

@Controller('/concerts')
export class ConcertController {
    constructor(private readonly concertService: ConcertService) { }

    @Get()
    getConcerts(): Promise<ConcertResponseDto[]> {
        return this.concertService.getConcerts();
    }

    @Get('/:id')
    getConcertById(@Param('id') id: number): Promise<ConcertResponseDto | null> {
        return this.concertService.getConcertById(+id);
    }

    @Post()
    createConcert(@Body() data: CreateConcertDto): Promise<ConcertResponseDto> {
        return this.concertService.createConcert(data);
    }

    @Put('/:id')
    updateConcert(@Param('id') id: number, @Body() data: Partial<UpdateConcertDto>): Promise<ConcertResponseDto | null> {
        return this.concertService.updateConcert(+id, data);
    }

    @Delete('/:id')
    deleteConcert(@Param('id') id: number): Promise<{ message: string } | null> {
        return this.concertService.deleteConcert(+id);
    }
}
