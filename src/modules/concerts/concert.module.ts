import { Module } from '@nestjs/common';
import { ConcertController } from './concert.controller';
import { ConcertService } from './concert.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
    imports: [
        PrismaModule
    ],
    controllers: [ConcertController],
    providers: [ConcertService],
})
export class ConcertModule { }
