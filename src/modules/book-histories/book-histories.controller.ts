import { Controller, Delete, Get, Param, Post, Put, Body, UseGuards, Req } from '@nestjs/common';
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
    @Get('/user')
    getBookHistoriesByUserId(@Req() req: Request): Promise<BookHistoryResponseDto[]> {
        const userId = req['user'].sub;
        return this.bookHistoriesService.getBookHistoriesByUser(+userId);
    }

    @UseGuards(AuthGuard)
    @Get('/:id')
    getBookHistoryById(@Param('id') id: number): Promise<BookHistoryResponseDto | null> {
        return this.bookHistoriesService.getBookHistoryById(+id);
    }

    @UseGuards(AuthGuard)
    @Post()
    createBookHistory(@Req() req: Request, @Body() data: CreateBookHistoryDto): Promise<BookHistoryResponseDto> {
        const userId = req['user'].sub;
        return this.bookHistoriesService.createBookHistory({
            userId: +userId,
            concertId: data.concertId,
        });
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
