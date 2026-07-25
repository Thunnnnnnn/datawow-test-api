import { Controller, Delete, Get, Param, Post, Put, Body, UseGuards } from '@nestjs/common';
import { BookHistoriesService } from './book-histories.service';
import { CreateBookHistoryDto, BookHistoryResponseDto, UpdateBookHistoryDto } from './dto/book-histories.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/book-histories')
export class BookHistoriesController {
    constructor(private readonly bookHistoriesService: BookHistoriesService) { }

    @UseGuards(AuthGuard)
    @Get()
    getBookHistories(): Promise<BookHistoryResponseDto[]> {
        return this.bookHistoriesService.getBookHistories();
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    getBookHistoryById(@Param('id') id: number): Promise<BookHistoryResponseDto | null> {
        return this.bookHistoriesService.getBookHistoryById(+id);
    }

    @UseGuards(AuthGuard)
    @Get('/user/:userId')
    getBookHistoriesByUserId(@Param('userId') userId: number): Promise<BookHistoryResponseDto[]> {
        return this.bookHistoriesService.getBookHistoriesByUserId(+userId);
    }

    @UseGuards(AuthGuard)
    @Post()
    createBookHistory(@Body() data: CreateBookHistoryDto): Promise<BookHistoryResponseDto> {
        return this.bookHistoriesService.createBookHistory(data);
    }

    @UseGuards(AuthGuard)
    @Put('/:id')
    updateBookHistory(@Param('id') id: number, @Body() data: Partial<UpdateBookHistoryDto>): Promise<BookHistoryResponseDto | null> {
        return this.bookHistoriesService.updateBookHistory(+id, data);
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    deleteBookHistory(@Param('id') id: number): Promise<{ message: string } | null> {
        return this.bookHistoriesService.deleteBookHistory(+id);
    }
}
