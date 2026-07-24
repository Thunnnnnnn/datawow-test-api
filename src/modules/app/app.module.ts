import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../../database/prisma.module';
import { UserModule } from '../users/user.module';
import { ConcertModule } from '../concerts/concert.module';
import { BookHistoriesModule } from '../book-histories/book-histories.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConcertModule,
    BookHistoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
