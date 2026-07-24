import { Module } from '@nestjs/common';
import { BookHistoriesController } from './book-histories.controller';
import { BookHistoriesService } from './book-histories.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [
    PrismaModule
  ],
  controllers: [BookHistoriesController],
  providers: [BookHistoriesService],
})
export class BookHistoriesModule {}
