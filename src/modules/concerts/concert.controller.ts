import { Controller, Delete, Get, Param, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto, ConcertResponseDto, UpdateConcertDto, ConcertCountResponseDto } from './dto/concert.dto';
import { Role } from 'src/common/constants/role.enum';
import { Roles } from 'src/common/decorators/role.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/common/guard/role.guard';

@Controller('/concerts')
export class ConcertController {
    constructor(private readonly concertService: ConcertService) { }

    @UseGuards(AuthGuard)
    @Get()
    getConcerts(): Promise<ConcertResponseDto[]> {
        return this.concertService.getConcerts();
    }

    @UseGuards(AuthGuard)
    @Get('/count')
    getAllConcertCount(): Promise<ConcertCountResponseDto> {
        return this.concertService.getAllConcertCount();
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    getConcertById(@Param('id') id: number): Promise<ConcertResponseDto | null> {
        return this.concertService.getConcertById(+id);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    createConcert(@Body() data: CreateConcertDto): Promise<ConcertResponseDto> {
        return this.concertService.createConcert(data);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put('/:id')
    updateConcert(@Param('id') id: number, @Body() data: Partial<UpdateConcertDto>): Promise<ConcertResponseDto | null> {
        return this.concertService.updateConcert(+id, data);
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete('/:id')
    deleteConcert(@Param('id') id: number): Promise<{ message: string } | null> {
        return this.concertService.deleteConcert(+id);
    }
}
