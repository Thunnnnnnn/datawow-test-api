import { Controller, Delete, Get, Param, Post, Put, Body } from '@nestjs/common';
import { BookHistoriesService } from './book-histories.service';
import { CreateBookHistoryDto, BookHistoryResponseDto, UpdateBookHistoryDto } from './dto/book-histories.dto';

@Controller('/book-histories')
export class BookHistoriesController {
    constructor(private readonly bookHistoriesService: BookHistoriesService) { }

    @Get()
    getBookHistories(): Promise<BookHistoryResponseDto[]> {
        return this.bookHistoriesService.getBookHistories();
    }

    @Get('/:id')
    getBookHistoryById(@Param('id') id: number): Promise<BookHistoryResponseDto | null> {
        return this.bookHistoriesService.getBookHistoryById(+id);
    }

    @Post()
    createBookHistory(@Body() data: CreateBookHistoryDto): Promise<BookHistoryResponseDto> {
        return this.bookHistoriesService.createBookHistory(data);
    }

    @Put('/:id')
    updateBookHistory(@Param('id') id: number, @Body() data: Partial<UpdateBookHistoryDto>): Promise<BookHistoryResponseDto | null> {
        return this.bookHistoriesService.updateBookHistory(+id, data);
    }

    @Delete('/:id')
    deleteBookHistory(@Param('id') id: number): Promise<{ message: string } | null> {
        return this.bookHistoriesService.deleteBookHistory(+id);
    }
}
